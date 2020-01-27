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
        ctx.fillStyle = '#000000';

        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

})();