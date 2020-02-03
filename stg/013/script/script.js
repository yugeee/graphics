(() => {
    window.isKeyDown = {};

    const CANVAS_WIDTH = 640;
    
    const CANVAS_HEIGHT = 480;

    const SHOT_MAX_COUNT = 10;

    const ENEMY_MAX_COUNT = 10;

    const ENEMY_SHOT_MAX_COUNT = 50;

    let util = null;
    
    let canvas = null;
    
    let ctx = null;

    let startTime = null;

    let viper = null;

    let scene = null;

    let shotArray = [];

    let singleShotArray = [];

    let enemyArray = [];

    let enemyShotArray = [];

    window.addEventListener('load', () => {
        
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));

        canvas = util.canvas;

        ctx = util.context;
        
        initialize();
        loadCheck();

    }, false);

    function initialize(){
        let i;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        scene = new SceneManager();

        for(let i = 0; i < SHOT_MAX_COUNT; ++i){
            shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
            singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
            singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
        }

        viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');

        viper.setComing(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT + 50,
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 100
        );

        viper.setShotArray(shotArray, singleShotArray);

        for(i = 0; i < ENEMY_SHOT_MAX_COUNT; ++i){
            enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/enemy_shot.png');
        }

        for(i = 0; i < ENEMY_MAX_COUNT; ++i){
            enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, './image/enemy_small.png');
            enemyArray[i].setShotArray(enemyShotArray);
        }
    }

    function loadCheck(){
        let ready = true;

        ready = ready && viper.ready;

        enemyArray.map((v) => {
            ready && v.ready;
        });

        enemyShotArray.map((v) => {
            ready = ready && v.ready;
        });

        shotArray.map((v) => {
            ready && v.ready;
        });

        singleShotArray.map((v) => {
            ready && v.ready;
        });

        if(ready === true){
            eventSetting();

            sceneSetting();

            startTime = Date.now();

            render();
        }else{
            setTimeout(loadCheck, 100);
        }
    }

    function eventSetting(){
        window.addEventListener('keydown', (event) => {
            isKeyDown[`key_${event.key}`] = true;
        }, false);

        window.addEventListener('keyup', (event) => {
            isKeyDown[`key_${event.key}`] = false;
        }, false);
    }

    function sceneSetting(){
        scene.add('intro', (time) => {
            if(time > 2.0){
                scene.use('invade');
            }
        });

        scene.add('invade', (time) => {
            // シーンのフレーム数が 0 のときは敵キャラクターを配置する
            if(scene.frame === 0){
                // ライフが 0 の状態の敵キャラクターが見つかったら配置する
                for(let i = 0; i < ENEMY_MAX_COUNT; ++i){
                    if(enemyArray[i].life <= 0){
                        let e = enemyArray[i];
                        // 出現場所は X が画面中央、Y が画面上端の外側に設定する
                        e.set(CANVAS_WIDTH / 2, -e.height, 1, 'default');
                        // 進行方向は真下に向かうように設定する
                        e.setVector(0.0, 1.0);
                        break;
                    }
                }
            }
            // シーンのフレーム数が 100 になったときに再度 invade を設定する
            if(scene.frame === 100){
                scene.use('invade');
            }
        });

        scene.use('intro');
    }
    
    function render(){

        // 透明度
        ctx.globalAlpha = 1.0;

        // 毎回塗り潰す
        util.drawRect(0,0,canvas.width,canvas.height,'#eeeeee');

        let nowTime = (Date.now() - startTime) / 1000;

        scene.update();

        viper.update();

        enemyArray.map((v) => {
            v.update();
        });

        enemyShotArray.map((v) => {
            v.update();
        });

        shotArray.map((v) => {
            v.update();
        });

        singleShotArray.map((v) => {
            v.update();
        });

        requestAnimationFrame(render);
    }
    
})();