// Bullet.js

// 총알 이동 유형
export const BulletType = {
    STANDARD: 1,
    LEFT: 2,
    RIGHT: 3,
    LEFT_FAST: 4,
    RIGHT_FAST: 5,
};


export class Bullet {
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
        // 총알을 위로 이동
        this.y -= 7;

        // 총알을 좌우로 이동
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
            // 총알이 화면 위로 벗어나면 제거
            this.spaceship.removeBullet(this);
        }
    }

    checkCollision(enemy) {
        // 적과의 충돌을 검사
        return (
            this.y <= enemy.y &&
            this.x >= enemy.x &&
            this.x <= enemy.x + 64
        );
    }

    destroy() {
        // 총알을 목록에서 찾아서 삭제
        this.spaceship.removeBullet(this);

        // 해당 객체의 참조를 제거하여 메모리에서 해제
        this.x = null;
        this.y = null;
    }
}
