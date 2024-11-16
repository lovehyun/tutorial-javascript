// "esModuleInterop": true 를 추가하거나 또는 import 대신 require 방식을 통해서 로딩
// const express = require('express');
import express, { Request, Response } from 'express';

// Express 앱 생성
const app = express();

// 기본 라우트 설정
app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, World!');
});

// 서버 시작
const PORT: number = 3000;
app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
