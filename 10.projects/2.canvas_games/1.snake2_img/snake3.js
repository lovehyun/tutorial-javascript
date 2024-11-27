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
    },
    body: {
        horizontal: { tx: 1, ty: 0 },
        vertical: { tx: 2, ty: 1 },
        curveLeftDown: { tx: 2, ty: 0 }, // ╮
        curveLeftUp: { tx: 2, ty: 2 }, // ╯
        curveRightUp: { tx: 0, ty: 1 }, // ╰
        curveRightDown: { tx: 0, ty: 0 }, // ╭
    },
    tail: {
        up: { tx: 3, ty: 2 },
        right: { tx: 4, ty: 2 },
        down: { tx: 4, ty: 3 },
        left: { tx: 3, ty: 3 },
    },
    food: { tx: 0, ty: 3 },
};

let canvas, context;
let snake, snakeImage;
let food;

// 초기화 실행
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
        segments: [
            { x: 10, y: 7 }, // 머리
            { x: 9, y: 7 },  // 몸통
            { x: 8, y: 7 }   // 꼬리
        ],
        direction: DIRECTIONS.RIGHT
    };

    food = { x: 5, y: 5 };

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

// 뱀 이동
function moveSnake() {
    const head = snake.segments[0];
    const newHead = { x: head.x + snake.direction[0], y: head.y + snake.direction[1] };

    if (newHead.x === food.x && newHead.y === food.y) {
        snake.grow++;
        placeFood();
    } else if (snake.grow > 0) {
        snake.grow--;
    } else {
        snake.segments.pop(); // 꼬리를 삭제
    }

    snake.segments.unshift(newHead); // 머리를 새로운 위치로 이동
}

// 타일 그리기 함수
function drawTile(tx, ty, x, y) {
    context.drawImage(
        snakeImage,
        tx * 64, ty * 64, 64, 64,
        x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
}

// 뱀 그리기
function drawSnake() {
    snake.segments.forEach((segment, index) => {
        const tile = getTileForSegment(segment, index);
        drawTile(tile.tx, tile.ty, segment.x, segment.y);
    });
}

// 특정 세그먼트에 맞는 타일 결정
function getTileForSegment(segment, index) {
    if (index === 0) {
        // 머리 타일 결정
        const next = snake.segments[index + 1];
        return getHeadTile(segment, next);
    } else if (index === snake.segments.length - 1) {
        // 꼬리 타일 결정
        const prev = snake.segments[index - 1];
        return getTailTile(segment, prev);
    } else {
        // 몸통 타일 결정
        const prev = snake.segments[index - 1];
        const next = snake.segments[index + 1];
        return getBodyTile(segment, prev, next);
    }
}

function getHeadTile(segment, next) {
    // 머리 그리기
    // segment = head
    // next = body
    if (segment.x > next.x) return SNAKE_TILES.head.right;
    if (segment.y < next.y) return SNAKE_TILES.head.up;
    if (segment.y > next.y) return SNAKE_TILES.head.down;
    return SNAKE_TILES.head.left;
}

function getTailTile(segment, prev) {
    // 꼬리 그리기
    // prev = body
    // segment = tail
    if (prev.x > segment.x) return SNAKE_TILES.tail.right;
    if (prev.y < segment.y) return SNAKE_TILES.tail.up;
    if (prev.y > segment.y) return SNAKE_TILES.tail.down;
    return SNAKE_TILES.tail.left;
}

function getBodyTile(segment, prev, next) {
    // 몸통 그리기
    // prev = head
    // segment = body
    // next = tail

    // 정방향 역방향 모두 고려 
    // 정방향 -> next(tail)-segment(body)-prev(head)
    // 역방향 <- prev(head)-segment(body)-next(tail)
    if ((prev.x > segment.x && next.x < segment.x) || // to-right 
        (prev.x < segment.x && next.x > segment.x)) { // to-left
        return SNAKE_TILES.body.horizontal;
    }
    if ((prev.y < segment.y && next.y > segment.y) || // to-up
        (prev.y > segment.y && next.y < segment.y)) { // to-down
        return SNAKE_TILES.body.vertical;
    }
    if ((prev.y > segment.y && next.x < segment.x) || // to-down
        (prev.x < segment.x && next.y > segment.y)) { // to-left
        return SNAKE_TILES.body.curveLeftDown;        // ╮
    }
    if ((prev.y < segment.y && next.x < segment.x) || // to-up
        (prev.x < segment.x && next.y < segment.y)) { // to-left
        return SNAKE_TILES.body.curveLeftUp;          // ╯
    }
    if ((prev.x > segment.x && next.y < segment.y) || // to-right
        (prev.y < segment.y && next.x > segment.x)) { // to-up
        return SNAKE_TILES.body.curveRightUp;         // ╰
    }
    return SNAKE_TILES.body.curveRightDown;           // ╭
}

function placeFood() {
    food.x = Math.floor(Math.random() * COLUMNS);
    food.y = Math.floor(Math.random() * ROWS);
}

function drawFood() {
    drawTile(SNAKE_TILES.food.tx, SNAKE_TILES.food.ty, food.x, food.y);
}

// 게임 루프
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    drawFood();
    drawSnake();

    setTimeout(gameLoop, SPEED);
}
