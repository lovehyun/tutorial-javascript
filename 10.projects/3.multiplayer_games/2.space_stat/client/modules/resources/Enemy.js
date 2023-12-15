// Enemy.js

import { stage, spaceship, enemyList, gameOver } from "../common/gamedata.js";
import { ctx, canvas_size } from "../common/canvas.js"
import { socket, sendCreateEnemy } from "../common/comm.js";


export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isHit = false;
        this.hitCount = 0; // 총알에 맞은 효과를 주기 위한 카운트
        this.hitTimer = 0; // 맞은 후 사라지기 전까지 효과를 표시하기 위한 타이머
        this.image = new Image();
        this.image.src = "images/enemy.png";
        this.fireImage = new Image();
        this.fireImage.src = "images/fire.png";
        this.explosionImage = new Image();
        this.isExploding = false;
        this.explosionImage.src = "images/explosion.png";
        this.explosionTimer = 0; // 폭발 효과 표시를 위한 타이머
    }

    update() {
        // 적을 아래로 이동
        if (this.isHit) {
            this.y += 1;
            this.hitTimer -= this.hitCount;
            if (this.hitTimer <= 0) {
                this.destroy();
            }
        } else {
            this.y += stage;
        }

        if (this.y >= canvas_size.scaledH - 64) {
            // 적이 화면 아래로 벗어나면 폭발 효과 호출
            this.explosion();
        }    
    }

    destroy() {
        // 적을 목록에서 찾아서 삭제
        const index = enemyList.indexOf(this);
        if (index != -1) {
            enemyList.splice(index, 1);
        }

        // 해당 객체의 참조를 제거하여 메모리에서 해제
        this.x = null;
        this.y = null;
    }

    explosion() {
        // 이미 폭발 처리중이면 대기시간 후 삭제 로직을 구현
        if (this.isExploding) {
            this.explosionTimer -= 1;
            if (this.explosionTimer < 0) {
                // 실제 대미지 적용
                spaceship.hitByEnemy(this.x, this.y, 1);
                this.destroy();
            }
        } else {
            this.isExploding = true;
            this.explosionTimer = 20; // 폭발 효과 타이머 설정 (대략 0.5초 정도?)
        }
    }

    render() {
        // 적군 그리기
        enemyList.forEach((enemy) => {
            // 적군 ship 그리기
            ctx.drawImage(enemy.image, enemy.x, enemy.y);

            // 맞은 효과 그리기
            if (enemy.isHit) {
                ctx.drawImage(this.fireImage, enemy.x, enemy.y);
                if (enemy.hitCount >= 2) {
                    ctx.drawImage(this.fireImage, enemy.x+15, enemy.y+5)
                }
                if (enemy.hitCount >= 3) {
                    ctx.drawImage(this.fireImage, enemy.x+7, enemy.y-8)
                }
            }

            // 공격 효과 그리기
            if (enemy.explosionTimer > 0) {
                if (enemy.isExploding) {
                    ctx.drawImage(enemy.explosionImage, enemy.x + 8, canvas_size.scaledH - 48);
                }
            }
        });
    }

    hit() {
        // 총알에 맞았을때 호출되는 메서드
        if (!this.isHit) {
            this.isHit = true;
            this.hitTimer = 60; // 대략 1초동안 효과를 표시하기 위한 타이머 설정
        }
        this.hitCount++;
    }
}

export async function autoCreateEnemy() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // WebSocket 연결이 열릴 때까지 1초 대기
        await autoCreateEnemy(); // 재귀적으로 autoCreateEnemy() 함수를 호출
        return;
    }

    if (!gameOver) {
        sendCreateEnemy(); // 적 생성
        // 1초마다 자동으로 적 생성
        setTimeout(autoCreateEnemy, 1000);
    }
}
