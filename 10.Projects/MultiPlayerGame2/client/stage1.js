// 1. 동일한 비행기를 서버와 통신하며 이동하도록 구현
// 2. 각자의 비행기를 서버를 통해 각각 이동하도록 구현
// 3. 상대방의 비행기를 1대가 아닌 2대 이상으로 통신 가능하도록 구현
// 4. 각자 다 미사일 발사 및 상대 화면에 전송
// 5. 적군 생성 (서버로부터 생성된 적군 클라이언트에서 처리)
// 6. 총알로 적 Hit 처리
// 6-1. 화면 밖으로 나간 총알 삭제 처리
// 6-2. 적군이 바닥에 닿으면 종료 처리
// 7. 점수 처리
// 7-1. 내 점수와 상대방 점수 각각 처리 (그리고 하이스코어 처리)
// 7-2. 웹소켓 환경변수 처리 (set WEBSOCKET_ADDRESS=ws://localhost:8080)
// 8. 스테이지 추가

// 캔바스 생성
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 700;

let gameContainer = document.getElementById("gameContainer");
if (gameContainer) {
    gameContainer.appendChild(canvas);
} else {
    document.body.appendChild(canvas);
}


// 게임 데이터 저장
let backgroundImage, gameOverImage;
let gameOver = false;
let highScore = 0;
let stage = 1;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

// ========================================================
// 각종 객체 생성
// ========================================================
const BulletType = {
    STANDARD: 1,
    LEFT: 2,
    RIGHT: 3,
    LEFT_FAST: 4,
    RIGHT_FAST: 5,
};

class Bullet {
    constructor(x, y, t, spaceship) {
        this.x = x;
        this.y = y;
        this.type = t; // 총알 유형
        this.image = new Image();
        this.image.src = "images/bullet.png";
        this.spaceship = spaceship;
    }

    setImage(num) {
        if (num == 2) {
            this.image.src = "images/bullet2.png";
        } else {
            this.image.src = "images/bullet.png";
        }
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
            this.spaceship.removeBullet(this);
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
        this.spaceship.removeBullet(this);

        // 해당 객체의 참조를 제거하여 메모리에서 해제합니다.
        this.x = null;
        this.y = null;
    }
}

class Bomb {
    constructor(x, y, spaceship) {
        this.x = x;
        this.y = y;
        this.m = 0;
        this.image = new Image();
        this.image.src = "images/bomb.png";
        this.spaceship = spaceship;
    }

    setImage(num) {
        if (num == 2) {
            this.image.src = "images/bomb2.png";
        } else {
            this.image.src = "images/bomb.png";
        }
    }

    update() {
        // 폭탄을 위로 이동시킵니다.
        this.y -= 1;
        this.m += 1;
        if (this.m >= 50) {
            // 일정 이동 거리 이후에 폭탄이 터지면 총알을 생성합니다.
            this.spaceship.createBullet(this.x, this.y - 5, BulletType.STANDARD);
            this.spaceship.createBullet(this.x - 20, this.y, BulletType.LEFT);
            this.spaceship.createBullet(this.x + 20, this.y, BulletType.RIGHT);
            this.spaceship.createBullet(this.x - 40, this.y + 5, BulletType.LEFT_FAST);
            this.spaceship.createBullet(this.x + 40, this.y + 5, BulletType.RIGHT_FAST);

            this.destroy();
        }
    }

    destroy() {
        // 폭탄을 목록에서 찾아서 삭제합니다.
        this.spaceship.removeBomb(this);

        // 해당 객체의 참조를 제거하여 메모리에서 해제합니다.
        this.x = null;
        this.y = null;
    }
}

let opponents = new Map(); // 상대방의 Spaceship 정보

class Ship {
    constructor(x, y, imageSrc) {
        this.x = x;
        this.y = y;
        this.score = 0;
        this.bulletList = [];
        this.bombList = [];
        this.image = new Image();
        this.image.src = imageSrc;
    }

    createBullet(x, y, t) {
        // 총알을 생성합니다.
        const bullet = new Bullet(x + 25, y - 15, t, this);
        this.bulletList.push(bullet);
    }

    removeBullet(bullet) {
        // 총알을 목록에서 제거합니다.
        const index = this.bulletList.indexOf(bullet);
        if (index !== -1) {
            this.bulletList.splice(index, 1);
        }
    }

    createBomb(x, y) {
        // 폭탄을 생성합니다.
        const bomb = new Bomb(x + 15, y - 20, this);
        this.bombList.push(bomb);
    }
    
    removeBomb(bomb) {
        // 폭탄을 목록에서 제거합니다.
        const index = this.bombList.indexOf(bomb);
        if (index !== -1) {
            this.bombList.splice(index, 1);
        }
    }

    update() {
        // 각각 오버라이딩 해서 구현 필요
        throw new Error("This method must be implemented by the child class.");
    }

    render() {
        // Spaceship의 그리기 로직을 구현합니다.
        ctx.drawImage(this.image, this.x, this.y);

        // 총알을 그립니다.
        this.bulletList.forEach((bullet) => {
            ctx.drawImage(bullet.image, bullet.x, bullet.y);
        });

        // 폭탄을 그립니다.
        this.bombList.forEach((bomb) => {
            ctx.drawImage(bomb.image, bomb.x, bomb.y);
        });
    }
}

class Spaceship extends Ship {
    constructor(x, y) {
        // 싱글톤 객체로 생성합니다.
        if (Spaceship.instance) {
            return Spaceship.instance;
        }

        super(x, y, "images/ship.png");

        // 생명 처리를 위한 추가 필드를 생성합니다.
        this.lifeimage = new Image();
        this.lifeimage.src = "images/heart.png";
        this.extraLife = 2;

        Spaceship.instance = this;
    }

    static getInstance(x, y) {
        // 싱글톤 객체를 반환하는 정적 메서드입니다.
        if (arguments.length === 0) {
            if (!Spaceship.instance) {
                throw new Error("Instance has not been created yet.");
            }
            return Spacehip.instance;
        } else if (arguments.length === 2) {
            if (Spaceship.instance) {
                throw new Error("Instance has already been created.");
            } else {
                return new Spaceship(x, y);
            }
        } else {
            throw new Error("Invalid number of arguments.");
        }
    }

    update() {
        // Spaceship의 이동 로직을 구현합니다.
        let isSpaceshipMoving;

        if ("ArrowRight" in keyPressed) {
            this.x += 5;
            isSpaceshipMoving = true;
        } else if ("ArrowLeft" in keyPressed) {
            this.x -= 5;
            isSpaceshipMoving = true;
        } else {
            isSpaceshipMoving = false;
        }

        // 우주선의 x 좌표를 화면 안으로 제한합니다.
        this.x = Math.max(0, Math.min(this.x, canvas.width - 64));

        if (isSpaceshipMoving) {
            sendSpaceshipPosition();
        }

        // 총알 업데이트를 수행합니다.
        this.bulletList.forEach((bullet) => {
            bullet.update();

            enemyList.forEach((enemy) => {
                if (bullet.checkCollision(enemy)) {
                    // 적과 충돌한 경우 총알과 적을 제거합니다.
                    // enemy.destroy();
                    enemy.hit();
                    bullet.destroy();

                    // 점수 카운팅
                    this.score += 1;
                    // 점수에 따라 스테이지를 계산합니다.
                    if (this.score >= stage * stage * 10) {
                        stage++;
                        console.log(`level up, score=${this.score}, stage=${stage}`);
                    }
                    sendScore(this.score, stage, gameOver);
                }
            });
        });
    
        // 폭탄 업데이트를 수행합니다.
        this.bombList.forEach((bomb) => {
            bomb.update();
        });
        
        // GameOver 메세지 처리
        if (gameOver) {
            sendScore(this.score, stage, gameOver);
        }
    }

    // 생명 처리를 위해 상속 객체를 오버라이딩 하여 기능을 확장합니다.
    render() {
        super.render();

        for (let i = 0; i < this.extraLife; i++) {
            ctx.drawImage(this.lifeimage, i * 30 + 20, 30);
        };
    }

    hitByEnemy(damage) {
        this.extraLife -= damage;
        console.log("hitByEnemy!")

        // 생명이 모두 다 감소하면 종료 처리합니다.
        if (this.extraLife < 0) {
            gameOver = true;
            console.log("gameover!");
        }
    }
}

class OpponentShip extends Ship {
    constructor(x, y) {
        super(x, y, "images/ship2.png");
    }

    // 메소드 오버라이딩
    createBullet(x, y, t) {
        // 총알을 생성합니다.
        const bullet = new Bullet(x + 25, y - 15, t, this);
        bullet.setImage(2);
        this.bulletList.push(bullet);
    }

    // 메소드 오버라이딩
    createBomb(x, y) {
        // 폭탄을 생성합니다.
        const bomb = new Bomb(x + 15, y - 20, this);
        bomb.setImage(2);
        this.bombList.push(bomb);
    }

    update() {
        // 총알 업데이트를 수행합니다.
        this.bulletList.forEach((bullet) => {
            bullet.update();

            enemyList.forEach((enemy) => {
                if (bullet.checkCollision(enemy)) {
                    // 적과 충돌한 경우 총알과 적을 제거합니다.
                    // enemy.destroy();
                    enemy.hit();
                    bullet.destroy();

                    // 점수 카운팅
                    // this.score += 1;
                    // NOTE: 서버에서 받아와서 갱신함
                }
            });
        });

        // 폭탄 업데이트를 수행합니다.
        this.bombList.forEach((bomb) => {
            bomb.update();
        });
    }
}

const spaceship = Spaceship.getInstance(spaceshipStartPosition.x, spaceshipStartPosition.y);

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isHit = false;
        this.hitCount = 0; // 총알에 맞은 효과를 주기 위한 카운트
        this.hitTimer = 0; // 맞은 후 사라지기 전까지 효과를 표시하기 위한 타이머
        this.image = new Image();
        this.image.src = "images/enemy.png";
        this.fireImage = new Image();
        this.fireImage.src = "images/fire.png";
        this.explosionImage = new Image();
        this.isExploding = false;
        this.explosionImage.src = "images/explosion.png";
        this.explosionTimer = 0; // 폭발 효과 표시를 위한 타이머
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
            // 적이 화면 아래로 벗어나면 폭발 효과를 줍니다.
            this.explosion();
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

    explosion() {
        // 이미 폭발 처리중이면 대기시간 후 삭제 로직을 구현합니다.
        if (this.isExploding) {
            this.explosionTimer -= 1;
            if (this.explosionTimer < 0) {
                this.destroy();
                // 실제 대미지 적용
                spaceship.hitByEnemy(1);
            }
        } else {
            this.isExploding = true;
            this.explosionTimer = 30; // 폭발 효과 타이머 설정 (대략 0.5초?)
        }
    }

    render() {
        // 적군을 그립니다.
        enemyList.forEach((enemy) => {
            // 적군 ship 을 그립니다.
            ctx.drawImage(enemy.image, enemy.x, enemy.y);

            // 맞은 효과를 그립니다.
            if (enemy.isHit) {
                ctx.drawImage(this.fireImage, enemy.x, enemy.y);
                if (enemy.hitCount >= 2) {
                    ctx.drawImage(this.fireImage, enemy.x+15, enemy.y+5)
                }
                if (enemy.hitCount >= 3) {
                    ctx.drawImage(this.fireImage, enemy.x+7, enemy.y-8)
                }
            }

            // 공격 효과를 그립니다.
            if (enemy.explosionTimer > 0) {
                if (enemy.isExploding) {
                    ctx.drawImage(enemy.explosionImage, enemy.x + 8, canvas.height - 48);
                }
            }
        });
    }

    hit() {
        // 총알에 맞았을때 호출되는 메서드
        if (!this.isHit)
            this.hitTimer = 60; // 대략 1초동안 효과를 표시하기 위한 타이머 설정
        this.isHit = true;
        this.hitCount++;
    }
}

const enemyList = [];

// ========================================================
// 웹소켓 연결
// ========================================================

// 실제 웹소켓 연결 변수
let socket;

// 웹소켓 연결 상태 확인 변수
let isConnected = false;

// MOTD를 표시하는 함수
function displayMOTD(message) {
    const announceElement = document.getElementById("announcement");
    if (announceElement) {
        announceElement.innerHTML = message.replace(/\n/g, "<br>");
    }
}

// 서버로부터 MOTD를 가져오는 함수
async function fetchMOTD() {
    const host = window.location.host;
    const url = `http://${host}/clients/announce`;
    try {
        const response = await fetch(url);
        const message = await response.text();
        displayMOTD(message);
    } catch (error) {
        console.error(error);
    }
}

// 웹소켓 메세지 유형
const MessageType = {
    CLIENT_CONNECTED: "connectedClient",
    CLIENT_DISCONNECTED: "disconnectedClient",
    SPACESHIP_POSITION: "spaceshipPosition",
    BULLET_POSITION: "bulletPosition",
    BOMB_POSITION: "bombPosition",
    CONNECTED_CLIENT: "connectedClient",
    CREATE_ENEMY: "createEnemyRequest",
    SCORE_UPDATED: "scoreUpdated",
    PAUSE_STATUS: "pauseStatus",
};

// 웹소켓 실제 연결 함수
function connectWebSocket(webSocketAddress) {
    return new Promise((resolve, reject) => {
        socket = new WebSocket(webSocketAddress);

        // WebSocket이 연결되면 실행될 콜백 함수 등록
        socket.addEventListener("open", (event) => {
            console.log("Connected to server");
            isConnected = true;
            // 페이지 로드 시 MOTD를 가져오고, 1초마다 업데이트
            fetchMOTD();
            setInterval(function () {
                if (isConnected) {
                    fetchMOTD();
                }
            }, 1000);
        });

        socket.addEventListener("close", (event) => {
            console.log("Disconnected from server");
            isConnected = false;
        });

        socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (message.type === MessageType.SPACESHIP_POSITION) {
                updateSpaceshipPosition(message);
            } else if (message.type === MessageType.BULLET_POSITION) {
                updateBulletPosition(message);
            } else if (message.type === MessageType.BOMB_POSITION) {
                updateBombPosition(message);
            } else if (message.type === MessageType.CONNECTED_CLIENT) {
                id = message.id;
                if (!opponents.get(id)) {
                    const opponent = new OpponentShip(canvas.width - 64, 20);
                    opponents.set(id, opponent); // 새로운 상대방 비행기 추가
                    console.log("new client: ", id);
                }
            } else if (message.type === MessageType.CLIENT_DISCONNECTED) {
                id = message.id;
                if (opponents.get(id)) {
                    opponents.delete(id);
                    console.log("remove client: ", id);
                }
            } else if (message.type === MessageType.CREATE_ENEMY) {
                // 적군 생성 메시지를 받았을 때 적군을 화면에 그립니다.
                const enemy = new Enemy(message.x, message.y);
                enemyList.push(enemy);
            } else if (message.type === MessageType.SCORE_UPDATED) {
                stage = message.stage;
                highScore = message.highScore;

                id = message.id || null;
                // 상대방 점수를 받아 갱신
                const opponent = opponents.get(id);
                if (opponent) {
                    opponent.score = message.score;
                }
            }
        });
    });
}

// 서버로부터 WebSocket 주소를 가져온다
async function fetchDataAndConnect() {
    try {
        const response = await fetch('/config');
        const data = await response.json();
        await connectWebSocket(data.webSocketAddress);
        // WebSocket을 사용하여 나머지 코드를 실행
    } catch (error) {
        console.error('환경 설정을 가져오는 중 오류가 발생했습니다.', error);
    }
}

// 접속 수행
fetchDataAndConnect();

async function sendSpaceshipPosition() {
    const message = { type: MessageType.SPACESHIP_POSITION, id: "self", x: spaceship.x, y: spaceship.y };
    socket.send(JSON.stringify(message));
}

async function sendBulletPosition(x, y) {
    const message = { type: MessageType.BULLET_POSITION, x, y };
    socket.send(JSON.stringify(message));
}

async function sendBombPosition(x, y) {
    const message = { type: MessageType.BOMB_POSITION, x, y };
    socket.send(JSON.stringify(message));
}

async function sendScore(score, stage, gameover) {
    const message = { type: MessageType.SCORE_UPDATED, score, stage, gameover };
    socket.send(JSON.stringify(message));
}

async function sendPauseMessage(status) {
    const message = { type: MessageType.PAUSE_STATUS, status };
    if (typeof socket !== 'undefined' && socket.send) {
        socket.send(JSON.stringify(message));
    }
}

function updateSpaceshipPosition(message) {
    const { id, x, y } = message;
    if (id === "self") {
        spaceship.x = message.x; // 나의 비행기 위치 업데이트
        spaceship.y = message.y;
    } else {
        let opponent = opponents.get(id);
        if (!opponent) {
            opponent = new OpponentShip(x, y);
            opponents.set(id, opponent); // 새로운 상대방 비행기 추가
        } else {
            opponent.x = x; // 상대방의 비행기 위치 업데이트
            opponent.y = y;
        }
    }
}

function updateBulletPosition(message) {
    const { id, x, y } = message;

    const opponent = opponents.get(id);
    if (opponent) {
        opponent.createBullet(x, y, BulletType.STANDARD); // 상대방의 비행기에서 총알 생성
    }
}

function updateBombPosition(message) {
    const { id, x, y } = message;

    const opponent = opponents.get(id);
    if (opponent) {
        opponent.createBomb(x, y); // 상대방의 비행기에서 폭탄 생성
    }
}

// 적군 생성 메시지를 서버로 보냅니다.
function createEnemy() {
    if (!isPaused) {
        const message = { type: MessageType.CREATE_ENEMY, start: 0, end: canvas.width };
        socket.send(JSON.stringify(message));
    }
}


// ========================================================
// 각종 처리 함수
// ========================================================
function loadImage() {
    // 이미지를 로드합니다.
    backgroundImage = new Image();
    backgroundImage.src = "images/galaxy2.gif";

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
            spaceship.createBullet(spaceship.x, spaceship.y, BulletType.STANDARD);
            sendBulletPosition(spaceship.x, spaceship.y);
        }

        if (event.key == "e") {
            createEnemy();
        }

        if (event.key == "b") {
            spaceship.createBomb(spaceship.x, spaceship.y);
            sendBombPosition(spaceship.x, spaceship.y);
        }
    });
}

function setupTouchListener() {
    // canvas에 터치 이벤트를 등록합니다.
    canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();
        var touch = event.touches[0];
        var touchX = touch.clientX;
        var touchY = touch.clientY;

        // 터치한 위치를 기반으로 원하는 동작을 수행합니다.
        // 화면을 누르면 무조건 슈팅
        spaceship.createBullet(spaceship.x, spaceship.y, BulletType.STANDARD);
        sendBulletPosition(spaceship.x, spaceship.y);

        spaceship.x = touchX;
        sendSpaceshipPosition();
    });
}

async function update() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // WebSocket 연결이 열릴 때까지 1s 동안 기다립니다.
        await update(); // 재귀적으로 update() 함수를 호출합니다.
        return;
    }

    enemyList.forEach((enemy) => {
        enemy.update(); // Enemy의 업데이트 메소드 호출
    });

    opponents.forEach((opponent) => {
        opponent.update(); // 상대방의 비행기 업데이트 메소드 호출
    });

    spaceship.update(); // Spaceship의 업데이트 메소드 호출
}

function render() {
    // 화면을 그립니다.
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // 점수 출력
    ctx.fillText(`Score: ${spaceship.score}`, 20, 20);
    ctx.fillText(`HighScore: ${highScore}`, canvas.width / 2 - 100, 20);
    ctx.fillText(`Stage: ${stage}`, canvas.width / 2 - 60, 40);
    let index = 1;
    for (const [id, opponent] of opponents) {
        const scoreY = (index - 1) * 30 + 20;
        ctx.fillText(`Opponent${index}: ${opponent.score}`, canvas.width - 200, scoreY);
        index++;
    }

    // 상대방의 비행기 그리기
    opponents.forEach((opponent) => {
        opponent.render(); // Opponent의 렌더 메소드 호출
    });

    // 내 비행기 그리기
    spaceship.render(); // Spaceship의 렌더 메소드 호출

    // 적 비행기 그리기
    enemyList.forEach((enemy) => {
        enemy.render(); // Enemy의 렌더 메소드 호출
    });
}

async function autoCreateEnemy() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // WebSocket 연결이 열릴 때까지 1s 동안 기다립니다.
        await autoCreateEnemy(); // 재귀적으로 autoCreateEnemy() 함수를 호출합니다.
        return;
    }

    if (!gameOver) {
        createEnemy(); // 적 생성
        // 1초마다 자동으로 적 생성
        setTimeout(autoCreateEnemy, 1000);
    }
}

let isPaused = false;
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
        // 게임 로직 일시 정지
        if (!isPaused) {
            isPaused = true
            console.log('paused');
            sendPauseMessage(isPaused);
        }
    } else if (document.visibilityState === "visible") {
        // 게임 로직 재개
        if (isPaused) {
            isPaused = false;
            console.log('unpaused');
            sendPauseMessage(isPaused);
        }
    }
});

function main() {
    if (!gameOver) {
        // 게임이 종료되지 않았으면 화면을 업데이트하고 다음 프레임을 요청합니다.
        render();
        update();
        requestAnimationFrame(main);
    } else {
        // 게임이 종료되면 게임 오버 화면을 그립니다.
        const imageWidth = canvas.width * 2 / 3;
        const imageHeight = canvas.height * 2 / 3;
        const imageX = (canvas.width - imageWidth) / 2;
        const imageY = (canvas.height - imageHeight) / 2;

        ctx.drawImage(gameOverImage, imageX, imageY, imageWidth, imageHeight);
    }
}

loadImage();
setupKeyboardListener();
setupTouchListener();
autoCreateEnemy(); // 첫번째 적 생성
main();
