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
let gameOver = 0;
let highScore = 0;
let stage = 1;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

// ========================================================
// 각종 객체 생성
// ========================================================
class Bullet {
    constructor(x, y, spaceship) {
        this.x = x;
        this.y = y;
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

let opponents = new Map(); // 상대방의 Spaceship 정보

class OpponentShip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bulletList = [];
        this.image = new Image();
        this.image.src = "images/ship2.png";
        this.score = 0;
    }

    createBullet(x, y) {
        // 총알을 생성합니다.
        const bullet = new Bullet(x, y, this);
        bullet.setImage(2);
        this.bulletList.push(bullet);
    }

    removeBullet(bullet) {
        // 총알을 목록에서 제거합니다.
        const index = this.bulletList.indexOf(bullet);
        if (index !== -1) {
            this.bulletList.splice(index, 1);
        }
    }

    update() {
        // 총알 업데이트를 수행합니다.
        this.bulletList.forEach((bullet) => {
            bullet.update();

            enemyList.forEach((enemy) => {
                if (bullet.checkCollision(enemy)) {
                    // 적과 충돌한 경우 총알과 적을 제거합니다.
                    enemy.destroy();
                    bullet.destroy();

                    // 점수 카운팅
                    // this.score += 1;
                    // NOTE: 서버에서 받아와서 갱신함
                }
            });
        });
    }

    render() {
        // Spaceship의 그리기 로직을 구현합니다.
        ctx.drawImage(this.image, this.x, this.y);

        // 총알을 그립니다.
        this.bulletList.forEach((bullet) => {
            ctx.drawImage(bullet.image, bullet.x, bullet.y);
        });
    }
}

class Spaceship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bulletList = [];
        this.image = new Image();
        this.image.src = "images/ship.png";
        this.score = 0;
    }

    createBullet(x, y) {
        // 총알을 생성합니다.
        const bullet = new Bullet(x, y, this);
        this.bulletList.push(bullet);
    }

    removeBullet(bullet) {
        // 총알을 목록에서 제거합니다.
        const index = this.bulletList.indexOf(bullet);
        if (index !== -1) {
            this.bulletList.splice(index, 1);
        }
    }

    update() {
        // Spaceship의 이동 로직을 구현합니다.
        let isSpaceshipMoving;

        if ("ArrowRight" in keyPressed) {
            spaceship.x += 5;
            isSpaceshipMoving = true;
        } else if ("ArrowLeft" in keyPressed) {
            spaceship.x -= 5;
            isSpaceshipMoving = true;
        } else {
            isSpaceshipMoving = false;
        }

        // 우주선의 x 좌표를 화면 안으로 제한합니다.
        spaceship.x = Math.max(0, Math.min(spaceship.x, canvas.width - 64));

        if (isSpaceshipMoving) {
            sendSpaceshipPosition();
        }

        // 총알 업데이트를 수행합니다.
        this.bulletList.forEach((bullet) => {
            bullet.update();

            enemyList.forEach((enemy) => {
                if (bullet.checkCollision(enemy)) {
                    // 적과 충돌한 경우 총알과 적을 제거합니다.
                    enemy.destroy();
                    bullet.destroy(this.bulletList);

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

        // GameOver 메세지 처리
        if (gameOver) {
            sendScore(this.score, stage, gameOver);
        }
    }

    render() {
        // Spaceship의 그리기 로직을 구현합니다.
        ctx.drawImage(this.image, this.x, this.y);

        // 총알을 그립니다.
        this.bulletList.forEach((bullet) => {
            ctx.drawImage(bullet.image, bullet.x, bullet.y);
        });
    }
}

const spaceship = new Spaceship(spaceshipStartPosition.x, spaceshipStartPosition.y);

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "images/enemy.png";
    }

    update() {
        // 적을 아래로 이동시킵니다.
        this.y += stage;

        if (this.y >= canvas.height - 64) {
            // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
            gameOver = 1;
            console.log("gameover!");
            this.destroy();
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

    render() {
        // Enemy의 그리기 로직을 구현합니다.
        ctx.drawImage(this.image, this.x, this.y);

        // 적군을 그립니다.
        enemyList.forEach((enemy) => {
            ctx.drawImage(enemy.image, enemy.x, enemy.y);
        });
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
            if (message.type === "spaceshipPosition") {
                updateSpaceshipPosition(message);
            } else if (message.type === "bulletPosition") {
                updateBulletPosition(message);
            } else if (message.type === "connectedClient") {
                id = message.id;
                if (!opponents.get(id)) {
                    const opponent = new OpponentShip(canvas.width - 64, 20);
                    opponents.set(id, opponent); // 새로운 상대방 비행기 추가
                    console.log("new client: ", id);
                }
            } else if (message.type === "disconnectedClient") {
                id = message.id;
                if (opponents.get(id)) {
                    opponents.delete(id);
                    console.log("remove client: ", id);
                }
            } else if (message.type === "createEnemy") {
                // 적군 생성 메시지를 받았을 때 적군을 화면에 그립니다.
                const enemy = new Enemy(message.x, message.y);
                enemyList.push(enemy);
            } else if (message.type === "scoreUpdated") {
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
    const message = { type: "spaceshipPosition", id: "self", x: spaceship.x, y: spaceship.y };
    socket.send(JSON.stringify(message));
}

async function sendBulletPosition(x, y) {
    const message = { type: "bulletPosition", x, y };
    socket.send(JSON.stringify(message));
}

async function sendScore(score, stage, gameover) {
    const message = { type: "scoreUpdated", score, stage, gameover };
    socket.send(JSON.stringify(message));
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
        opponent.createBullet(x, y); // 상대방의 비행기에서 총알 생성
    }
}

// 적군 생성 메시지를 서버로 보냅니다.
function createEnemy() {
    const message = { type: "createEnemyRequest", start: 0, end: canvas.width };
    socket.send(JSON.stringify(message));
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
            spaceship.createBullet(spaceship.x + 25, spaceship.y - 15);
            sendBulletPosition(spaceship.x + 25, spaceship.y - 15);
        }

        if (event.key == "e") {
            createEnemy();
        }
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
autoCreateEnemy(); // 첫번째 적 생성
main();
