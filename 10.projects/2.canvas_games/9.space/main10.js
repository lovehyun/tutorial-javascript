// 1. 캔바스 기본 그림 그리기
// 2. 키보드로 좌우 이동하기
// 3. 미사일 발사하기
// 4. 적군 생성 및 이동하기
// 4-1. 적군이 화면 맨 밑으로 이동 시 게임 종료하기
// 5. 총알로 적군 맞추고 죽이기
// 6. 무한정 허공에서 대기하는 총알 처리하기
// 6-1. 점수 넣기
// 7. 스테이지 만들고 난이도 어렵게 하기
// 8. 폭탄 추가
// 10. 리펙토링

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);

const images = {};

let gameOver = false;
let score = 0;
let stage = 1;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

let spaceshipX = spaceshipStartPosition.x;
let spaceshipY = spaceshipStartPosition.y;

const bulletList = [];
const bombList = [];
const enemyList = [];

function removeItemFromList(list, item) {
    const index = list.indexOf(item);
    if (index !== -1) {
        list.splice(index, 1);
    }
    item = null;
}

const BulletType = {
    STANDARD: 1,
    LEFT: 2,
    RIGHT: 3,
    LEFT_FAST: 4,
    RIGHT_FAST: 5,
};

class Bullet {
    constructor(x, y, t) {
        this.x = x;
        this.y = y;
        this.type = t; // 총알 유형
    }

    update() {
        // 총알을 위로 이동시킵니다.
        this.y -= 7;

        // 총알을 좌우로 이동시킵니다.
        if (this.type == BulletType.LEFT) {
            this.x -= 0.5;
        } else if (this.type == BulletType.RIGHT) {
            this.x += 0.5;
        } else if (this.type == BulletType.LEFT_FAST) {
            this.x -= 1;
        } else if (this.type == BulletType.RIGHT_FAST) {
            this.x += 1;
        }

        if (this.y <= 0) {
            // 총알이 화면 위로 벗어나면 제거합니다.
            this.destroy();
        }                  
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
        removeItemFromList(bulletList, this);
    }
}

class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.m = 0;
    }

    update() {
        // 폭탄을 위로 이동시킵니다.
        this.y -= 1;
        this.m += 1;
        if (this.m >= 50) {
            // 일정 이동 거리 이후에 폭탄이 터지면 총알을 생성합니다.
            createBullet(this.x, this.y - 5, BulletType.STANDARD);
            createBullet(this.x - 20, this.y, BulletType.LEFT);
            createBullet(this.x + 20, this.y, BulletType.RIGHT);
            createBullet(this.x - 40, this.y + 5, BulletType.LEFT_FAST);
            createBullet(this.x + 40, this.y + 5, BulletType.RIGHT_FAST);

            this.destroy();
        }
    }

    destroy() {
        // 폭탄을 목록에서 찾아서 삭제합니다.
        removeItemFromList(bombList, this);
    }
}

class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.isHit = false;
        this.hitCount = 0; // 총알에 맞은 효과를 주기 위한 카운트
        this.hitTimer = 0; // 맞은 후 사라지기 전까지 효과를 표시하기 위한 타이머
    }

    init() {
        // 적 초기 위치를 설정합니다.
        this.y = 0;
        this.x = randomInt(0, canvas.width - 48);
    }

    update() {
        // 적을 아래로 이동시킵니다.
        if (this.isHit) {
            this.y += 1;
            this.hitTimer -= this.hitCount;
            if (this.hitTimer <= 0) {
                this.destroy();
            }
        } else {
            this.y += stage;
        }

        if (this.y >= canvas.height - 64) {
            // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
            gameOver = true;
            console.log("gameover!");
        }
    }

    destroy() {
        // 적을 목록에서 찾아서 삭제합니다.
        removeItemFromList(enemyList, this);
    }

    hit() {
        // 총알에 맞았을때 호출되는 메서드
        if (!this.isHit)
            this.hitTimer = 60; // 1초동안 효과를 표시하기 위한 타이머 설정
        this.isHit = true;
        this.hitCount++;
    }
}

function randomInt(min, max) {
    // 주어진 범위에서 임의의 정수를 반환합니다.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadImage() {
    // 이미지를 로드합니다.
    const imagePaths = {
        background: "images/galaxy2.gif",
        spaceship: "images/ship.png",
        bullet: "images/bullet.png",
        bomb: "images/bomb.png",
        enemy: "images/enemy.png",
        fire: "images/fire.png",
        gameover: "images/gameover.jpg",
    };
    
    for (let key in imagePaths) {
        images[key] = new Image();
        images[key].src = imagePaths[key];
    }
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
            createBullet(spaceshipX, spaceshipY, BulletType.STANDARD);
        }

        if (event.key == "b") {
            createBomb();
        }
    });
}

function createBullet(x, y, t) {
    // 총알을 생성합니다.
    const bullet = new Bullet(x + 25, y - 15, t);
    bulletList.push(bullet);
}

function createBomb() {
    // 폭탄을 생성합니다.
    const bomb = new Bomb(spaceshipX + 15, spaceshipY - 20);
    bombList.push(bomb);
}

function createEnemy() {
    // 일정 시간마다 적을 생성합니다. 스테이지가 높을수록 적군 생성 주기가 짧아집니다.
    setInterval(function () {
        const enemy = new Enemy();
        enemy.init();
        enemyList.push(enemy);
    }, Math.max(1000 - (stage * 100), 300)); // 스테이지가 오를수록 적군 생성 주기 감소, 최소 300ms
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
                enemy.hit();
                bullet.destroy();

                // 적과 충돌한 경우 점수를 추가합니다.
                score += stage;

                // 점수에 따라 스테이지를 계산합니다.
                if (score >= stage * stage * 10) {
                    stage++;
                    console.log(`level up, score=${score}, stage=${stage}`);
                }
            }
        });
    });

    // 폭탄 업데이트를 수행합니다.
    bombList.forEach((bomb) => bomb.update());

    // 적 업데이트를 수행합니다.
    enemyList.forEach((enemy) => enemy.update());
}

function render() {
    // 화면을 그립니다.
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.spaceship, spaceshipX, spaceshipY);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 20, 20);
    ctx.fillText(`Stage: ${stage}`, 300, 20);

    // 총알을 그립니다.
    bulletList.forEach((bullet) => {
        ctx.drawImage(images.bullet, bullet.x, bullet.y);
    });

    // 폭탄을 그립니다.
    bombList.forEach((bomb) => {
        ctx.drawImage(images.bomb, bomb.x, bomb.y);
    });

    // 적을 그립니다.
    enemyList.forEach((enemy) => {
        ctx.drawImage(images.enemy, enemy.x, enemy.y);

        if (enemy.isHit) {
            ctx.drawImage(images.fire, enemy.x, enemy.y);
            if (enemy.hitCount >= 2) {
                ctx.drawImage(images.fire, enemy.x+15, enemy.y+5)
            }
            if (enemy.hitCount >= 3) {
                ctx.drawImage(images.fire, enemy.x+7, enemy.y-8)
            }
        }
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
        ctx.drawImage(images.gameover, 10, 100, 380, 380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
