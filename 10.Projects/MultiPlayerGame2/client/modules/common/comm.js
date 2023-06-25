// comm.js

import { canvas_size, isPaused } from "./canvas.js";
import { setHighScore, setStage, opponents, enemyList } from "./gamedata.js";
import { Enemy } from "../resources/Enemy.js";
import { OpponentShip } from "../resources/Opponentship.js";
import { BulletType } from "../resources/Bullet.js";


// ========================================================
// 모듈 변수 셋업
// ========================================================

// 실제 웹소켓 연결 변수
export let socket;

// 웹소켓 연결 상태 확인 변수
let isConnected = false;


// ========================================================
// 웹소켓 연결
// ========================================================

// 웹소켓 메세지 유형
const MessageType = {
    CLIENT_CONNECTED: "connectedClient",
    CLIENT_DISCONNECTED: "disconnectedClient",
    SPACESHIP_POSITION: "spaceshipPosition",
    BULLET_POSITION: "bulletPosition",
    BOMB_POSITION: "bombPosition",
    CONNECTED_CLIENT: "connectedClient",
    CREATE_ENEMY: "createEnemyRequest",
    SCORE_UPDATED: "scoreUpdated",
    PAUSE_STATUS: "pauseStatus",
};

// MOTD를 표시하는 함수
function displayMOTD(message) {
    const announceElement = document.getElementById("announcement");
    if (announceElement) {
        announceElement.innerHTML = message.replace(/\n/g, "<br>");
    }
}

// 서버로부터 MOTD를 가져오는 함수
async function fetchMOTD() {
    const host = window.location.host;
    const url = `http://${host}/clients/announce`;
    try {
        const response = await fetch(url);
        const message = await response.text();
        displayMOTD(message);
    } catch (error) {
        console.error(error);
    }
}

// 웹소켓 실제 연결 함수
function connectWebSocket(webSocketAddress) {
    return new Promise((resolve, reject) => {
        socket = new WebSocket(webSocketAddress);

        // WebSocket이 연결되면 실행될 콜백 함수 등록
        socket.addEventListener("open", (event) => {
            console.log("Connected to server");
            isConnected = true;
            // 페이지 로드 시 MOTD를 가져오고, 1초마다 업데이트
            fetchMOTD();
            setInterval(function () {
                if (isConnected) {
                    fetchMOTD();
                }
            }, 1000);
        });

        socket.addEventListener("close", (event) => {
            console.log("Disconnected from server");
            isConnected = false;
        });

        socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (message.type === MessageType.SPACESHIP_POSITION) {
                updateSpaceshipPosition(message);
            } else if (message.type === MessageType.BULLET_POSITION) {
                updateBulletPosition(message);
            } else if (message.type === MessageType.BOMB_POSITION) {
                updateBombPosition(message);
            } else if (message.type === MessageType.CONNECTED_CLIENT) {
                updateOpponentshipConnection(message);
            } else if (message.type === MessageType.CLIENT_DISCONNECTED) {
                updateOpponentshipDisconnection(message);
            } else if (message.type === MessageType.CREATE_ENEMY) {
                updateCreateEnemy(message);
            } else if (message.type === MessageType.SCORE_UPDATED) {
                updateScore(message);
            }
        });
    });
}

// 서버로부터 WebSocket 주소를 가져와서 접속 수행
export async function fetchDataAndConnect() {
    try {
        const response = await fetch('/config');
        const data = await response.json();
        await connectWebSocket(data.webSocketAddress);
        // WebSocket을 사용하여 나머지 코드를 실행
    } catch (error) {
        console.error('환경 설정을 가져오는 중 오류가 발생했습니다.', error);
    }
}


// ========================================================
// 각종 데이터 송수신 처리 함수
// ========================================================

export async function sendSpaceshipPosition(x, y) {
    const x_scale = Math.floor(x);
    const y_scale = Math.floor(y);
    const message = { type: MessageType.SPACESHIP_POSITION, id: "self", x: x_scale, y: y_scale };
    socket.send(JSON.stringify(message));
}

export async function sendBulletPosition(x, y) {
    const x_scale = Math.floor(x);
    const y_scale = Math.floor(y);
    const message = { type: MessageType.BULLET_POSITION, x: x_scale, y: y_scale };
    socket.send(JSON.stringify(message));
}

export async function sendBombPosition(x, y) {
    const x_scale = Math.floor(x);
    const y_scale = Math.floor(y);
    const message = { type: MessageType.BOMB_POSITION, x: x_scale, y: y_scale };
    socket.send(JSON.stringify(message));
}

export async function sendScore(score, stage, gameover) {
    const message = { type: MessageType.SCORE_UPDATED, score, stage, gameover };
    socket.send(JSON.stringify(message));
}

export async function sendPauseMessage(status) {
    const message = { type: MessageType.PAUSE_STATUS, status };
    if (typeof socket !== 'undefined' && socket.send) {
        socket.send(JSON.stringify(message));
    }
}

export function sendCreateEnemy() {
    if (!isPaused) {
        const message = { type: MessageType.CREATE_ENEMY, start: 0, end: canvas_size.scaledW };
        socket.send(JSON.stringify(message));
    }
}

export function updateSpaceshipPosition(message) {
    const { id, x, y } = message;

    if (id === "self") {
        spaceship.x = x; // 나의 비행기 위치 업데이트
        spaceship.y = y;
    } else {
        let opponent = opponents.get(id);
        if (!opponent) {
            opponent = new OpponentShip(x, y);
            opponents.set(id, opponent); // 새로운 상대방 비행기 추가
        } else {
            opponent.x = x; // 상대방의 비행기 위치 업데이트
            opponent.y = y;
        }
    }
}

export function updateBulletPosition(message) {
    const { id, x, y } = message;
    const opponent = opponents.get(id);
    if (opponent) {
        opponent.createBullet(x, y, BulletType.STANDARD); // 상대방의 비행기에서 총알 생성
    }
}

export function updateBombPosition(message) {
    const { id, x, y } = message;
    const opponent = opponents.get(id);
    if (opponent) {
        opponent.createBomb(x, y); // 상대방의 비행기에서 폭탄 생성
    }
}

export function updateOpponentshipConnection(message) {
    const id = message.id;
    if (!opponents.get(id)) {
        const opponent = new OpponentShip(canvas_size.scaledW - 64, 20); // 우측 상단에 신규 상대방 표시
        opponents.set(id, opponent); // 새로운 상대방 비행기 추가
        console.log("new client: ", id);
    }
}

export function updateOpponentshipDisconnection(message) {
    const id = message.id;
    if (opponents.get(id)) {
        opponents.delete(id);
        console.log("remove client: ", id);
    }
}

export function updateCreateEnemy(message) {
    const { x, y } = message;
    // 적군 생성 메시지를 받았을 때 적군을 생성
    const enemy = new Enemy(x, y);
    enemyList.push(enemy);
}

export function updateScore(message) {
    const id = message.id || null;
    // 상대방 점수를 받아 갱신
    const opponent = opponents.get(id);
    if (opponent) {
        opponent.score = message.score;
    }

    // 글로벌 변수 업데이트
    setStage(message.stage);
    setHighScore(message.highScore);
}
