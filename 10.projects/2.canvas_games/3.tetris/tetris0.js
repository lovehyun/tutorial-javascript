// HTML에서 tetrisCanvas 요소를 가져와서 2D 컨텍스트를 얻어옵니다.
const canvas = document.getElementById('tetrisCanvas');
const context = canvas.getContext('2d');

// 블록의 크기를 정의합니다.
const blockSize = 30;

// 게임 보드의 행과 열 수를 정의합니다.
const rows = 20;
const cols = 10;

// 게임 보드를 나타내는 배열을 생성하고 초기값을 0으로 채웁니다.
const gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));

// 다양한 테트리스 블록의 모양을 정의한 배열입니다.
const tetrisBlocks = [
    [[1, 1, 1, 1]],   // I 블록
    [[1, 1, 1], [1]], // L 블록
    [[1, 1, 1], [0, 1]], // J 블록
    [[1, 1, 1], [1, 0]], // T 블록
    [[1, 1], [1, 1]],   // O 블록
    [[1, 1, 1], [0, 0, 1]], // S 블록
    [[1, 1, 1], [1, 0, 0]], // Z 블록
];

// 현재 블록의 정보를 저장하는 변수들을 초기화합니다.
let currentBlock;
let currentX;
let currentY;

// 현재 게임 상태를 화면에 그리는 함수입니다.
function drawBlock(x, y, block) {
    for (let i = 0; i < block.length; i++) {
        for (let j = 0; j < block[i].length; j++) {
            if (block[i][j]) {
                // 블록이 있는 위치를 색으로 채우고 테두리를 그립니다.
                context.fillStyle = '#0095DD';
                context.fillRect((x + j) * blockSize, (y + i) * blockSize, blockSize, blockSize);
                context.strokeStyle = '#003366';
                context.strokeRect((x + j) * blockSize, (y + i) * blockSize, blockSize, blockSize);
            }
        }
    }
}

// 현재 게임 상태를 그리는 함수입니다.
function draw() {
    // 캔버스를 초기화합니다.
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 게임 보드를 그립니다.
    drawGameBoard();

    // 현재 블록이 없다면 새로운 블록을 생성합니다.
    if (!currentBlock) {
        spawnBlock();
    }

    // 현재 블록을 그립니다.
    drawBlock(currentX, currentY, currentBlock);
}

// 새로운 블록을 생성하는 함수입니다.
function spawnBlock() {
    // 랜덤한 인덱스로부터 테트리스 블록을 선택하여 현재 블록으로 설정합니다.
    const randomIndex = Math.floor(Math.random() * tetrisBlocks.length);
    currentBlock = tetrisBlocks[randomIndex];

    // 블록의 시작 위치를 설정합니다.
    currentX = Math.floor((cols - currentBlock[0].length) / 2);
    currentY = 0;
}

// 키보드 입력을 처리하는 함수입니다.
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    // 키 입력에 따라 블록을 이동하거나 회전시킵니다.
    if (event.key === 'ArrowLeft') {
        moveBlockLeft();
    } else if (event.key === 'ArrowRight') {
        moveBlockRight();
    } else if (event.key === 'ArrowUp') {
        rotateBlock();
    }
    
    // 게임 상태를 업데이트하고 화면을 그립니다.
    draw();
}

// 블록을 아래로 이동시키는 함수입니다.
function moveBlockDown() {
    // 한 칸 아래로 이동합니다.
    currentY += 1;

    // 충돌이 발생하면 블록을 한 칸 위로 옮겨서 병합하고 가득 찬 줄을 체크한 후 새로운 블록을 생성합니다.
    if (collision()) {
        currentY -= 1;
        spawnBlock();
    }
}

// 블록을 왼쪽으로 이동시키는 함수입니다.
function moveBlockLeft() {
    // 한 칸 왼쪽으로 이동합니다.
    currentX -= 1;

    // 충돌이 발생하면 블록을 한 칸 오른쪽으로 옮깁니다.
    if (collision()) {
        currentX += 1;
    }
}

// 블록을 오른쪽으로 이동시키는 함수입니다.
function moveBlockRight() {
    // 한 칸 오른쪽으로 이동합니다.
    currentX += 1;

    // 충돌이 발생하면 블록을 한 칸 왼쪽으로 옮깁니다.
    if (collision()) {
        currentX -= 1;
    }
}

// 블록을 시계 방향으로 회전시키는 함수입니다.
function rotateBlock() {
    // 현재 블록을 회전시킨 후 충돌이 발생하면 다시 이전 상태로 되돌립니다.
    const originalBlock = currentBlock;
    currentBlock = rotateClockwise(currentBlock);
    if (collision()) {
        currentBlock = originalBlock;
    }
}

// 블록을 시계 방향으로 90도 회전시키는 함수입니다.
function rotateClockwise(block) {
    const rotatedBlock = [];
    const rows = block.length;
    const cols = block[0].length;

    // 시계 방향으로 90도 회전한 새로운 블록을 생성합니다.
    for (let i = 0; i < cols; i++) {
        rotatedBlock[i] = [];
        for (let j = rows - 1; j >= 0; j--) {
            rotatedBlock[i][rows - 1 - j] = block[j][i];
        }
    }

    return rotatedBlock;
}

// 블록을 반시계 방향으로 90도 회전시키는 함수입니다.
function rotateCounterClockwise(block) {
    const rotatedBlock = [];
    const rows = block.length;
    const cols = block[0].length;

    // 반시계 방향으로 90도 회전한 새로운 블록을 생성합니다.
    for (let i = 0; i < cols; i++) {
        rotatedBlock[i] = [];
        for (let j = 0; j < rows; j++) {
            rotatedBlock[i][j] = block[rows - 1 - j][i];
        }
    }

    return rotatedBlock;
}

// 블록이 충돌하는지 확인하는 함수입니다.
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
                // 충돌이 발생하면 true를 반환합니다.
                return true;
            }
        }
    }
    // 충돌이 없으면 false를 반환합니다.
    return false;
}

// 게임 보드를 화면에 그리는 함수입니다.
function drawGameBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j]) {
                // 게임 보드의 각 셀에 블록이 있는 경우를 색으로 채우고 테두리를 그립니다.
                context.fillStyle = '#0095DD';
                context.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
                context.strokeStyle = '#003366';
                context.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
            }
        }
    }
}

// 초당 프레임 수를 정의합니다.
const framesPerSecond = 1;

// 게임 상태를 업데이트하는 함수입니다.
function update() {
    draw();
    moveBlockDown();

    // 일정 시간 간격으로 업데이트를 반복합니다.
    setTimeout(update, 1000 / framesPerSecond);
}

// 초기 게임 업데이트를 시작합니다.
update();
