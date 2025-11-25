// public/script.js

let playerId = null;
let playerName = null;
let lastState = null;
let lastRoundId = null;
let pollTimer = null;

// 현재 문서가 위치한 디렉터리 경로를 base로 사용 (예: /hangman, /game 등)
// 예) https://example.com/hangman/index.html -> /hangman
//     https://example.com/hangman/          -> /hangman
//     https://example.com/                  -> "" (루트)
const BASE = new URL('.', window.location.href).pathname.replace(/\/$/, '');

// Hangman 상태
let answer = "";        // 정답 단어 (서버에서 받음)
let display = [];       // ['_', 'p', '_', ...]
let tries = 0;          // 시도 횟수
let usedLetters = [];   // 사용한 글자 목록
let isGameOver = false; // 단어를 모두 맞췄는지 여부

// DOM
const wordEl = document.getElementById("word");
const triesEl = document.getElementById("tries");
const usedLettersEl = document.getElementById("usedLetters");
const messageEl = document.getElementById("message");
const letterInput = document.getElementById("letterInput");
const guessBtn = document.getElementById("guessBtn");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const playerNameEl = document.getElementById("playerName");
const rankingBody = document.querySelector("#rankingTable tbody");

function formatTimeDiff(ms) {
    if (ms < 0) ms = 0;
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
}

// 이름 등록
async function joinGame() {
    const name = prompt("이름을 입력해주세요:", "") || "익명";
    const res = await fetch(`${BASE}/api/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
    const data = await res.json();
    playerId = data.playerId;
    playerName = data.name;
    playerNameEl.textContent = `플레이어: ${playerName}`;
}

// 서버 상태 조회
async function fetchState() {
    const res = await fetch(`${BASE}/api/state`);
    const state = await res.json();
    lastState = state;
    // 새 라운드가 시작됐으면 클라이언트 행맨 상태 초기화
    if (lastRoundId === null || state.roundId !== lastRoundId) {
        initHangman(state);
        lastRoundId = state.roundId;
    }
    renderState(state);
}

// 행맨 상태 초기화 (서버 단어 사용)
function initHangman(state) {
    answer = state.word.toLowerCase();
    display = Array(state.wordLength).fill("_");
    tries = 0;
    usedLetters = [];
    isGameOver = false;
    messageEl.textContent = "알파벳 한 글자씩 맞춰보세요!";
    updateHangmanScreen();
    letterInput.value = "";
    letterInput.focus();
}

// 행맨 화면 갱신
function updateHangmanScreen() {
    wordEl.textContent = display.join(" ");
    triesEl.textContent = tries;
    usedLettersEl.textContent = usedLetters.join(", ");
}

// 상태 및 랭킹 렌더링
function renderState(state) {
    const now = state.now;

    if (state.phase === "playing") {
        statusEl.textContent = `라운드 ${state.roundId} 진행 중`;
        const remain = state.roundEnd - now;
        timerEl.textContent = `남은 시간: ${formatTimeDiff(remain)} (단어 길이: ${state.wordLength})`;
        letterInput.disabled = false;
        guessBtn.disabled = false;
    } else {
        statusEl.textContent = `라운드 ${state.roundId} 결과 시간`;
        const remain = state.resultsEnd - now;
        timerEl.textContent = `다음 라운드까지: ${formatTimeDiff(remain)}  정답: ${state.word}`;
        letterInput.disabled = true;
        guessBtn.disabled = true;
    }

    // 랭킹 테이블
    rankingBody.innerHTML = "";
    (state.ranking || []).forEach((row, idx) => {
        const tr = document.createElement("tr");
        if (row.playerId === playerId) {
            tr.classList.add("me");
        }
        const date = new Date(row.finishedAt);
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${row.name}</td>
            <td>${row.tries ?? "-"}</td>
            <td>${date.toLocaleTimeString()}</td>
        `;
        rankingBody.appendChild(tr);
    });
}

// 글자 추측 (행맨 핵심)
function guessLetter() {
    if (!lastState || lastState.phase !== "playing") {
        messageEl.textContent = "지금은 글자를 보낼 수 있는 시간이 아닙니다.";
        return;
    }
    if (isGameOver) return;
    if (!answer) return;

    let letter = letterInput.value.toLowerCase();
    letterInput.value = "";
    letterInput.focus();

    if (!letter || letter < "a" || letter > "z") {
        messageEl.textContent = "a~z 알파벳 한 글자를 입력해주세요.";
        return;
    }

    if (usedLetters.includes(letter)) {
        messageEl.textContent = `"${letter}" 는 이미 사용한 글자입니다.`;
        return;
    }

    // 새로운 시도이므로 시도 횟수 +1
    tries++;
    usedLetters.push(letter);

    if (answer.includes(letter)) {
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === letter) {
                display[i] = letter;
            }
        }
        messageEl.textContent = `"${letter}" 맞췄어요!`;

        // 모두 맞췄는지 확인
        if (!display.includes("_")) {
            isGameOver = true;
            messageEl.textContent =
                `축하합니다! 단어는 "${answer}" 였습니다. 총 ${tries}번 시도했어요. 🎉`;
            // 클리어 시간 서버에 보고
            finishGame();
        }
    } else {
        messageEl.textContent = `"${letter}" 는 단어에 없습니다. 계속 시도해보세요.`;
    }

    updateHangmanScreen();
}

// 클리어 시간 서버에 전송
async function finishGame() {
    if (!playerId || !answer) return;

    const clientFinishedAt = Date.now(); // weak 서버에서만 취약하게 사용됨

    try {
        const res = await fetch(`${BASE}/api/finish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playerId,
                tries,
                clientFinishedAt,
                answer
            })
        });
        const data = await res.json();
        if (!data.ok && data.error) {
            messageEl.textContent += ` (서버 기록 실패: ${data.error})`;
        }
    } catch (err) {
        console.error(err);
        messageEl.textContent += " (서버 통신 오류)";
    }

    // 최신 랭킹 갱신
    fetchState();
}

// 초기화
async function init() {
    await joinGame();
    await fetchState();
    pollTimer = setInterval(fetchState, 1000);
    letterInput.focus();
}

guessBtn.addEventListener("click", guessLetter);
letterInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        guessLetter();
    }
});

document.addEventListener("DOMContentLoaded", init);

window.runAttack = function (name) {
    const s = document.createElement("script");
    s.src = `${BASE}/${name}.js`;
    document.head.appendChild(s);
};
