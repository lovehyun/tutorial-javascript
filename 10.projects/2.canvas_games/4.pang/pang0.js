// 캔버스와 2D 그래픽 컨텍스트 가져오기
const canvas = document.getElementById('pangCanvas');
const ctx = canvas.getContext('2d');

// 공의 반지름 설정
const ballRadius = 50;

// 초기 위치 설정
let x = canvas.width / 2;
let y = canvas.height * 0.2;

// 초기 속도 설정
let dx = 2;
let dy = -2;

// 중력 설정
const gravity = 0.1; // 중력의 효과를 나타내는 값

// 공 그리기 함수
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // 원 그리기
    ctx.fillStyle = '#0095DD'; // 색상 설정
    ctx.fill(); // 채우기
    ctx.closePath();
}

// 화면 갱신 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임 지우기
    drawBall(); // 공 그리기

    // 중력 적용
    dy += gravity;

    // 현재 위치 업데이트
    x += dx;
    y += dy;

    // 벽에 부딪혔을 때 튕기기
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx; // 방향 반전
    }

    // 바닥에 닿았을 때 튕기기
    if (y + dy > canvas.height - ballRadius) {
        y = canvas.height - ballRadius; // 바닥에 고정
        dy = -dy; // 튕김
    } else if (y + dy < ballRadius) {
        dy = -dy; // 천장에 닿았을 때 튕김
    }
}

// 애니메이션 프레임 요청을 이용한 화면 갱신 함수
function update() {
    draw();
    requestAnimationFrame(update);
}

// 키보드 이벤트 리스너 등록
document.addEventListener('keydown', (event) => {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        dx = 2; // 오른쪽으로 이동
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        dx = -2; // 왼쪽으로 이동
    }
});

// 초기 화면 갱신 시작
update();
