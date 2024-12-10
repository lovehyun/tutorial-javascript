// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

// 1. 캔바스 기본 그림 그리기
// 2. 키보드로 좌우 이동하기
// 3. 미사일 발사하기
// 4. 적군 생성 및 이동하기
// 4-1. 적군이 화면 맨 밑으로 이동 시 게임 종료하기
// 5. 총알로 적군 맞추고 죽이기

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

let spaceshipX = spaceshipStartPosition.x;
let spaceshipY = spaceshipStartPosition.y;

const bulletList = [];
const enemyList = [];

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        // 총알을 위로 이동시킵니다.
        this.y -= 7;
    }

    checkCollision(enemy) {
        // 적과의 충돌을 검사합니다.
        return (
            this.y <= enemy.y &&
            this.x >= enemy.x &&
            this.x <= enemy.x + 64
        );
    }

    destroy() {
        // 총알을 목록에서 찾아서 삭제합니다.
        const index = bulletList.indexOf(this);
        if (index != -1) {
            bulletList.splice(index, 1);
        }

        // 해당 객체의 참조를 제거하여 메모리에서 해제합니다.
        this.x = null;
        this.y = null;
    }
}

class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    init() {
        // 적 초기 위치를 설정합니다.
        this.y = 0;
        this.x = randomInt(0, canvas.width - 48);
    }

    update() {
        // 적을 아래로 이동시킵니다.
        this.y += 3;

        if (this.y >= canvas.height - 64) {
            // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
            gameOver = true;
            console.log("gameover!");
        }
    }

    destroy() {
        // 적을 목록에서 찾아서 삭제합니다.
        const index = enemyList.indexOf(this);
        if (index != -1) {
            enemyList.splice(index, 1);
        }

        // 해당 객체의 참조를 제거하여 메모리에서 해제합니다.
        this.x = null;
        this.y = null;
    }
}

function randomInt(min, max) {
    // 주어진 범위에서 임의의 정수를 반환합니다.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadImage() {
    // 이미지를 로드합니다.
    backgroundImage = new Image();
    backgroundImage.src = "images/galaxy2.gif";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/ship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.jpg";
}

const keyPressed = {};

function setupKeyboardListener() {
    // 키보드 이벤트를 처리합니다.
    document.addEventListener("keydown", function (event) {
        keyPressed[event.key] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keyPressed[event.key];

        if (event.key == " ") {
            createBullet(spaceshipX, spaceshipY);
        }
    });
}

function createBullet(x, y) {
    // 총알을 생성합니다.
    const bullet = new Bullet(x + 25, y - 15);
    bulletList.push(bullet);
}

function createEnemy() {
    // 일정 시간마다 적을 생성합니다.
    setInterval(function () {
        const enemy = new Enemy();
        enemy.init();
        enemyList.push(enemy);
    }, 1000);
}

function update() {
    // 게임 상태를 업데이트합니다.

    // 우측 방향키를 누르면 우주선을 오른쪽으로 이동시킵니다.
    if ("ArrowRight" in keyPressed) {
        spaceshipX += 5;
    }
    // 좌측 방향키를 누르면 우주선을 왼쪽으로 이동시킵니다.
    if ("ArrowLeft" in keyPressed) {
        spaceshipX -= 5;
    }

    // 우주선의 x 좌표를 화면 안으로 제한합니다.
    spaceshipX = Math.max(0, Math.min(spaceshipX, canvas.width - 64));

    // 총알 업데이트와 충돌 검사를 수행합니다.
    bulletList.forEach((bullet) => {
        bullet.update();

        enemyList.forEach((enemy) => {
            if (bullet.checkCollision(enemy)) {
                // 적과 충돌한 경우 총알과 적을 제거합니다.
                enemy.destroy();
                bullet.destroy();
            }
        });
    });

    // 적 업데이트를 수행합니다.
    enemyList.forEach((enemy) => {
        enemy.update();
    });
}

function render() {
    // 화면을 그립니다.
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    // 총알을 그립니다.
    bulletList.forEach((bullet) => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y);
    });

    // 적을 그립니다.
    enemyList.forEach((enemy) => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y);
    });
}

function main() {
    if (!gameOver) {
        // 게임이 종료되지 않았으면 화면을 업데이트하고 다음 프레임을 요청합니다.
        render();
        update();
        requestAnimationFrame(main);
    } else {
        // 게임이 종료되면 게임 오버 화면을 그립니다.
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
