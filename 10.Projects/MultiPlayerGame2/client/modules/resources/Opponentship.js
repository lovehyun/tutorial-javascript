// Opponentship.js

import { enemyList } from "../common/gamedata.js";
import { Ship } from "./Ship.js";
import { Bullet } from "./Bullet.js";
import { Bomb } from "./Bomb.js";


export class OpponentShip extends Ship {
    constructor(x, y) {
        super(x, y, "images/ship2.png");
    }

    // 메소드 오버라이딩
    createBullet(x, y, t) {
        // 총알을 생성
        const bullet = new Bullet(x + 25, y - 15, t, this);
        bullet.setImage(2);
        this.bulletList.push(bullet);
    }

    // 메소드 오버라이딩
    createBomb(x, y) {
        // 폭탄을 생성
        const bomb = new Bomb(x + 15, y - 20, this);
        bomb.setImage(2);
        this.bombList.push(bomb);
    }

    update() {
        // 총알 업데이트를 수행
        this.bulletList.forEach((bullet) => {
            bullet.update();

            enemyList.forEach((enemy) => {
                if (bullet.checkCollision(enemy)) {
                    // 적과 충돌한 경우 총알과 적을 제거
                    // enemy.destroy();
                    enemy.hit();
                    bullet.destroy();

                    // 점수 카운팅
                    // this.score += 1;
                    // NOTE: 서버에서 받아와서 갱신함
                }
            });
        });

        // 폭탄 업데이트를 수행
        this.bombList.forEach((bomb) => {
            bomb.update();
        });
    }
}
