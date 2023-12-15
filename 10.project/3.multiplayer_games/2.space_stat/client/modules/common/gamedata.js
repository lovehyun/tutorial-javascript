// gamedata.js

export let gameOver = false;
export let highScore = 0;
export let stage = 1;

export let spaceship = null;
export let opponents = new Map(); // 상대방의 Spaceship 정보
export const enemyList = [];


export function setGameOver(value) {
    gameOver = value;
}

export function setHighScore(value) {
    highScore = value;
}

export function setStage(value) {
    stage = value;
}

export function setSpaceship(object) {
    spaceship = object;
}
