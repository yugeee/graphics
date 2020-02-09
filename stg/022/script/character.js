class Position {

    static calcLength(x, y){
        return Math.sqrt(x * x + y * y);
    }

    static calcNormal(x, y){
        let len = Position.calcLength(x, y);
        return new Position(x / len, y / len);
    }
    
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

    distance(target){
        let x = this.x - target.x;
        let y = this.y - target.y;
        return Math.sqrt(x * x + y * y);
    }
}


class Character{
    constructor(ctx, x , y, w, h, life, imagePath){
        this.ctx = ctx;
        
        this.position = new Position(x, y);

        this.vector = new Position(0.0, -1.0);

        // 初期状態、上向き
        this.angle = 270 * Math.PI / 180;
        
        this.width = w;
        
        this.height = h;
        
        this.life = life;
        
        this.ready = false;

        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.ready = true;
        }, false);
        this.image.src = imagePath;
    }

    setVector(x, y){
        this.vector.set(x, y);
    }

    setVectorFromAngle(angle){
        this.angle = angle;

        let sin = Math.sin(angle);
        let cos = Math.cos(angle);

        this.vector.set(cos, sin);
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

    rotationDraw(){
        this.ctx.save();

        this.ctx.translate(this.position.x, this.position.y);

        this.ctx.rotate(this.angle - Math.PI * 1.5);

        let offsetX = this.width / 2;
        let offsetY = this.height / 2;

        this.ctx.drawImage(
            this.image,
            -offsetX,
            -offsetY,
            this.width,
            this.height
        );

        this.ctx.restore();
    }
}


class Viper extends Character{
    constructor(ctx, x, y, w, h, imagePath){
        super(ctx, x, y, w, h, 1, imagePath);

        this.speed = 3;

        this.shotCheckCounter = 0;

        this.shotInterval = 10;

        this.isComing = false;

        this.comingStart = null;

        this.comingStartPosition = null;

        this.comingEndPosition = null;

        this.shotArray = null;

        this.singleShotArray = null;
    }

    /**
     * 登場開始と終了の位置をセット
     */
    setComing(startX, startY, endX, endY){
        this.life = 1;

        this.isComing = true;

        this.comingStart = Date.now();

        this.position.set(startX, startY);

        this.comingStartPosition = new Position(startX, startY);

        this.comingEndPosition = new Position(endX, endY);
    }

    setShotArray(shotArray, singleShotArray){
        this.shotArray = shotArray;
        this.singleShotArray = singleShotArray;
    }

    update(){
        if(this.life <= 0){
            return;
        }
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

            if(window.isKeyDown.key_z === true){
                if(this.shotCheckCounter >= 0){
                    let i;
                    for(i = 0; i < this.shotArray.length; ++i){
                        if(this.shotArray[i].life <= 0){
                            this.shotArray[i].set(this.position.x, this.position.y);
                            this.shotArray[i].setPower(2);
                            this.shotCheckCounter = -this.shotInterval;
                            break;
                        }
                    }

                    for(i = 0; i < this.singleShotArray.length; i += 2){
                        if(this.singleShotArray[i].life <= 0 && this.singleShotArray[i + 1].life <= 0){
                            let radCW = 280 * Math.PI / 180;
                            let radCCW = 260 * Math.PI / 180;
                            
                            this.singleShotArray[i].set(this.position.x, this.position.y);
                            this.singleShotArray[i].setVectorFromAngle(radCW);
                            this.singleShotArray[i + 1].set(this.position.x, this.position.y);
                            this.singleShotArray[i + 1].setVectorFromAngle(radCCW);
                            this.shotCheckCounter = -this.shotInterval;
                            break;
                        }
                    }
                }
            }
            ++this.shotCheckCounter;
        }

        this.draw();

        this.ctx.globalAlpha = 1.0;
    }
}


class Enemy extends Character {
    constructor(ctx, x, y, w, h, imagePath){
        super(ctx, x, y, w, h, 0, imagePath);
        this.type = 'default';
        this.frame = 0;
        this.speed = 3;
        this.shotArray = null;
        this.attackTarget = null;
    }

    set(x, y, life = 1, type = 'default'){
        this.position.set(x, y);

        this.life = life;

        this.type = type;

        this.frame = 0;
    }

    setShotArray(shotArray){
        this.shotArray = shotArray;
    }

    setAttackTarget(target){
        this.attackTarget = target;
    }

    update(){
        if(this.life <= 0){
            return;
        }

        switch(this.type){
            case 'wave':
                if(this.frame % 60 === 0){
                    let tx = this.attackTarget.position.x - this.position.x;
                    let ty = this.attackTarget.position.y - this.position.y;
                    let tv = Position.calcNormal(tx, ty);
                    this.fire(tv.x, tv.y, 4.0);
                }
                
                this.position.x += Math.sin(this.frame / 10);
                this.position.y += 2.0;

                if(this.position.y - this.height > this.ctx.canvas.height){
                    this.life = 0;
                }
                break;

                case 'large':
                        if(this.frame % 50 === 0){
                            for(let i = 0; i < 360; i += 45){
                                let r = i * Math.PI / 180;
                                let s = Math.sin(r);
                                let c = Math.cos(r);
                                this.fire(c, s, 3.0);
                            }
                        }
                        
                        this.position.x += Math.sin((this.frame + 90) / 50) * 2.0;
                        this.position.y += 1.0;
        
                        if(this.position.y - this.height > this.ctx.canvas.height){
                            this.life = 0;
                        }
                        break;
                

            case 'default':
            default:
                if(this.frame === 100){
                    this.fire();
                }
                
                this.position.x += this.vector.x * this.speed;
                this.position.y += this.vector.y * this.speed;

                if(this.position.y - this.height > this.ctx.canvas.height){
                    this.life = 0;
                }
                break;

        }

        this.draw();
        ++this.frame;
    }

    fire(x = 0.0, y = 1.0, speed = 5.0){
        for(let i = 0; i < this.shotArray.length; ++i){
            if(this.shotArray[i].life <= 0){
                this.shotArray[i].set(this.position.x, this.position.y);
                this.shotArray[i].setSpeed(speed);
                this.shotArray[i].setVector(x, y);
                break;
            }
        }
    }
}


class Shot extends Character {
    constructor(ctx, x, y, w, h, imagePath){
        super(ctx, x, y, w, h, 0, imagePath);

        this.speed = 7;

        this.power = 1;

        this.targetArray = [];
    }

    set(x, y){
        this.position.set(x, y);

        // ショットが出ている状態
        this.life = 1;
    }

    setSpeed(speed){
        if(speed != null && speed > 0){
            this.speed = speed;
        }
    }

    setPower(power){
        if(power != null && power > 0){
            this.power = power;
        }
    }

    setTargets(targets){
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.targetArray = targets;
        }
    }

    update(){
        if(this.life <= 0){
            return;
        }

        if(
            this.position.x + this.width < 0 || 
            this.position.x - this.width > this.ctx.canvas.width ||
            this.position.y + this.height < 0 || 
            this.position.y - this.height > this.ctx.canvas.height
            ){
            this.life = 0;
        }

        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        this.targetArray.map((v) => {
            if(this.life <= 0 || v.life <= 0){
                return;
            }

            let dist = this.position.distance(v.position);

            if(dist <= (this.width + v.width) / 4){
                if(v instanceof Viper === true){
                    if(v.isComing === true){
                        return;
                    }
                }

                v.life -= this.power;

                if(v.life <= 0){
                    for(let i = 0; i < this.explosionArray.length; ++i){
                        if(this.explosionArray[i].life !== true){
                            this.explosionArray[i].set(v.position.x, v.position.y);
                            break;
                        }
                    }

                    if(v instanceof Enemy === true){
                        let score = 100;
                        if(v.type === 'large'){
                            score = 1000;
                        }
                        gameScore = Math.min(gameScore + score, 99999);
                    }
                }
                this.life = 0;
            }
        });

        this.rotationDraw();
    }

    setExplosions(targets){
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.explosionArray = targets;
        }
    }
}


class Explosion {
    constructor(ctx, radius, count, size, timeRange, color = '#ff1166'){
        this.ctx = ctx;

        this.life = false;

        this.color = color;

        this.position = null;

        this.radius = radius;

        this.count = count;

        this.startTime = 0;

        this.timeRange = timeRange;

        this.fireBaseSize = size;

        this.sound = null;

        this.fireSize = [];

        this.firePosition = [];

        this.fireVector = [];
    }

    set(x, y){
        for(let i = 0; i < this.count; ++i){
            this.firePosition[i] = new Position(x, y);
            let vr = Math.random() * Math.PI * 2.0;
            let s = Math.sin(vr);
            let c = Math.cos(vr);

            let mr = Math.random();
            this.fireVector[i] = new Position(c * mr, s * mr);

            this.fireSize[i] = (Math.random() * 0.5 + 0.5) * this.fireBaseSize;
        }

        this.life = true;
        this.startTime = Date.now();
    }

    setSound(sound){
        this.sound = sound;
    }

    update(){
        if(this.life !== true){
            return;
        }

        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = 0.5;

        let time = (Date.now() - this.startTime) / 1000;

        let ease = simpleEaseIn(1.0 - Math.min(time / this.timeRange, 1.0));

        let progress = 1.0 - ease;

        for(let i = 0; i < this.firePosition.length; ++i){
            let d = this.radius * progress;

            let x = this.firePosition[i].x + this.fireVector[i].x * d;
            let y = this.firePosition[i].y + this.fireVector[i].y * d;

            let s = 1.0 - progress;

            this.ctx.fillRect(
                x - (this.fireSize[i] * s) / 2,
                y - (this.fireSize[i] * s) / 2,
                this.fireSize[i] * s,
                this.fireSize[i] * s
            );
        }

        if(progress >= 1.0){
            this.life = false;
        }
    }
}


class BackgroundStar{
    constructor(ctx, size, speed, color = '#ffffff'){
        this.ctx = ctx;
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.position = null;
    }

    set(x, y){
        this.position = new Position(x, y);
    }

    update(){
        this.ctx.fillStyle = this.color;

        this.position.y += this.speed;

        this.ctx.fillRect(
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size
        );

        if(this.position.y + this.size > this.ctx.canvas.height){
            this.position.y = -this.size;
        }
    }
}

function simpleEaseIn(t){
    return t * t * t * t;
}