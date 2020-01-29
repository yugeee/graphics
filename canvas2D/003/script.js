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
        let points = [
            100, 100,
            300, 100,
            100, 300,
            300, 300
        ];

        drawPolygon(points, '#ff0000');
    }

    function drawPolygon(points, color){
        
        // 配列であるか、多角形を書くだけの座標があるか
        if(Array.isArray(points) !== true || points.length < 6){
            return
        }

        if(color != null){
            ctx.fillStyle = color;
        }

        ctx.beginPath();

        ctx.moveTo(points[0], points[1]);

        for(let i = 2; i < points.length; i += 2) {
            ctx.lineTo(points[i], points[i + 1]);
        }

        ctx.closePath();

        ctx.stroke();

    }

})();