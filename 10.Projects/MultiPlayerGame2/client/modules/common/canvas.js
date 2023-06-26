// canvas.js

import { sendPauseMessage } from "./comm.js";


// ========================================================
// 캔바스 생성
// ========================================================

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d");
export let isPaused = false;
export let canvas_size = { w: 0, h: 0, sf: 1, scaledW: 0, scaledH: 0 }

let dynamicCanvas = true;
const DEFAULT_CANVAS_WIDTH = 600;
const DEFAULT_CANVAS_HEIGHT = 720;

let gameContainer = document.getElementById("gameContainer");
if (gameContainer) {
    gameContainer.appendChild(canvas);
} else {
    document.body.appendChild(canvas);
}

// 창 이동 및 탭전환에 따른 활성화/비활성화 처리
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
        // 게임 로직 일시 정지
        if (!isPaused) {
            isPaused = true;
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

// 화면 크기에 맞게 캔버스 크기 조정
export function resizeCanvas() {
    let scaledW = 0;
    let scaledH = 0;
    let scaleFactor = 1.0;

    if (dynamicCanvas) {
        // 원하는 최대 해상도 (기본 600 x 720 으로 배율 통해 맞춤)
        const screenWidth = window.innerWidth * 0.95;
        const screenHeight = window.innerHeight * 0.75;

        // 캔버스 크기를 화면 크기에 맞게 자동 조정
        const sf_width = screenWidth / DEFAULT_CANVAS_WIDTH;
        const sf_height = screenHeight / DEFAULT_CANVAS_HEIGHT;

        if (sf_width > sf_height) {
            canvas.height = screenHeight;
            scaleFactor = sf_height;
            canvas.width = canvas.height / 1.2;
        } else {
            canvas.width = screenWidth;
            scaleFactor = sf_width;
            canvas.height = canvas.width * 1.2;
        }        

        const ctx = canvas.getContext('2d');
        ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);

        scaledW = Math.floor(canvas.width / scaleFactor);
        scaledH = Math.floor(canvas.height / scaleFactor);

        draw_scale_demo();
    } else {
        canvas.width = DEFAULT_CANVAS_WIDTH;
        canvas.height = DEFAULT_CANVAS_HEIGHT;
        scaledW = DEFAULT_CANVAS_WIDTH;
        scaledH = DEFAULT_CANVAS_HEIGHT;
    }

    canvas_size = { 
        w: canvas.width, h: canvas.height, sf: scaleFactor,
        scaledW: scaledW, scaledH: scaledH
    }

    console.log("Canvas resized (w, h, sf): ", canvas_size);
}

function draw_scale_demo() {   
    // 가로 선 그리기
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // 세로 선 그리기
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // 레이블링
    ctx.font = '14px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(`Width: ${canvas.width}`, 10, canvas.height - 10);

    ctx.fillStyle = 'blue';
    ctx.fillText(`Height: ${canvas.height}`, canvas.width - 80, 20);
}
