const boardSize = 4;
let board = [];
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    spawnTile();
    spawnTile();
    updateBoard();
});

function createBoard() {
    const boardElement = document.getElementById("game-board");
    boardElement.innerHTML = "";
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

    for (let i = 0; i < boardSize * boardSize; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("id", `tile-${Math.floor(i / boardSize)}-${i % boardSize}`);
        boardElement.appendChild(tile);
    }
}

function spawnTile() {
    let emptyTiles = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) emptyTiles.push({ r, c });
        }
    }

    if (emptyTiles.length > 0) {
        let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

//Update Board
function updateBoard() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            tile.innerText = board[r][c] === 0 ? "" : board[r][c];
            tile.style.backgroundColor = getTileColor(board[r][c]);
        }
    }
    document.getElementById("score").innerText = `Score: ${score}`;
}

//Tiles Color
function getTileColor(value) {
    const colors = {
        0: "#cdc1b4",
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e"
    };
    return colors[value] || "#3c3a32";
}

//Move Function
function move(direction) {
    let moved = false;
    for (let i = 0; i < boardSize; i++) {
        let row = direction === "left" || direction === "right" ? board[i] : board.map(row => row[i]);

        if (direction === "right" || direction === "down") row.reverse();
        let newRow = row.filter(v => v !== 0);
        
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow.splice(j + 1, 1);
            }
        }

        while (newRow.length < boardSize) newRow.push(0);
        if (direction === "right" || direction === "down") newRow.reverse();

        if (direction === "left" || direction === "right") {
            if (board[i].toString() !== newRow.toString()) moved = true;
            board[i] = newRow;
        } else {
            let column = board.map(row => row[i]);
            if (column.toString() !== newRow.toString()) moved = true;
            for (let j = 0; j < boardSize; j++) board[j][i] = newRow[j];
        }
    }
    if (moved) {
        spawnTile();
        updateBoard();
        checkGameOver();
    }
}

//Game Over Function
function checkGameOver() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) return;
            if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return;
            if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return;
        }
    }
    alert(`Game Over! Final Score: ${score}`);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move("left");
    else if (event.key === "ArrowRight") move("right");
    else if (event.key === "ArrowUp") move("up");
    else if (event.key === "ArrowDown") move("down");
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new-game").addEventListener("click", resetGame);
});

function resetGame() {
    console.log("Reset clicked");
    score = 0;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0)); // Reset board array
    createBoard(); // Recreate the board UI
    spawnTile(); // Spawn first tile
    spawnTile(); // Spawn second tile
    updateBoard(); // Update UI with new tiles
}

