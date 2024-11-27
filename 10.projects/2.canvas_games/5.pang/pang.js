// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 10,
    y: canvas.height - 40,
    width: 20,
    height: 40,
    speed: 7,
    movingLeft: false,
    movingRight: false,
};

const balls = [
    { x: 100, y: 100, radius: 40, dx: 3, dy: 2, level: 3, color: 'red' }, // 빨강 공
    { x: 400, y: 150, radius: 40, dx: -3, dy: 3, level: 3, color: 'orange' }, // 주황 공
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
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 공의 벽 충돌 처리
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy = -ball.dy;

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
                        dy: -Math.abs(ball.dy),
                        level: ball.level - 1,
                        color: ball.color // 새로운 공도 같은 색으로 설정
                    });
                    balls.push({
                        x: ball.x,
                        y: ball.y,
                        radius: ball.radius / 2,
                        dx: -ball.dx,
                        dy: -Math.abs(ball.dy),
                        level: ball.level - 1,
                        color: ball.color // 새로운 공도 같은 색으로 설정
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
        ctx.fillStyle = ball.color;  // 공의 색상 설정
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
