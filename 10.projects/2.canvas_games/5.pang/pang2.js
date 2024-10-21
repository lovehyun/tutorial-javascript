const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 10, // 캐릭터 너비 변경
    y: canvas.height - 40, // 캐릭터 높이 변경
    width: 20, // 좁게 설정
    height: 40, // 높게 설정
    speed: 7,
    movingLeft: false,
    movingRight: false,
};

const gravity = 0.2; // 중력 값
const bounce = 1.0; // 튕길 때 반사력 (1.0은 완전 반사, 0.8은 반사되면서 속도 감소)

const balls = [
    { x: 100, y: 100, radius: 40, dx: 3, dy: 0, level: 3, color: 'red' }, // 빨강 공
    { x: 400, y: 150, radius: 40, dx: -3, dy: 0, level: 3, color: 'orange' }, // 주황 공
];

const ropes = [];
const ropeSpeed = 5;

// 플레이어 좌우 움직임
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.movingLeft = true;
    if (e.key === 'ArrowRight') player.movingRight = true;
    if (e.key === ' ') ropes.push({ x: player.x + player.width / 2, y: player.y });
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') player.movingLeft = false;
    if (e.key === 'ArrowRight') player.movingRight = false;
});

function update() {
    // 플레이어 움직임 업데이트
    if (player.movingLeft && player.x > 0) player.x -= player.speed;
    if (player.movingRight && player.x < canvas.width - player.width) player.x += player.speed;

    // 공 움직임 업데이트
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];

        // 중력 적용
        ball.dy += gravity; // 공의 속도에 중력 추가
        ball.x += ball.dx; // 공의 좌우 이동
        ball.y += ball.dy; // 공의 상하 이동 (중력 적용)

        // 벽과의 충돌 처리 (좌우 반사)
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }

        // 바닥과의 충돌 처리 (아래로 튕기게 하기)
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius; // 바닥에 붙도록 처리
            ball.dy *= -bounce; // 반사 속도 감소
        }

        // 천장과의 충돌 처리
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy; // 위쪽으로 반사
        }

        // 밧줄과 공 충돌 처리
        for (let j = 0; j < ropes.length; j++) {
            const rope = ropes[j];
            if (rope.y < ball.y + ball.radius && rope.x > ball.x - ball.radius && rope.x < ball.x + ball.radius) {
                // 공이 맞으면 나누기
                if (ball.level > 1) {
                    balls.push({
                        x: ball.x,
                        y: ball.y,
                        radius: ball.radius / 2,
                        dx: ball.dx,
                        dy: -Math.abs(ball.dy), // 반사되면서 위로 튕김
                        level: ball.level - 1,
                        color: ball.color, // 새로운 공도 같은 색으로 설정
                    });
                    balls.push({
                        x: ball.x,
                        y: ball.y,
                        radius: ball.radius / 2,
                        dx: -ball.dx,
                        dy: -Math.abs(ball.dy), // 반사되면서 위로 튕김
                        level: ball.level - 1,
                        color: ball.color, // 새로운 공도 같은 색으로 설정
                    });
                }
                balls.splice(i, 1); // 공 제거
                ropes.splice(j, 1); // 밧줄 제거
                break;
            }
        }
    }

    // 밧줄 업데이트
    for (let i = ropes.length - 1; i >= 0; i--) {
        ropes[i].y -= ropeSpeed;
        if (ropes[i].y < 0) {
            ropes.splice(i, 1);
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBalls() {
    for (let ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color; // 공의 색상 설정
        ctx.fill();
        ctx.closePath();
    }
}

function drawRopes() {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    for (let rope of ropes) {
        ctx.beginPath();
        ctx.moveTo(rope.x, rope.y);
        ctx.lineTo(rope.x, player.y);
        ctx.stroke();
        ctx.closePath();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawPlayer();
    drawBalls();
    drawRopes();
    requestAnimationFrame(gameLoop);
}

gameLoop();
