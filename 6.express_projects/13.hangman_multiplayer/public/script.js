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

/*
// 1. a~z 자동 브루트포스 (입력 자동화 공격)
// a~z 자동으로 입력하고 "글자 맞추기" 버튼을 눌러서
// 사람보다 훨씬 빠르게 게임을 푸는 공격 코드
(function () {
    const input  = document.getElementById("letterInput");
    const button = document.getElementById("guessBtn");

    if (!input || !button) {
        console.log("input 또는 button을 찾지 못했습니다.");
        return;
    }

    const letters = "abcdefghijklmnopqrstuvwxyz";
    let index = 0;

    input.focus();

    const timer = setInterval(() => {
        // 모든 알파벳을 다 시도했으면 종료
        if (index >= letters.length) {
            clearInterval(timer);
            console.log("브루트포스 완료");
            return;
        }

        const ch = letters[index];
        input.value = ch;
        button.click();          // 실제로 게임에서 guessLetter() 호출

        console.log("try:", ch);
        index++;
    }, 50); // 50ms 간격: 너무 빠르면 서버/브라우저가 버벅일 수 있어서 적당히 조절
})();
*/

/*
// 현재시간: console.log(new Date().toLocaleString('ko-KR'));
//
// 2. "해커1"으로 0초 만에 푼 것처럼 기록하는 공격 (시간 인젝션)
// 전제: 취약 서버(server_weak.js) 처럼
// /api/finish에서 clientFinishedAt를 그대로 믿고 랭킹을 정렬하는 경우.
// 라운드 시작 시각을 fakeTime으로 넣어서
// 0초 만에 푼 것처럼 /api/finish 를 보내는 공격 코드
(async () => {
    try {
        // 1) "해커1" 이름으로 참가 (항상 새 playerId 발급)
        const joinRes = await fetch("/api/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "해커1" })
        });
        const joinData = await joinRes.json();
        const playerId = joinData.playerId;
        console.log("join 완료, playerId:", playerId, "이름:", joinData.name);

        // 2) 현재 라운드 상태 조회
        const stateRes = await fetch("/api/state");
        const state = await stateRes.json();

        const fakeTime = state.roundStart;  // 라운드 시작 시각 = 0초만에 푼 것처럼
        const answer  = state.word;         // 현재 라운드 정답
        const tries   = 1;                  // 한 번만에 맞췄다고 주장

        console.log("라운드 시작(fakeTime):", new Date(fakeTime).toLocaleString());
        console.log("현재(now):", new Date(state.now).toLocaleString());
        console.log("실제 경과 시간:", Math.floor((state.now - state.roundStart) / 1000), "초");

        // 3) 조작된 시간과 정답으로 finish 전송
        const finishRes = await fetch("/api/finish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playerId,
                tries,
                clientFinishedAt: fakeTime, // ⚠ 취약 지점: 서버가 이 값을 믿는 경우
                answer
            })
        });

        const finishData = await finishRes.json();
        console.log("finish 서버 응답:", finishData);
    } catch (e) {
        console.error("공격 중 오류:", e);
    }
})();
*/
