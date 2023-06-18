// 1. 캔바스 기본 그림 그리기
// 2. 키보드로 좌우 이동하기

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage, spaceshipImage;

const spaceshipStartPosition = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 64,
};

let spaceshipX = spaceshipStartPosition.x;
let spaceshipY = spaceshipStartPosition.y;

function loadImage() {
    // 이미지를 로드합니다.
    backgroundImage = new Image();
    backgroundImage.src = "images/galaxy2.gif";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/ship.png";
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
}

function render() {
    // 화면을 그립니다.
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
}

function main() {
    render();
    update();
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
main();
