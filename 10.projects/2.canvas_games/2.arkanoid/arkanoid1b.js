// Canvas와 그리기 컨텍스트 가져오기
const canvas = document.getElementById('arkanoidCanvas');
const context = canvas.getContext('2d');

// 공의 반지름과 초기 위치 설정
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;

// 공의 이동 속도 및 방향 설정
let dx = 2; // x 방향 이동 속도
let dy = -2; // y 방향 이동 속도

// 패들의 높이와 너비 설정
const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// 게임 오버 상태 추적 변수
let isGameOver = false;

// 키보드 입력 상태 설정
let rightPressed = false;
let leftPressed = false;

// 블록 초기화
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// 키보드 이벤트 처리
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// 키가 눌렸을 때 호출되는 함수
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

// 키가 떼어졌을 때 호출되는 함수
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// 충돌 감지
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

// 공 그리기
function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#FF00DD';
    context.fill();
    context.closePath();
}

// 패들 그리기
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = '#0095DD';
    context.fill();
    context.closePath();
}

// 블록 그리기
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = '#0095DD';
                context.fill();
                context.closePath();
            }
        }
    }
}

// 게임 오버 표시
function gameOver() {
    context.font = '30px Arial';
    context.fillStyle = '#0095DD';
    context.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    isGameOver = true;

    // 공이 바닥에 닿았을 때 게임 재시작
    // document.location.reload();        
}

function moveBall() {
    if (isGameOver) return;  // 게임 오버 상태면 공이 움직이지 않음

    // 공의 위치 업데이트
    x += dx;
    y += dy;

    // 벽과 공의 충돌 감지
    if (x > canvas.width - ballRadius || x < ballRadius) {
        dx = -dx;
    }

    // 천장과 공의 충돌 감지
    if (y < ballRadius) {
        dy = -dy; // y 방향 이동 속도의 부호를 반대로 변경하여 방향을 변경
    } else if (y > canvas.height - ballRadius) {
        // 패들과 공의 충돌 감지
        // 우선순위
        // 1. + - 산술 연산자
        // 2. < > 비교 연산자
        // 3. &&  논리 연산자
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (y > canvas.height - paddleHeight) {
                dy = -dy; // 공의 이동 방향을 반대로 변경하여 튕기도록 함
            }
        } else {
            gameOver();
        }
    }
}

function movePaddle() {
    // 패들 이동
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
}

// 게임 그리기
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();

    moveBall();
    movePaddle();
    
    collisionDetection();

    // 애니메이션 프레임 요청
    if (!isGameOver) {
        requestAnimationFrame(draw);
    }
}

// 게임 시작
draw();
