import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises'; // 파일 시스템 비동기 API

const app: Application = express();
const port: number = 3000;

// Middleware 설정
app.use(morgan('dev')); // HTTP 요청 로깅
app.use(bodyParser.json()); // JSON 본문 파싱
app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 본문 파싱
app.use(cors()); // CORS 허용

// 라우트 설정
app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, TypeScript with Express and Middleware!');
});

// 의도적으로 에러를 발생시키는 라우트
app.get('/error', (req: Request, res: Response): void => {
    throw new Error('Something went wrong!');
});

// 비동기 작업에서 에러 발생 예제
app.get('/read-file', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 비동기 파일 읽기 작업 수행
        const data = await fs.readFile('non-existent-file.txt', 'utf-8'); // 파일이 없으므로 에러 발생
        res.send(data);
    } catch (error) {
        next(error); // 에러를 핸들링 미들웨어로 전달
    }
});

// 에러 핸들링 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error]: ${err.message}`); // 콘솔에 에러 로그 출력
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

// 서버 실행
app.listen(port, (): void => {
    console.log(`Server is running at http://localhost:${port}`);
});
