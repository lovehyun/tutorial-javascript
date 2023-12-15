// stage1.js

import { ctx, canvas_size } from "../common/canvas.js";
import { socket } from "../common/comm.js";
import { autoCreateEnemy } from "../resources/Enemy.js";
import { gameOver, highScore, stage, spaceship, opponents, enemyList } from "../common/gamedata.js";


let backgroundImage, gameOverImage;

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "images/galaxy2.gif";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.jpg";
}


async function update() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // WebSocket 연결이 열릴 때까지 1초 대기
        await update(); // 재귀적으로 update() 함수를 호출
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
    // 주요 화면 그리기
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas_size.scaledW, canvas_size.scaledH);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // 점수 출력
    ctx.fillText(`Score: ${spaceship.score}`, 20, 20);
    ctx.fillText(`HighScore: ${highScore}`, canvas_size.scaledW / 2 - 100, 20);
    ctx.fillText(`Stage: ${stage}`, canvas_size.scaledW / 2 - 60, 40);
    let index = 1;
    for (const [id, opponent] of opponents) {
        const scoreY = (index - 1) * 30 + 20;
        ctx.fillText(`Opponent${index}: ${opponent.score}`, canvas_size.scaledW - 200, scoreY);
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

function process() {
    if (!gameOver) {
        // 게임이 종료되지 않았으면 화면을 업데이트하고 다음 프레임을 요청
        render();
        update();
        requestAnimationFrame(process);
    } else {
        // 게임이 종료되면 게임 오버 화면을 출력
        const imageWidth = canvas_size.scaledW * 2 / 3;
        const imageHeight = canvas_size.scaledH * 2 / 3;
        const imageX = (canvas_size.scaledW - imageWidth) / 2;
        const imageY = (canvas_size.scaledH - imageHeight) / 2;

        ctx.drawImage(gameOverImage, imageX, imageY, imageWidth, imageHeight);
    }
}

export function stage1() {
    loadImage();
    process();
    autoCreateEnemy(); // 첫번째 적 생성
}
