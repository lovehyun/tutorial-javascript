const sqlite3 = require('sqlite3').verbose();

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = new sqlite3.Database('simple.db');

// 테이블 생성 및 데이터 삽입
db.run('CREATE TABLE IF NOT EXISTS messages (text TEXT)', (err) => {
    if (err) {
        return console.error('테이블 생성 오류:', err);
    }
    console.log('테이블이 성공적으로 생성되었습니다.');

    // 테이블 생성이 완료된 후 데이터 삽입
    db.run('INSERT INTO messages (text) VALUES (?)', ['Hello, SQLite!'], function (err) {
        if (err) {
            return console.error('데이터 삽입 오류:', err);
        }
        console.log('데이터가 삽입되었습니다.');

        // 데이터 삽입이 완료된 후 데이터 조회
        db.each('SELECT * FROM messages', (err, row) => {
            if (err) {
                return console.error('데이터 조회 오류:', err);
            }
            console.log('조회된 메시지:', row.text); // "Hello, SQLite!"
        });

        // 조회가 완료된 후 데이터베이스 연결 종료
        db.close((err) => {
            if (err) {
                return console.error('데이터베이스 종료 오류:', err);
            }
            console.log('데이터베이스 연결이 종료되었습니다.');
        });
    });
});
