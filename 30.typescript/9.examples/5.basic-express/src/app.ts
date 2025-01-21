// "esModuleInterop": true 를 추가하거나 또는 import 대신 require 방식을 통해서 로딩
// const express = require('express');

// 방법2. type 적용
import express, { Application, Request, Response } from 'express';
// 모듈 내에서의 내보내기 방식에 따라 express 는 default export, 나머지는 내보내는 객체

// Express 앱 생성
const app: Application = express();
const PORT: number = 3000;

// 기본 라우트 설정
app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, World!');
});

// 서버 시작
app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// 방법1. 기본 원형
// src/index.ts
//
// import express, { Request, Response } from 'express';
//
// const app = express();
// const port = 3000;
//
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, World!');
// });
//
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
