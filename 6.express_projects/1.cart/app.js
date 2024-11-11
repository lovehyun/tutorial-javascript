
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 환경 변수 설정
dotenv.config();

// 경로에 따른 라우트 모듈
import mainRoutes from './src/routes/mainRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

import { sessionConfig } from './config/sessionConfig.js';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionConfig); // 분리된 세션 설정 적용

app.use(morgan('dev')); // dev, combined

// 정적 파일 제공
app.use(express.static('public'));

// 라우트 연결
app.use('/', mainRoutes);
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
