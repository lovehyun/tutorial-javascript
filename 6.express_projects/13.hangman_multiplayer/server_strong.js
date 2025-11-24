// server_strong.js
// ✅ 안전 버전: 클라이언트가 보낸 시간은 무시하고, 서버 시간이 랭킹 기준.

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// CLI 인자 (weak와 동일)
const playSecArg = parseInt(process.argv[2], 10);
const resultSecArg = parseInt(process.argv[3], 10);

const PLAY_SECONDS = Number.isFinite(playSecArg) ? playSecArg : 2 * 60;
const RESULT_SECONDS = Number.isFinite(resultSecArg) ? resultSecArg : 1 * 60;

const ROUND_MS = PLAY_SECONDS * 1000;
const RESULTS_MS = RESULT_SECONDS * 1000;

console.log('=== STRONG 서버 설정 ===');
console.log(`플레이 시간: ${PLAY_SECONDS}초`);
console.log(`결과 시간: ${RESULT_SECONDS}초`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const WORDS = ['apple', 'watch', 'train', 'light', 'mouse', 'plant', 'chair', 'bread', 'phone', 'table'];

const players = new Map();

let gameState = {
    phase: 'playing',
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

setInterval(() => {
    const now = Date.now();
    if (gameState.phase === 'playing' && now >= gameState.roundEnd) {
        switchToResults();
    } else if (gameState.phase === 'results' && now >= gameState.resultsEnd) {
        startNewRound();
    }
}, 1000);

// API

app.post('/api/join', (req, res) => {
    const name = (req.body.name || '').trim() || '익명';
    const playerId = 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    players.set(playerId, { name });
    console.log('join:', playerId, name);
    res.json({ playerId, name });
});

app.get('/api/state', (req, res) => {
    const now = Date.now();

    const ranking = Array.from(gameState.finished.entries())
        .map(([playerId, v]) => ({ playerId, name: v.name, tries: v.tries, finishedAt: v.finishedAt }))
        .sort((a, b) => a.finishedAt - b.finishedAt);

    res.json({
        phase: gameState.phase,
        roundId: gameState.roundId,
        now,
        roundStart: gameState.roundStart,
        roundEnd: gameState.roundEnd,
        resultsEnd: gameState.resultsEnd,
        wordLength: gameState.word.length,
        word: gameState.word, // 프런트에서 Hangman 진행에 사용
        ranking,
    });
});

// 클리어 보고 (clientFinishedAt 무시)
app.post('/api/finish', (req, res) => {
    const { playerId, tries, answer } = req.body;

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

    if (!gameState.finished.has(playerId)) {
        const name = players.get(playerId).name;
        const now = Date.now(); // ✅ 서버 시간이 진짜 완료 시각
        gameState.finished.set(playerId, {
            name,
            tries: typeof tries === 'number' ? tries : null,
            finishedAt: now,
        });
    }

    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`STRONG 서버 실행: http://localhost:${PORT}`);
    console.log('첫 단어:', gameState.word);
});
