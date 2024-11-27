// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

// 1. 캔바스 기본 그림 그리기

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

// https://icons8.com/icons
function loadImage() {
    // 이미지를 로드합니다.
    backgroundImage = new Image();
    backgroundImage.src = "images/galaxy2.gif";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/ship.png";
}

function render() {
    // 화면을 그립니다.
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
}

function main() {
    render();
    requestAnimationFrame(main);
}

loadImage();
main();
