// gamemanager.js

// ========================================================
// 적군 생성 및 게임 관리 서버
// ========================================================
class GameRoom {
    constructor() {
        this.highscore = 0;
        this.stage = 1;
    }

    setHighScore(highscore) {
        this.highscore = highscore;
    }

    getHighScore() {
        return this.highscore;
    }

    getStage() {
        return this.stage;
    }

    setStage(stage) {
        this.stage = stage;
    }
}

class Enemy {
    constructor(manager) {
        this.x = 0;
        this.y = 0;
        this.manager = manager;
    }

    init(startX, endX) {
        // 적 초기 위치를 설정합니다.
        this.y = 0;
        this.x = randomInt(startX, endX - 48); // 적군 이미지 사이즈
    }

    update() {
        // 적을 아래로 이동시킵니다.
        this.y += defaultGameRoom.getStage();

        if (this.y >= canvas.height - 64) {
            // TODO: 현재는 서버사이드에서 적군의 liveness 를 관리하지 않음.
            //     // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
            //     gameOver = true;
            //     console.log("gameover!");
            this.destroy();
        }
    }

    destroy() {
        this.manager.removeEnemy(this);

        // 해당 객체의 참조를 제거하여 메모리에서 해제합니다.
        this.x = null;
        this.y = null;
    }
}

class EnemyManager {
    constructor() {
        this.enemyList = [];
    }

    createEnemy(startX, endX) {
        const enemy = new Enemy();
        enemy.init(startX, endX, this);
        this.enemyList.push(enemy);
    }

    removeEnemy(enemy) {
        // 적군을 목록에서 제거합니다.
        const index = this.enemyList.indexOf(enemy);
        if (index !== -1) {
            this.enemyList.splice(index, 1);
        }
    }

    updateEnemies() {
        this.enemyList.forEach((enemy) => {
            enemy.update();
        });
    }
}

function randomInt(min, max) {
    // 주어진 범위에서 임의의 정수를 반환합니다.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 싱글톤 패턴을 적용한 GameRoom 클래스
class GameRoomSingleton {
    constructor() {
        if (!GameRoomSingleton.instance) {
            GameRoomSingleton.instance = new GameRoom();
        }
    }

    getInstance() {
        return GameRoomSingleton.instance;
    }
}

// 싱글톤 패턴을 적용한 EnemyManager 클래스
class EnemyManagerSingleton {
    constructor() {
        if (!EnemyManagerSingleton.instance) {
            EnemyManagerSingleton.instance = new EnemyManager();
        }
    }

    getInstance() {
        return EnemyManagerSingleton.instance;
    }
}

module.exports = {
    defaultGameRoom: new GameRoomSingleton().getInstance(),
    enemyManager: new EnemyManagerSingleton().getInstance(),
};
