class Position {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    set(x, y){
        if(x != null){
            this.x = x;
        }
        if(y != null){
            this.y = y;
        }
    }
}


class Character{
    constructor(ctx, x , y, w, h, life, image){
        this.ctx = ctx;
        this.position = new Position(x, y);
        this.width = w;
        this.height = h;
        this.life = life;
        this.image = image;
    }

    draw(){
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;

        this.ctx.drawImage(
            this.image,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }
}


class Viper extends Character{
    constructor(ctx, x, y, w, h, image){
        super(ctx, x, y, w, h, 0, image);

        this.speed = 3;

        this.isComing = false;

        this.comingStart = null;

        this.comingStartPosition = null;

        this.comingEndPosition = null;
    }

    /**
     * 登場開始と終了の位置をセット
     */
    setComing(startX, startY, endX, endY){
        this.isComing = true;

        this.comingStart = Date.now();

        this.position.set(startX, startY);

        this.comingStartPosition = new Position(startX, startY);

        this.comingEndPosition = new Position(endX, endY);
    }

    update(){
        let justTime = Date.now();

        if(this.isComing == true){

            let comingTime = (justTime - this.comingStart) / 1000;

            let y = this.comingStartPosition.y - comingTime * 50;

            if(y <= this.comingEndPosition.y){
                this.isComing = false;
                y = this.comingEndPosition.y;
            }

            this.position.set(this.position.x, y);

            if(justTime % 100 < 50){
                this.ctx.globalAlpha = 0.5;
            }
        } else {
            if(window.isKeyDown.key_ArrowLeft === true){
                this.position.x -= this.speed;
            }
            if(window.isKeyDown.key_ArrowRight === true){
                this.position.x += this.speed;
            }
            if(window.isKeyDown.key_ArrowUp === true){
                this.position.y -= this.speed;
            }
            if(window.isKeyDown.key_ArrowDown === true){
                this.position.y += this.speed;
            }

            let canvasWidth = this.ctx.canvas.width;
            let canvasHeight = this.ctx.canvas.height;
            let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
            let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);

            this.position.set(tx, ty);
        }

        this.draw();

        this.ctx.globalAlpha = 1.0;
    }
}