// npm i express morgan
// npm i --save-dev @types/express @types/morgan
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import userRoutes from './userRoutes';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// 사용자 라우트 등록
app.use('/users', userRoutes);

// 에러 처리 미들웨어
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({ error: error.message });
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
