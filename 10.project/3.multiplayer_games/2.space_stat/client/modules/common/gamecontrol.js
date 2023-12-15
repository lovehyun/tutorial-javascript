// gamecontrol.js

import { canvas } from "./canvas.js";
import { spaceship } from "./gamedata.js";
import { sendSpaceshipPosition, sendBulletPosition, sendBombPosition, sendCreateEnemy } from "./comm.js";
import { BulletType } from "../resources/Bullet.js";


export const keyPressed = {};

export function setupKeyboardListener() {
    // 키보드 이벤트를 처리
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
            sendCreateEnemy();
        }

        if (event.key == "b") {
            spaceship.createBomb(spaceship.x, spaceship.y);
            sendBombPosition(spaceship.x, spaceship.y);
        }
    });
}

export function setupTouchListener() {
    // canvas에 터치 이벤트를 등록
    canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();
        var touch = event.touches[0];
        var touchX = touch.clientX;
        var touchY = touch.clientY;

        // 터치한 위치를 기반으로 원하는 동작을 수행
        // 화면을 누르면 무조건 슈팅
        spaceship.createBullet(spaceship.x, spaceship.y, BulletType.STANDARD);
        sendBulletPosition(spaceship.x, spaceship.y);

        spaceship.x = touchX;
        sendSpaceshipPosition(spaceship.x, spaceship.y);
    });
}
