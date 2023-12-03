const canvas = document.getElementById('tetrisCanvas');
const context = canvas.getContext('2d');
const blockSize = 30;

const rows = 20; // 게임 보드의 행 수
const cols = 10; // 게임 보드의 열 수
const gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));

const tetrisBlocks = [
    [[1, 1, 1, 1]],   // I 블록
    [[1, 1, 1], [1]], // L 블록
    [[1, 1, 1], [0, 1]], // J 블록
    [[1, 1, 1], [1, 0]], // T 블록
    [[1, 1], [1, 1]],   // O 블록
    [[1, 1, 1], [0, 0, 1]], // S 블록
    [[1, 1, 1], [1, 0, 0]], // Z 블록
];

let currentBlock;
let currentX;
let currentY;
let gameOverFlag = false;

function drawBlock(x, y, block) {
    for (let i = 0; i < block.length; i++) {
        for (let j = 0; j < block[i].length; j++) {
            if (block[i][j]) {
                context.fillStyle = '#0095DD';
                context.fillRect((x + j) * blockSize, (y + i) * blockSize, blockSize, blockSize);
                context.strokeStyle = '#003366';
                context.strokeRect((x + j) * blockSize, (y + i) * blockSize, blockSize, blockSize);
            }
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 게임 보드 그리기
    drawGameBoard();

    if (!currentBlock) {
        spawnBlock();
    }

    drawBlock(currentX, currentY, currentBlock);
}

function spawnBlock() {
    if (gameOverFlag) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * tetrisBlocks.length);
    currentBlock = tetrisBlocks[randomIndex];
    currentX = Math.floor((cols - currentBlock[0].length) / 2);
    currentY = 0;

    if (collision()) {
        gameOver();
    }
}

function gameOver() {
    gameOverFlag = true;
    console.log('Game Over');
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (gameOverFlag) {
        return;
    }

    if (event.key === 'ArrowDown') {
        moveBlockDown2();
    } else if (event.key === 'ArrowLeft') {
        moveBlockLeft();
    } else if (event.key === 'ArrowRight') {
        moveBlockRight();
    } else if (event.key === 'ArrowUp') {
        rotateBlock();
    }
    draw();
}

function moveBlockDown() {
    // 한칸만 아래로 이동
    currentY += 1;

    if (collision()) {
        currentY -= 1;
        mergeBlock();
        checkFullLines();
        spawnBlock();
    }
}

function moveBlockDown2() {
    // 화면 아래까지 이동
    while (!collision()) {
        currentY += 1;
    }

    currentY -= 1;
    mergeBlock();
    checkFullLines();
    spawnBlock();
}

function moveBlockLeft() {
    currentX -= 1;
    if (collision()) {
        currentX += 1;
    }
}

function moveBlockRight() {
    currentX += 1;
    if (collision()) {
        currentX -= 1;
    }
}

function rotateBlock() {
    const originalBlock = currentBlock;
    currentBlock = rotateClockwise(currentBlock);
    if (collision()) {
        currentBlock = originalBlock;
    }
}

function rotateClockwise(block) {
    // 시계 방향으로 90도 회전 - 기본 테트리스 규칙
    const rotatedBlock = [];
    const rows = block.length;
    const cols = block[0].length;

    for (let i = 0; i < cols; i++) {
        rotatedBlock[i] = [];
        for (let j = rows - 1; j >= 0; j--) {
            rotatedBlock[i][rows - 1 - j] = block[j][i];
        }
    }

    return rotatedBlock;
}

function rotateCounterClockwise(block) {
    // 반시계 방향으로 90도 회전
    const rotatedBlock = [];
    const rows = block.length;
    const cols = block[0].length;

    for (let i = 0; i < cols; i++) {
        rotatedBlock[i] = [];
        for (let j = 0; j < rows; j++) {
            rotatedBlock[i][j] = block[rows - 1 - j][i];
        }
    }

    return rotatedBlock;
}

function collision() {
    for (let i = 0; i < currentBlock.length; i++) {
        for (let j = 0; j < currentBlock[i].length; j++) {
            if (
                currentBlock[i][j] &&
                (currentX + j < 0 ||
                currentX + j >= cols ||
                currentY + i >= rows ||
                gameBoard[currentY + i][currentX + j])
            ) {
                return true;
            }
        }
    }
    return false;
}

function mergeBlock() {
    for (let i = 0; i < currentBlock.length; i++) {
        for (let j = 0; j < currentBlock[i].length; j++) {
            if (currentBlock[i][j]) {
                gameBoard[currentY + i][currentX + j] = 1;
            }
        }
    }
}

function drawGameBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j]) {
                context.fillStyle = '#0095DD';
                context.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
                context.strokeStyle = '#003366';
                context.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
            }
        }
    }
}

function checkFullLines() {
    for (let i = rows - 1; i >= 0; i--) {
        if (gameBoard[i].every(cell => cell)) {
            // 해당 줄이 모두 차 있으면 삭제하고 윗 줄을 한 칸씩 내린다.
            gameBoard.splice(i, 1);
            gameBoard.unshift(Array(cols).fill(0));
        }
    }
}

const framesPerSecond = 1;

function update() {
    draw();
    moveBlockDown();

    if (!gameOverFlag) {
        setTimeout(update, 1000 / framesPerSecond);
    }
}

update();
