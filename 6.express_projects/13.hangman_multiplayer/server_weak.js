// server_weak.js
// ❌ 취약 버전: 클라이언트가 보내는 clientFinishedAt 값을 그대로 믿어서
//    "누가 더 빨리 맞췄는지" 랭킹이 조작 가능함.

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 라운드 시간: CLI 인자로 받기 (기본 2분/1분)
//   node server_weak.js          -> 플레이 2분, 결과 1분
//   node server_weak.js 60 30    -> 플레이 60초, 결과 30초
const playSecArg = parseInt(process.argv[2], 10);
const resultSecArg = parseInt(process.argv[3], 10);

const PLAY_SECONDS = Number.isFinite(playSecArg) ? playSecArg : 2 * 60;
const RESULT_SECONDS = Number.isFinite(resultSecArg) ? resultSecArg : 1 * 60;

const ROUND_MS = PLAY_SECONDS * 1000;
const RESULTS_MS = RESULT_SECONDS * 1000;

console.log('=== WEAK 서버 설정 ===');
console.log(`플레이 시간: ${PLAY_SECONDS}초`);
console.log(`결과 시간: ${RESULT_SECONDS}초`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 5글자 단어 목록
const WORDS = ['apple', 'watch', 'train', 'light', 'mouse', 'plant', 'chair', 'bread', 'phone', 'table'];

const players = new Map(); // playerId -> { name }

// finished: playerId -> { name, tries, finishedAt }
let gameState = {
    phase: 'playing', // "playing" | "results"
    roundId: 1,
    word: randomWord(),
    roundStart: Date.now(),
    roundEnd: Date.now() + ROUND_MS,
    resultsEnd: null,
    finished: new Map(),
};

function randomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function startNewRound() {
    gameState.phase = 'playing';
    gameState.roundId += 1;
    gameState.word = randomWord();
    gameState.roundStart = Date.now();
    gameState.roundEnd = gameState.roundStart + ROUND_MS;
    gameState.resultsEnd = null;
    gameState.finished = new Map();
    console.log('=== 새 라운드 시작:', gameState.roundId, '단어:', gameState.word);
}

function switchToResults() {
    gameState.phase = 'results';
    gameState.resultsEnd = Date.now() + RESULTS_MS;
    console.log('=== 결과 시간 시작 (round:', gameState.roundId, ')');
}

// 1초마다 라운드 상태 전환
setInterval(() => {
    const now = Date.now();
    if (gameState.phase === 'playing' && now >= gameState.roundEnd) {
        switchToResults();
    } else if (gameState.phase === 'results' && now >= gameState.resultsEnd) {
        startNewRound();
    }
}, 1000);

// ---------------- API ----------------

// 이름 등록
app.post('/api/join', (req, res) => {
    const name = (req.body.name || '').trim() || '익명';
    const playerId = 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    players.set(playerId, { name });
    console.log('join:', playerId, name);
    res.json({ playerId, name });
});

// 현재 상태 조회
app.get('/api/state', (req, res) => {
    const now = Date.now();

    const ranking = Array.from(gameState.finished.entries())
        .map(([playerId, v]) => ({ playerId, name: v.name, tries: v.tries, finishedAt: v.finishedAt }))
        .sort((a, b) => a.finishedAt - b.finishedAt); // 더 빨리 끝난 사람이 1등

    res.json({
        phase: gameState.phase,
        roundId: gameState.roundId,
        now,
        roundStart: gameState.roundStart,
        roundEnd: gameState.roundEnd,
        resultsEnd: gameState.resultsEnd,
        wordLength: gameState.word.length,
        // 👇 게임 플레이를 위해 정답 단어를 내려줌 (프런트는 이걸로 행맨 진행)
        word: gameState.word,
        ranking,
    });
});

// 클리어 보고 (취약: clientFinishedAt 신뢰)
app.post('/api/finish', (req, res) => {
    const { playerId, tries, clientFinishedAt, answer } = req.body;

    if (!players.has(playerId)) {
        return res.status(400).json({ ok: false, error: '유효하지 않은 playerId' });
    }
    if (gameState.phase !== 'playing') {
        return res.status(400).json({ ok: false, error: '지금은 플레이 시간이 아닙니다.' });
    }

    const normalized = (answer || '').trim().toLowerCase();
    if (normalized !== gameState.word) {
        return res.json({ ok: false, error: '정답이 아닙니다.' });
    }

    // 이미 기록된 사람은 무시
    if (!gameState.finished.has(playerId)) {
        const name = players.get(playerId).name;
        const now = Date.now();

        // ⚠ 취약 지점: 클라이언트가 보낸 시간을 그대로 사용
        const finishedAt =
            typeof clientFinishedAt === 'number' && Number.isFinite(clientFinishedAt)
                ? clientFinishedAt // ❌ 공격자가 여기 값만 조작하면, 가장 빨리 맞춘 것처럼 보임
                : now;

        gameState.finished.set(playerId, {
            name,
            tries: typeof tries === 'number' ? tries : null,
            finishedAt,
        });
    }

    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`WEAK 서버 실행: http://localhost:${PORT}`);
    console.log('첫 단어:', gameState.word);
});
