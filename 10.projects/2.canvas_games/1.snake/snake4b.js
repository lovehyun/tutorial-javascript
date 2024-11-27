// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

const BLOCK_SIZE = 20; // 블록 크기
const CANVAS_SIZE = 300; // 캔버스 크기
const SNAKE_SPEED = 200; // 뱀 이동 속도 (밀리초)

let canvas, context;
let snake = [{ x: 0, y: 0 }]; // 초기 뱀 위치
let direction = 'right'; // 뱀 초기 이동 방향
let food = generateFood(); // 초기 음식 생성
let gameover = false; // 게임 오버 여부
let directionBuffer = []; // 키 입력 버퍼

// 초기화 실행
window.onload = initialize;

// 초기화 함수
function initialize() {
    canvas = document.getElementById("snakeCanvas");
    context = canvas.getContext("2d");

    // 키 이벤트 리스너 추가
    setupEventListeners();

    // 게임 루프 시작 - 일정 시간마다 화면 그리기 함수 호출
    setInterval(gameLoop, SNAKE_SPEED);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

// 키 입력에 따른 방향 전환 함수
function handleKeyPress(event) {
    if (gameover) {
        // 재시작 추가
        if (event.key.toLowerCase() === 'y') {
            resetGame();
        }
        return;
    }

    // 버그해결 - 방향 전환을 위해 제한된 시간 내에 최대 두개의 키 입력을 버퍼링 처리
    if (directionBuffer.length >= 2) {
        console.log('key buffer full: ', directionBuffer);
        return;
    }

    let previousKeyPress = direction;
    if (directionBuffer.length > 0) {
        previousKeyPress = directionBuffer[directionBuffer.length - 1];
    }

    switch (event.key) {
        case 'ArrowUp':
            if (previousKeyPress !== 'down') {
                directionBuffer.push('up');
            }
            break;
        case 'ArrowDown':
            if (previousKeyPress !== 'up') {
                directionBuffer.push('down');
            }
            break;
        case 'ArrowLeft':
            if (previousKeyPress !== 'right') {
                directionBuffer.push('left');
            }
            break;
        case 'ArrowRight':
            if (previousKeyPress !== 'left') {
                directionBuffer.push('right');
            }
            break;
        default:
            console.log('Unknown key:', event.key);
    }
    
    // console.log(event.key);
}

// 게임 루프 함수
function gameLoop() {
    // 뱀 이동
    moveSnake();

    // 충돌 체크
    checkCollision();

    // 음식 충돌 체크
    checkFoodCollision();
    
    // 화면 그리기
    draw();
}

// 화면 그리기 함수
function draw() {
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // 캔버스 지우기

    if (gameover) {
        // 게임 오버 메시지 표시
        context.fillStyle = '#F00';
        context.font = '30px Arial';
        context.fillText('Game Over', 80, CANVAS_SIZE / 2);
        // 재시작 안내 메시지
        context.font = '20px Arial';
        context.fillText('Retry? (Press Y)', 80, CANVAS_SIZE / 2 + 40);
        return;
    }
    
    // 뱀과 음식 그리기
    drawSnake();
    drawFood();
}

// 뱀 그리기 함수
function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 머리
            context.fillStyle = "#0077FF";
        } else {
            // 몸통과 꼬리
            context.fillStyle = "#0055AA";
        }
        context.fillRect(segment.x * BLOCK_SIZE, segment.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    });
}

// 음식 그리기 함수
function drawFood() {
    context.fillStyle = '#F00';
    context.fillRect(food.x * BLOCK_SIZE, food.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// 뱀 이동 함수
function moveSnake() {
    const head = { ...snake[0] };

    // 버퍼에 입력이 있을 때만 방향 변경
    if (directionBuffer.length > 0) {
        console.log(directionBuffer);
        direction = directionBuffer.shift();
    }

    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    snake.unshift(head); // 뱀의 머리 추가
}

// 충돌 체크 함수
function checkCollision() {
    const head = snake[0];
    
    // 화면 밖 이동 확인 or 자기 자신과 충돌 확인
    if (head.x < 0 || head.x >= CANVAS_SIZE / BLOCK_SIZE ||
        head.y < 0 || head.y >= CANVAS_SIZE / BLOCK_SIZE ||
        isSnakeCollision()
    ) {
        gameover = true; // 게임 오버 처리
    }
}

// 뱀과 자기 자신 충돌 체크 함수
function isSnakeCollision() {
    const head = snake[0];
    // 내 머리가 내 몸안에 있는지 확인
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// 음식과 뱀의 충돌 체크 및 처리 함수
function checkFoodCollision() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); // 음식을 먹으면 새로운 음식 생성
    } else {
        snake.pop(); // 뱀이 음식을 먹지 않으면 꼬리 줄이기
    }
}

// 무작위로 음식 생성 함수
function generateFood() {
    let foodPosition;
    do {
        foodPosition = {
            x: Math.floor(Math.random() * (CANVAS_SIZE / BLOCK_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / BLOCK_SIZE)),
        };
    } while (isFoodOnSnake(foodPosition));

    return foodPosition;
}

// 음식이 뱀 위에 있는지 체크 함수
function isFoodOnSnake(foodPosition) {
    return snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}

// 게임 재시작 함수
function resetGame() {
    snake = [{ x: 0, y: 0 }]; // 초기 뱀 위치로 설정
    direction = 'right'; // 초기 이동 방향으로 설정
    food = generateFood(); // 초기 음식 생성
    gameover = false; // 게임 오버 상태 초기화
}
