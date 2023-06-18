// 1. 동일한 비행기를 서버와 통신하며 이동하도록 구현
// 2. 각자의 비행기를 서버를 통해 각각 이동하도록 구현

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, spaceshipImage2;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

let spaceshipX = spaceshipStartPosition.x;
let spaceshipY = spaceshipStartPosition.y;

let opponentSpaceshipX = null; // 상대방의 비행기 위치
let opponentSpaceshipY = null;

function loadImage() {
    // 이미지를 로드합니다.
    backgroundImage = new Image();
    backgroundImage.src = "images/galaxy2.gif";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/ship.png";

    spaceshipImage2 = new Image();
    spaceshipImage2.src = "images/ship2.png";
}

// 웹소켓 연결
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
    } else if (message.type === "opponentConnected") {
        opponentSpaceshipX = message.x; // 상대방의 비행기 위치 업데이트
        opponentSpaceshipY = message.y;
    }
});

function updateSpaceshipPosition(message) {
    if (message.id === "self") {
        spaceshipX = message.x; // 나의 비행기 위치 업데이트
        spaceshipY = message.y;
    } else {
        opponentSpaceshipX = message.x; // 상대방의 비행기 위치 업데이트
        opponentSpaceshipY = message.y;
    }
}

function sendSpaceshipPosition() {
    const message = { type: "spaceshipPosition", id: "self", x: spaceshipX, y: spaceshipY };
    socket.send(JSON.stringify(message));
}

function sendOpponentConnected() {
    const message = { type: "opponentConnected", x: spaceshipX, y: spaceshipY };
    socket.send(JSON.stringify(message));
}

const keyPressed = {};

function setupKeyboardListener() {
    // 키보드 이벤트를 처리합니다.
    document.addEventListener("keydown", function (event) {
        keyPressed[event.key] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keyPressed[event.key];
    });
}

function update() {
    if (socket.readyState !== WebSocket.OPEN) {
        setTimeout(update, 100); // Retry after 100ms if the connection is still connecting
        return;
    }

    if ("ArrowRight" in keyPressed) {
        spaceshipX += 5;
        isSpaceshipMoving = true;
    } else if ("ArrowLeft" in keyPressed) {
        spaceshipX -= 5;
        isSpaceshipMoving = true;
    } else {
        isSpaceshipMoving = false;
    }

    // 우주선의 x 좌표를 화면 안으로 제한합니다.
    spaceshipX = Math.max(0, Math.min(spaceshipX, canvas.width - 64));

    if (isSpaceshipMoving) {
        sendSpaceshipPosition();
    }
}

function render() {
    // 화면을 그립니다.
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    if (opponentSpaceshipX !== null && opponentSpaceshipY !== null) {
        ctx.drawImage(spaceshipImage2, opponentSpaceshipX, opponentSpaceshipY); // 상대방의 비행기 그리기
    }
}

function main() {
    render();
    update();
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
main();
