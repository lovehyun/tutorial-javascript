// src/server.ts
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // ESM이면 필요, CJS면 __dirname 그대로 사용
import { GameLogic } from './GameLogic';

// (ESM 환경에서 __dirname 사용해야 할 경우)
// const __filename: string = fileURLToPath(import.meta.url);
// const __dirname: string = path.dirname(__filename);

const app: express.Express = express();
const port: number = 3000;

// 요청 Body 타입
interface GuessRequestBody {
    guess: number;
}

// 응답 타입들
interface StartGameResponse {
    message: string;
    maxAttempts: number;
}

interface ErrorResponse {
    error: string;
}

// GameLogic.guess 의 반환 타입을 그대로 따오기
type GuessResponse = ReturnType<GameLogic['guess']>;

// JSON body 파싱
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 단일 게임 인스턴스 (데모용: 여러 유저 고려 X)
let game: GameLogic = new GameLogic(7, 1, 100);

app.post('/api/game/start',
    (req: Request, res: Response<StartGameResponse>): void => {
        game = new GameLogic(7, 1, 100);
        res.json({ message: '게임이 시작되었습니다.', maxAttempts: 7 });
    }
);

app.post('/api/game/guess',
    (
        req: Request<unknown, unknown, GuessRequestBody>,
        res: Response<GuessResponse | ErrorResponse>
    ): void => {
        const { guess } = req.body;

        if (typeof guess !== 'number' || Number.isNaN(guess)) {
            res
                .status(400)
                .json({ error: '숫자 guess 필드를 보내주세요.' });
            return;
        }

        const result: GuessResponse = game.guess(guess);
        res.json(result);
    }
);

app.listen(port, (): void => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
