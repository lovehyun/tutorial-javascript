// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

const TILE_SIZE = 32;
const COLUMNS = 20;
const ROWS = 15;
const SPEED = 200; // ms

const DIRECTIONS = {
    UP: [0, -1],
    RIGHT: [1, 0],
    DOWN: [0, 1],
    LEFT: [-1, 0]
};

const SNAKE_TILES = {
    head: {
        up: { tx: 3, ty: 0 },
        right: { tx: 4, ty: 0 },
        down: { tx: 4, ty: 1 },
        left: { tx: 3, ty: 1 },
    }
};

let canvas, context;
let snake, snakeImage;

// `window.onload`에서 초기화 함수 호출
window.onload = initialize;

// 초기화 함수
function initialize() {
    canvas = document.getElementById("snakeCanvas");
    context = canvas.getContext("2d");

    canvas.width = COLUMNS * TILE_SIZE;
    canvas.height = ROWS * TILE_SIZE;

    snakeImage = new Image();
    snakeImage.src = "snake-graphics.png";

    snake = {
        x: 10,
        y: 7,
        direction: DIRECTIONS.RIGHT
    };

    // 키 이벤트 리스너 추가
    setupEventListeners();

    // 스프라이트 이미지가 로드된 후 게임 루프 시작
    snakeImage.onload = () => gameLoop();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" && snake.direction !== DIRECTIONS.DOWN) {
            snake.direction = DIRECTIONS.UP;
        } else if (e.key === "ArrowDown" && snake.direction !== DIRECTIONS.UP) {
            snake.direction = DIRECTIONS.DOWN;
        } else if (e.key === "ArrowLeft" && snake.direction !== DIRECTIONS.RIGHT) {
            snake.direction = DIRECTIONS.LEFT;
        } else if (e.key === "ArrowRight" && snake.direction !== DIRECTIONS.LEFT) {
            snake.direction = DIRECTIONS.RIGHT;
        }
    });
}

// 타일 그리기 함수
function drawTile(tx, ty, x, y) {
    context.drawImage(
        snakeImage,
        tx * 64, ty * 64, 64, 64,
        x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
}

// 게임 루프
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 뱀 그리기
    let { tx, ty } = SNAKE_TILES.head.right;
    if (snake.direction === DIRECTIONS.UP) {
        ({ tx, ty } = SNAKE_TILES.head.up);
    } else if (snake.direction === DIRECTIONS.DOWN) {
        ({ tx, ty } = SNAKE_TILES.head.down);
    } else if (snake.direction === DIRECTIONS.LEFT) {
        ({ tx, ty } = SNAKE_TILES.head.left);
    }

    drawTile(tx, ty, snake.x, snake.y);

    snake.x += snake.direction[0];
    snake.y += snake.direction[1];

    if (snake.x < 0) snake.x = COLUMNS - 1;
    if (snake.x >= COLUMNS) snake.x = 0;
    if (snake.y < 0) snake.y = ROWS - 1;
    if (snake.y >= ROWS) snake.y = 0;

    setTimeout(gameLoop, SPEED);
}
