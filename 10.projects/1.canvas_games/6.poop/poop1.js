const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 175,
    y: 550,
    width: 50,
    height: 50,
    vx: 0,
};

let keys = {};
let poops = [];
let score = 0;
let poopSpeed = 4;
let gameRunning = true;

// 키보드 조작
document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

// 캐릭터 그리기
function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 25, 0, Math.PI * 2);
    ctx.fill();
}

// 똥 그리기
function drawPoop(poop) {
    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.arc(poop.x + 15, poop.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
}

function updatePoops() {
    for (let i = poops.length - 1; i >= 0; i--) {
        const poop = poops[i];
        poop.y += poopSpeed;

        // 충돌 감지
        if (
            poop.x < player.x + player.width &&
            poop.x + 30 > player.x &&
            poop.y < player.y + player.height &&
            poop.y + 30 > player.y
        ) {
            gameRunning = false;
        }

        // 화면 아래로 나간 경우
        if (poop.y > canvas.height) {
            poops.splice(i, 1);
            score++;
            if (score % 10 === 0) {
                poopSpeed += 1; // 난이도 증가
            }
        }
    }
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Score: ${score}`, 10, 25);
}

function movePlayer() {
    if (keys['ArrowLeft']) player.vx -= 0.7;
    if (keys['ArrowRight']) player.vx += 0.7;

    player.vx *= 0.92; // 마찰
    player.x += player.vx;

    if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
    }
    if (player.x > canvas.width - player.width) {
        player.x = canvas.width - player.width;
        player.vx = 0;
    }
}

function spawnPoop() {
    const x = Math.random() * (canvas.width - 30);
    poops.push({ x, y: 0 });
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    movePlayer();

    updatePoops();
    poops.forEach(drawPoop);

    drawScore();

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

setInterval(() => {
    if (gameRunning) spawnPoop();
}, 1000);

gameLoop();
