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
        drawLine(100, 100, 200, 200, '#ff0000');
    }

    function drawRect(x, y, width, height, color) {
        if(color != null){
            ctx.fillStyle = color;
        }

        ctx.fillRect(x, y, width, height);
    }

    function drawLine(x1, y1, x2, y2, color, width = 1){

        // 色が指定されている場合はスタイルを設定する
        if(color != null){
            ctx.strokeStyle = color;
        }

        // 線幅を設定する
        ctx.lineWidth = width;

        // パスの設定を開始することを明示する
        ctx.beginPath();

        // パスの始点を設定する
        ctx.moveTo(x1, y1);

        // 直線のパスを終点座標に向けて設定する
        ctx.lineTo(x2, y2);

        // パスを閉じることを明示する
        ctx.closePath();

        // 設定したパスで線描が
        ctx.stroke();
    }

})();