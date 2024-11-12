const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

(async () => {
    try {
        // 테이블 생성
        await new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS greetings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT,
                author TEXT
            )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('테이블이 성공적으로 생성되었습니다.');

        // 데이터 삽입
        const insertId = await new Promise((resolve, reject) => {
            db.run('INSERT INTO greetings (message, author) VALUES (?, ?)', ['Hello, World!', 'Alice'], function (err) {
                if (err) reject(err);
                else resolve(this.lastID); // `this`는 삽입된 데이터의 ID 정보를 담고 있음
            });
        });
        console.log('데이터가 성공적으로 삽입되었습니다. ID:', insertId);

        // 데이터 조회
        const rows = await new Promise((resolve, reject) => {
            const results = [];
            db.each('SELECT * FROM greetings', [], (err, row) => {
                if (err) reject(err);
                else results.push(row);
            }, (err, count) => {
                if (err) reject(err);
                else resolve(results); // 모든 행의 결과 반환
            });
        });
        rows.forEach(row => console.log('조회된 메시지:', row.message));

    } catch (err) {
        console.error('데이터베이스 작업 오류:', err);
    } finally {
        // 데이터베이스 연결 종료
        await new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('데이터베이스 연결이 종료되었습니다.');
    }
})();
