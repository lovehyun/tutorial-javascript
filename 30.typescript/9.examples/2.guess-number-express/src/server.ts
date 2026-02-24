// src/server.ts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // ESM이면 필요, CJS면 __dirname 그대로 사용
import { GameLogic } from './GameLogic';

const app = express();
const port = 3000;

// JSON body 파싱
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 단일 게임 인스턴스 (데모용: 여러 유저 고려 X)
let game = new GameLogic(7, 1, 100);

app.post('/api/game/start', (req, res) => {
    game = new GameLogic(7, 1, 100);
    res.json({ message: '게임이 시작되었습니다.', maxAttempts: 7 });
});

app.post('/api/game/guess', (req, res) => {
    const { guess } = req.body;

    if (typeof guess !== 'number' || Number.isNaN(guess)) {
        return res.status(400).json({ error: '숫자 guess 필드를 보내주세요.' });
    }

    const result = game.guess(guess);
    res.json(result);
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
