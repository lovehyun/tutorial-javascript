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

// 키보드 입력 상태 설정
let rightPressed = false;
let leftPressed = false;

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

// 게임 오버 표시
function gameOver() {
    context.font = '30px Arial';
    context.fillStyle = '#0095DD';
    context.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
}

function moveBall() {
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
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (y > canvas.height - paddleHeight) {
                dy = -dy; // 공의 이동 방향을 반대로 변경하여 튕기도록 함
            }
        } else {
            // 공이 바닥에 닿았을 때 게임 재시작
            document.location.reload();
            
            gameOver();
            return; // 게임 종료
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

    drawBall();
    drawPaddle();

    moveBall();
    movePaddle();

    // 애니메이션 프레임 요청
    requestAnimationFrame(draw);
}

// 게임 시작
draw();
