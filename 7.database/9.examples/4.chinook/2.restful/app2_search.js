require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = process.env.DB_PATH;
const db = new sqlite3.Database(path.resolve(__dirname, dbPath));

// "public" 폴더에 있는 정적 파일을 제공
app.use(express.static('public'));

// 메인 라우트에서 index2.html 불러오기
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

// 검색 엔드포인트 설정
app.get('/api/search', (req, res) => {
    const { searchQuery, searchScope } = req.query;

    // 검색 범위에 따른 테이블 및 필드 매핑
    const searchOptions = {
        'artist': { table: 'artists', field: 'name' },
        'album': { table: 'albums', field: 'title' },
        'track': { table: 'tracks', field: 'name' },
        'composer': { table: 'tracks', field: 'composer' },
        'genre': { table: 'genres', field: 'name' },
        'customer': { table: 'customers', field: 'firstname' }  // 또는 lastname
    };

    // 검색 범위가 유효하지 않은 경우 에러 반환
    const option = searchOptions[searchScope];
    if (!option) {
        res.status(400).json({ error: "유효하지 않은 검색 범위입니다." });
        return;
    }

    // SQL 쿼리 생성 및 실행
    const sql = `SELECT * FROM ${option.table} WHERE ${option.field} LIKE ?`;
    db.all(sql, [`%${searchQuery}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "데이터베이스 오류가 발생했습니다." });
            return;
        }
        // 결과를 JSON 형식으로 반환
        res.json({ results: rows });
    });
});

// 서버 포트 설정
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
