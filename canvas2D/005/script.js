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
        drawCircle(200, 200, 100, '#110099');
    }

    function drawCircle(x, y, radius, color){
        if(color != null){
            ctx.fillStyle = color;
        }

        ctx.beginPath();

        ctx.arc(x, y, radius, 0.0, Math.PI * 1.0);

        ctx.closePath();

        ctx.fill();
    }

})();