const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
const port = 3000;
const dbFile = 'mydatabase.db';

// SQLite 데이터베이스 연결
const db = new Database(dbFile);

// 초기 데이터베이스 초기화 함수
function initializeDatabase() {
    // init_data.sql 파일 읽기
    const sql = fs.readFileSync('init_database.sql', 'utf8');

    // 파일 내의 SQL 쿼리 실행
    const statements = sql.split(';').filter(Boolean);
    db.transaction(() => {
        for (const statement of statements) {
            db.exec(statement);
        }
    })();
}

// 데이터베이스 초기화
initializeDatabase();

// 루트 경로에 대한 예시 핸들러
app.get('/:table', (req, res) => {
    const db_table = req.params.table;

    try {
        // SQLite에서 데이터를 조회하는 예시 쿼리
        const query_str = `SELECT * FROM ${db_table}`;

        const query = db.prepare(query_str);
        const rows = query.all();

        // 쿼리 결과를 클라이언트에게 전송
        res.json(rows);
    } catch (err) {
        res.send(`Error querying '${db_table}' database`);
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
