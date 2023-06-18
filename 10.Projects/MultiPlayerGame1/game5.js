// 1. 동일한 비행기를 서버와 통신하며 이동하도록 구현
// 2. 각자의 비행기를 서버를 통해 각각 이동하도록 구현
// 3. 상대방의 비행기를 1대가 아닌 2대 이상으로 통신 가능하도록 구현
// 4. 각자 다 미사일 발사 및 상대 화면에 전송
// 5. 적군 생성 (서버로부터 생성된 적군 클라이언트에서 처리)

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage, gameOverImage;
let gameOver = false;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

// ========================================================
// 각종 객체 생성
// ========================================================
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "images/bullet.png";    
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
    }

    createBullet(x, y) {
        // 총알을 생성합니다.
        const bullet = new Bullet(x, y);
        bullet.setImage(2);
        this.bulletList.push(bullet);
    }

    update() {
        // 총알 업데이트를 수행합니다.
        this.bulletList.forEach((bullet) => {
            bullet.update();
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
    }

    createBullet(x, y) {
        // 총알을 생성합니다.
        const bullet = new Bullet(x, y);
        this.bulletList.push(bullet);
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
        this.y += 2;

        if (this.y >= canvas.height - 64) {
            // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
            gameOver = true;
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
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", (event) => {
    console.log("Connected to server");
});

socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
});

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "spaceshipPosition") {
        updateSpaceshipPosition(message);
    } else if (message.type === "bulletPosition") {
        updateBulletPosition(message);
    } else if (message.type === "disconnectedClient") {
        if (opponents.get(message.id)) {
            opponents.delete(message.id);
            console.log("remove client: ", message.id);
        }
    } else if (message.type === "createEnemy") {
        // 적군 생성 메시지를 받았을 때 적군을 화면에 그립니다.
        const enemy = new Enemy(message.x, message.y);
        enemyList.push(enemy);
    }
});

function sendSpaceshipPosition() {
    const message = { type: "spaceshipPosition", id: "self", x: spaceship.x, y: spaceship.y };
    socket.send(JSON.stringify(message));
}

function sendBulletPosition(x, y) {
    const message = { type: "bulletPosition", x, y };
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
    const message = { type: "createEnemy", start:0, end:canvas.width };
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

function update() {
    if (socket.readyState !== WebSocket.OPEN) {
        setTimeout(update, 100); // Retry after 100ms if the connection is still connecting
        return;
    }

    opponents.forEach((opponent) => {
        opponent.update(); // 상대방의 비행기 업데이트 메소드 호출
    });

    spaceship.update(); // Spaceship의 업데이트 메소드 호출

    enemyList.forEach((enemy) => {
        enemy.update(); // Enemy의 업데이트 메소드 호출
    });
}

function render() {
    // 화면을 그립니다.
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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

function autoCreateEnemy() {
    if (socket.readyState !== WebSocket.OPEN) {
        setTimeout(autoCreateEnemy, 100); // Retry after 100ms if the connection is still connecting
        return;
    }

    createEnemy(); // 적 생성

    // 1초마다 자동으로 적 생성
    setTimeout(autoCreateEnemy, 1000);
}

function main() {
    render();
    update();
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
autoCreateEnemy(); // 첫번째 적 생성
main();
