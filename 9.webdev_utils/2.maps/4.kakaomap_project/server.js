// server.js
import express from 'express';
// const express = require('express');

const app = express();
const PORT = 3000;

// (예시) DB 대신 하드코딩된 장소 리스트
// 보통은 여기서 실제 DB(MySQL, PostgreSQL 등)에서 조회해서 내려줍니다.
const places = [
    { id: 1, name: '경복궁', lat: 37.579617, lng: 126.977041, desc: '조선의 법궁' },
    { id: 2, name: '남산 타워', lat: 37.551169, lng: 126.988227, desc: '서울 야경 명소' },
    { id: 3, name: '명동', lat: 37.563757, lng: 126.985302, desc: '쇼핑 거리' },
];

// 정적 파일 제공 (public 폴더)
app.use(express.static('public'));

// 장소 목록 API
app.get('/api/places', (req, res) => {
    res.json(places);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
