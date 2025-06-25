// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

const BLOCK_SIZE = 20; // 블록 크기
const CANVAS_SIZE = 300; // 캔버스 크기
const SNAKE_SPEED = 200; // 뱀 이동 속도 (밀리초)

let canvas, context;
let snake = { x: 0, y: 0 }; // 초기 뱀 위치
let direction = 'right'; // 뱀 초기 이동 방향
let gameInterval; // 타이머를 저장할 변수

// 초기화 실행
window.onload = initialize;

// 초기화 함수
function initialize() {
    canvas = document.getElementById("snakeCanvas");
    context = canvas.getContext("2d");

    // 키 이벤트 리스너 추가
    setupEventListeners();

    // 게임 루프 시작 - 일정 시간마다 화면 그리기 함수 호출
    gameInterval = setInterval(gameLoop, SNAKE_SPEED);
}

// 키 입력에 따른 방향 전환 함수
// 이벤트 리스너 설정
function setupEventListeners() {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;

            // 아래처럼 하나로 처리도 가능
            // case 'ArrowUp':
            // case 'ArrowDown':
            // case 'ArrowLeft':
            // case 'ArrowRight':
            //     direction = event.key.toLowerCase().replace("arrow", "");
            //     break;
        }
    });
}

// 게임 루프 함수
function gameLoop() {
    // 뱀 이동
    if (!moveSnake()) {
        // 뱀이 죽으면 게임 종료
        alert('Game Over!');
        clearInterval(gameInterval); // 게임 루프 멈추기

        window.location.reload(); // 새로고침으로 간단하게 리셋
        return; // 게임 루프 중단
    }

    // 화면 그리기
    draw();
}

// 화면 그리기 함수
function draw() {
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // 캔버스 지우기

    // 뱀 그리기
    context.fillStyle = '#00F';
    context.fillRect(snake.x * BLOCK_SIZE, snake.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// 뱀 이동 함수
function moveSnake() {
    switch (direction) {
        case 'up':
            snake.y -= 1;
            break;
        case 'down':
            snake.y += 1;
            break;
        case 'left':
            snake.x -= 1;
            break;
        case 'right':
            snake.x += 1;
            break;
    }

    // 현재 좌표 콘솔에 출력
    console.log(`Snake Position -> x: ${snake.x}, y: ${snake.y}`);

    // 화면 벗어났는지 검사
    if (
        snake.x < 0 || snake.x >= CANVAS_SIZE / BLOCK_SIZE ||
        snake.y < 0 || snake.y >= CANVAS_SIZE / BLOCK_SIZE
    ) {
        return false; // 죽음 (게임 종료 신호)
    }

    return true; // 살아있음
}
