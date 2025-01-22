// npm i express morgan
// npm i --save-dev @types/express @types/morgan
import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';

const app: Application = express();
const port: number = 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// 사용자 라우트 등록
app.use('/users', userRoutes);

// 에러 처리 미들웨어
app.use((req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({ error: 'Page Not Found' });
});

// 에러 처리 미들웨어 (입출력시 json 규격 오류 등, 다양하게 발생할수 있는 오류...)
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    res.status(400).json({ error: err.message });
});


// 서버 실행
app.listen(port, (): void => {
    console.log(`Server is running at http://localhost:${port}`);
});
