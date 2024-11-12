const sqlite3 = require('sqlite3').verbose();

(async () => {
    // SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
    const db = new sqlite3.Database('simple.db');

    try {
        // 테이블 생성
        await new Promise((resolve, reject) => {
            db.run('CREATE TABLE IF NOT EXISTS messages (text TEXT)', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('테이블이 성공적으로 생성되었습니다.');

        // 데이터 삽입
        const insertResult = await new Promise((resolve, reject) => {
            db.run('INSERT INTO messages (text) VALUES (?)', ['Hello, SQLite!'], function (err) {
                if (err) reject(err);
                else resolve(this); // `this`는 삽입된 데이터의 ID 정보를 담고 있음
            });
        });
        console.log('데이터가 성공적으로 삽입되었습니다. ID:', insertResult.lastID);

        // 데이터 조회
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM messages', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        rows.forEach(row => console.log('조회된 메시지:', row.text));

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
