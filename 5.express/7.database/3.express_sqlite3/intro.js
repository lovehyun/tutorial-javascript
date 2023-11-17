const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('mydatabase.db');

// 루트 경로에 대한 예시 핸들러
app.get('/', (req, res) => {
    // SQLite에서 데이터를 조회하는 예시 쿼리
    db.all('SELECT * FROM mytable', (err, rows) => {
        if (err) {
            res.send('Error querying database');
            return;
        }

        // 쿼리 결과를 클라이언트에게 전송
        res.json(rows);
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
