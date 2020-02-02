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
    constructor(ctx, x , y, life, image){
        this.ctx = ctx;
        this.position = new Position(x, y);
        this.life = life;
        this.image = image;
    }

    draw(){
        this.ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y
        );
    }
}


class Viper extends Character{
    constructor(ctx, x, y, image){
        super(ctx, x, y, 0, image);

        this.isComing = false;

        this.comingStart = null;

        this.comingEndPosition = null;
    }

    /**
     * 登場開始と終了の位置をセット
     */
    setComing(startX, startY, endX, endY){
        this.isComing = true;

        this.comingStart = Date.now();

        this.position.set(startX, startY);

        this.comingEndPosition = new Position(endX, endY);
    }
}