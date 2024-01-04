const canvas = document.getElementById('snakeCanvas'); // 캔버스 요소 가져오기
const context = canvas.getContext('2d'); // 2D 그래픽 컨텍스트 가져오기

const blockSize = 20; // 블록 크기
const canvasSize = 300; // 캔버스 크기
const snakeSpeed = 200; // 뱀 이동 속도 (밀리초)

let snake = [
    { x: 0, y: 0 }, // 초기 뱀 위치
];
let direction = 'right'; // 뱀 초기 이동 방향

// 뱀 길이 관리 변수 추가
let snakeLength = 3;

// 화면 그리기 함수
function draw() {
    context.clearRect(0, 0, canvasSize, canvasSize); // 캔버스 지우기

    // 뱀 그리기
    drawSnake();

    // 뱀 이동 및 충돌 체크 (TODO)
    moveSnake();
}

// 뱀 그리기 함수
function drawSnake() {
    context.fillStyle = '#00F';
    snake.forEach(segment => {
        context.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });
}

// 뱀 이동 함수
function moveSnake() {
    const head = { ...snake[0] };

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

    if (
        head.x < 0 ||
        head.x >= canvasSize / blockSize ||
        head.y < 0 ||
        head.y >= canvasSize / blockSize
    ) {
        return;
    }

    snake.unshift(head); // 뱀의 머리 추가

    // 뱀 길이가 n칸 이상이면 꼬리 줄이기
    if (snake.length > snakeLength) {
        snake.pop(); // 꼬리 줄이기
    }

    console.log(head);
}

// 키보드 이벤트 처리 함수
document.addEventListener('keydown', handleKeyPress);

// 키 입력에 따른 방향 전환 함수
function handleKeyPress(event) {
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
}

// 일정 시간마다 화면 그리기 함수 호출
setInterval(draw, snakeSpeed);
