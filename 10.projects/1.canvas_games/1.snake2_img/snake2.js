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
    }
};

let canvas, context;
let snake, snakeImage;

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

    snake.segments.unshift(newHead); // 머리를 새로운 위치로 이동
    snake.segments.pop(); // 꼬리를 삭제
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

    moveSnake();

    // 뱀 그리기
    snake.segments.forEach((segment, index) => {
        let tx, ty;

        if (index === 0) {
            // 머리 그리기
            // segment = head
            // next = body
            const next = snake.segments[index + 1]; // 머리 다음 세그먼트를 참조
            if (segment.x > next.x) ({ tx, ty } = SNAKE_TILES.head.right);
            else if (segment.y < next.y) ({ tx, ty } = SNAKE_TILES.head.up);
            else if (segment.y > next.y) ({ tx, ty } = SNAKE_TILES.head.down);
            else ({ tx, ty } = SNAKE_TILES.head.left);
        } else if (index === snake.segments.length - 1) {
            // 꼬리 그리기
            // prev = body
            // segment = tail
            const prev = snake.segments[index - 1]; // 꼬리 이전 세그먼트를 참조
            if (prev.x > segment.x) ({ tx, ty } = SNAKE_TILES.tail.right);
            else if (prev.y < segment.y) ({ tx, ty } = SNAKE_TILES.tail.up);
            else if (prev.y > segment.y) ({ tx, ty } = SNAKE_TILES.tail.down);
            else ({ tx, ty } = SNAKE_TILES.tail.left);
        } else {
            // 몸통 그리기
            // prev = head
            // segment = body
            // next = tail
            const prev = snake.segments[index - 1]; // 이전 세그먼트
            const next = snake.segments[index + 1]; // 다음 세그먼트

            // 정방향 역방향 모두 고려 
            // 정방향 -> next(tail)-segment(body)-prev(head)
            // 역방향 <- prev(head)-segment(body)-next(tail)
            if (prev.x > segment.x && next.x < segment.x || // to-right 
                prev.x < segment.x && next.x > segment.x) { // to-left
                ({ tx, ty } = SNAKE_TILES.body.horizontal);
            } else if (prev.y < segment.y && next.y > segment.y || // to-up
                prev.y > segment.y && next.y < segment.y) { // to-down
                ({ tx, ty } = SNAKE_TILES.body.vertical);
            } else if (prev.y > segment.y && next.x < segment.x || // to-down
                prev.x < segment.x && next.y > segment.y) { // to-left
                ({ tx, ty } = SNAKE_TILES.body.curveLeftDown); // ╮
            } else if (prev.y < segment.y && next.x < segment.x || // to-up 
                prev.x < segment.x && next.y < segment.y) { // to-left
                ({ tx, ty } = SNAKE_TILES.body.curveLeftUp); // ╯
            } else if (prev.x > segment.x && next.y < segment.y || // to-right
                prev.y < segment.y && next.x > segment.x) { // to-up
                ({ tx, ty } = SNAKE_TILES.body.curveRightUp); // ╰
            } else {
                ({ tx, ty } = SNAKE_TILES.body.curveRightDown); // ╭
            }
        }

        drawTile(tx, ty, segment.x, segment.y);
    });

    setTimeout(gameLoop, SPEED);
}
