// Spaceship.js

import { ctx, canvas_size } from "../common/canvas.js"
import { keyPressed } from "../common/gamecontrol.js";
import { gameOver, setGameOver, stage, setStage, enemyList } from "../common/gamedata.js";
import { Ship } from "./Ship.js";
import { sendSpaceshipPosition, sendScore } from "../common/comm.js";


export class Spaceship extends Ship {
    constructor(x, y) {
        // 싱글톤 객체로 메인쉽 생성
        if (Spaceship.instance) {
            return Spaceship.instance;
        }

        super(x, y, "images/ship.png");

        // 생명 처리를 위한 추가 필드를 생성
        this.lifeimage = new Image();
        this.lifeimage.src = "images/heart.png";
        this.extraLife = 2;

        Spaceship.instance = this;
    }

    static getInstance(x, y) {
        // 싱글톤 객체를 반환하는 정적 메서드
        if (arguments.length === 0) {
            if (!Spaceship.instance) {
                throw new Error("Instance has not been created yet.");
            }
            return Spaceship.instance;
        } else if (arguments.length === 2) {
            if (Spaceship.instance) {
                throw new Error("Instance has already been created.");
            } else {
                console.log("A new ship has been created.")
                return new Spaceship(x, y);
            }
        } else {
            throw new Error("Invalid number of arguments.");
        }
    }

    update() {
        // Spaceship의 이동 로직을 구현
        let isSpaceshipMoving;

        if ("ArrowRight" in keyPressed) {
            this.x += 5;
            isSpaceshipMoving = true;
        } else if ("ArrowLeft" in keyPressed) {
            this.x -= 5;
            isSpaceshipMoving = true;
        } else {
            isSpaceshipMoving = false;
        }

        // 우주선의 x 좌표를 화면 안으로 제한
        this.x = Math.max(0, Math.min(this.x, canvas_size.scaledW - 64));

        if (isSpaceshipMoving) {
            sendSpaceshipPosition(this.x, this.y);
        }

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
                    this.score += 1;
                    // 점수에 따라 스테이지를 계산
                    if (this.score >= stage * stage * 10) {
                        setStage(stage + 1);
                        console.log(`level up, score=${this.score}, stage=${stage}`);
                    }
                    sendScore(this.score, stage, gameOver);
                }
            });
        });
    
        // 폭탄 업데이트를 수행
        this.bombList.forEach((bomb) => {
            bomb.update();
        });
        
        // GameOver 메세지 처리
        if (gameOver) {
            sendScore(this.score, stage, gameOver);
        }
    }

    // 생명 처리를 위해 상속 객체를 오버라이딩 하여 기능을 확장
    render() {
        super.render();

        for (let i = 0; i < this.extraLife; i++) {
            ctx.drawImage(this.lifeimage, i * 30 + 20, 30);
        };
    }

    hitByEnemy(damage) {
        this.extraLife -= damage;
        console.log("hitByEnemy!")

        // 생명이 모두 다 감소하면 종료 처리
        if (this.extraLife < 0) {
            setGameOver(true);
            console.log("gameover!");
        }
    }
}
