(() => {
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    let util = null;
    
    let canvas = null;
    
    let ctx = null;
    
    let image = null;

    let startTime = null;

    let viper = null;

    window.addEventListener('load', () => {
        
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));

        canvas = util.canvas;

        ctx = util.context;

        util.imageLoader('./image/viper.png', (loadedImage) => {
            image = loadedImage;
            initialize();
            eventSetting();
            startTime = Date.now();
            render();
        })
    }, false);

    function initialize(){
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        viper = new Viper(ctx, 0, 0, 64, 64, image);

        viper.setComing(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT,
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 100
        );
    }

    function eventSetting(){
        window.addEventListener('keydown', (event) => {

            if(viper.isComing === true){
                return;
            }

            switch(event.key){
                case 'ArrowLeft':
                    viper.position.x -= 10;
                    break;
                case 'ArrowRight':
                    viper.position.x += 10;
                    break;
                case 'ArrowUp':
                    viper.position.y -= 10;
                    break;
                case 'ArrowDown':
                    viper.position.y += 10;
                    break;
            }
        }, false);
    }
    
    function render(){

        // 透明度
        ctx.globalAlpha = 1.0;

        // 毎回塗り潰す
        util.drawRect(0,0,canvas.width,canvas.height,'#eeeeee');

        let nowTime = (Date.now() - startTime) / 1000;

        viper.update();

        requestAnimationFrame(render);
    }
    
})();