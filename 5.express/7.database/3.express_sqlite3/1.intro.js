const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 3000;
const dbFile = 'mydatabase.db';

// SQLite 데이터베이스 연결
const db = new sqlite3.Database(dbFile);

// 초기 데이터베이스 초기화 함수
function initializeDatabase() {
    // init_data.sql 파일 읽기
    const sql = fs.readFileSync('init_database.sql', 'utf8');

    // 파일 내의 SQL 쿼리 실행
    db.exec(sql, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
}

// 데이터베이스 초기화
initializeDatabase();

// 루트 경로에 대한 예시 핸들러
app.get('/:table', (req, res) => {
    const db_table = req.params.table;

    // SQLite에서 데이터를 조회하는 예시 쿼리
    const query = `SELECT * FROM ${db_table}`;

    // SQLite에서 데이터를 조회하는 예시 쿼리
    db.all(query, (err, rows) => {
        if (err) {
            res.send(`Error querying '${db_table}' database`);
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
