// 即時関数（ファイル全体を一つの関数として扱い、ローカルスコープにする）
(() => {

    // 初期化
    let canvas = null
    let ctx = null

    // htmlを読んだ後に実行する
    window.addEventListener('load', () => {
        initialize();
        render();
    }, false);


    function initialize(){
        // セレクタ取得
        canvas = document.body.querySelector('#main_canvas');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext('2d');
    }

    function render(){
        let startRadian = Math.random() * Math.PI * 2.0;
        let endRadian = Math.random() * Math.PI * 2.0;
        drawFan(200, 200, 100, startRadian, endRadian, '#110099');
    }

    function drawFan(x, y, radius, startRadian, endRadian, color){
        if(color != null){
            ctx.fillStyle = color;
        }

        ctx.beginPath();

        ctx.moveTo(x, y);

        ctx.arc(x, y, radius, startRadian, endRadian);

        ctx.closePath();

        ctx.fill();
    }

})();