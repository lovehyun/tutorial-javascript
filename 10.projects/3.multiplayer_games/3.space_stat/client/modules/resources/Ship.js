// Ship.js

import { ctx } from "../common/canvas.js"
import { Bullet } from "./Bullet.js"
import { Bomb } from "./Bomb.js"


export class Ship {
    constructor(x, y, imageSrc) {
        this.x = x;
        this.y = y;
        this.score = 0;
        this.bulletList = [];
        this.bombList = [];
        this.image = new Image();
        this.image.src = imageSrc;
    }

    createBullet(x, y, t) {
        // 총알을 생성
        const bullet = new Bullet(x + 25, y - 15, t, this);
        this.bulletList.push(bullet);
    }

    removeBullet(bullet) {
        // 총알을 목록에서 제거
        const index = this.bulletList.indexOf(bullet);
        if (index !== -1) {
            this.bulletList.splice(index, 1);
        }
    }

    createBomb(x, y) {
        // 폭탄을 생성
        const bomb = new Bomb(x + 15, y - 20, this);
        this.bombList.push(bomb);
    }
    
    removeBomb(bomb) {
        // 폭탄을 목록에서 제거
        const index = this.bombList.indexOf(bomb);
        if (index !== -1) {
            this.bombList.splice(index, 1);
        }
    }

    update() {
        // 각각 오버라이딩 해서 구현 필요
        throw new Error("This method must be implemented by the child class.");
    }

    render() {
        // Spaceship의 그리기 로직을 구현
        ctx.drawImage(this.image, this.x, this.y);

        // 총알 그리기
        this.bulletList.forEach((bullet) => {
            ctx.drawImage(bullet.image, bullet.x, bullet.y);
        });

        // 폭탄 그리기
        this.bombList.forEach((bomb) => {
            ctx.drawImage(bomb.image, bomb.x, bomb.y);
        });
    }
}
