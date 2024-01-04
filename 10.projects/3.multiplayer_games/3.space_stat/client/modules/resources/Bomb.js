// Bomb.js

import { BulletType } from "./Bullet.js";

export class Bomb {
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
        // 폭탄을 위로 이동
        this.y -= 1;
        this.m += 1;
        if (this.m >= 50) {
            // 일정 이동 거리 이후에 폭탄이 터지면 총알을 생성
            this.spaceship.createBullet(this.x, this.y - 5, BulletType.STANDARD);
            this.spaceship.createBullet(this.x - 20, this.y, BulletType.LEFT);
            this.spaceship.createBullet(this.x + 20, this.y, BulletType.RIGHT);
            this.spaceship.createBullet(this.x - 40, this.y + 5, BulletType.LEFT_FAST);
            this.spaceship.createBullet(this.x + 40, this.y + 5, BulletType.RIGHT_FAST);

            this.destroy();
        }
    }

    destroy() {
        // 폭탄을 목록에서 찾아서 삭제
        this.spaceship.removeBomb(this);

        // 해당 객체의 참조를 제거하여 메모리에서 해제
        this.x = null;
        this.y = null;
    }
}
