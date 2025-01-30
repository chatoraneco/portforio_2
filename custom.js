window.onload = function() {
    const canvas = document.getElementById("puzzle");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = 'https://via.placeholder.com/300'; // パズルに使用する画像

    const rows = 3;  // 縦のピース数
    const cols = 3;  // 横のピース数
    const pieceWidth = canvas.width / cols;
    const pieceHeight = canvas.height / rows;
    
    let pieces = [];
    let emptyPiece = {x: 2, y: 2}; // 空のピースの位置

    img.onload = function() {
        createPuzzle();
    };

    function createPuzzle() {
        pieces = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let piece = {
                    x: x,
                    y: y,
                    image: ctx.getImageData(x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight),
                    originalX: x,
                    originalY: y
                };
                pieces.push(piece);
            }
        }
        drawPuzzle();
    }

    function drawPuzzle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(piece => {
            ctx.putImageData(piece.image, piece.x * pieceWidth, piece.y * pieceHeight);
        });
    }

    let draggingPiece = null;

    canvas.addEventListener('mousedown', function(e) {
        const { offsetX, offsetY } = e;
        const x = Math.floor(offsetX / pieceWidth);
        const y = Math.floor(offsetY / pieceHeight);

        // ドラッグするピースを特定
        draggingPiece = pieces.find(piece => piece.x === x && piece.y === y);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!draggingPiece) return;

        const { offsetX, offsetY } = e;
        draggingPiece.x = Math.floor(offsetX / pieceWidth);
        draggingPiece.y = Math.floor(offsetY / pieceHeight);

        drawPuzzle();
    });

    canvas.addEventListener('mouseup', function(e) {
        if (!draggingPiece) return;

        const { offsetX, offsetY } = e;
        const x = Math.floor(offsetX / pieceWidth);
        const y = Math.floor(offsetY / pieceHeight);

        // ドラッグしてきたピースが空の位置に来た場合、空のピースをその位置に設定
        if (x === emptyPiece.x && y === emptyPiece.y) {
            emptyPiece = {x: draggingPiece.x, y: draggingPiece.y};
        }

        // ピースを空の位置に移動
        draggingPiece.x = emptyPiece.x;
        draggingPiece.y = emptyPiece.y;

        // ドラッグを終了
        draggingPiece = null;
        drawPuzzle();
    });
};
