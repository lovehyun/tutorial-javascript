const sqlite3 = require('sqlite3').verbose();

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = new sqlite3.Database('simple.db');

// 프라미스로 변환하는 유틸리티 함수
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this); // `this`는 삽입된 데이터의 ID 등의 정보를 담고 있음
        });
    });
}

function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
}

function allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// async/await로 데이터베이스 작업 수행
(async () => {
    try {
        // 테이블 생성
        await runQuery('CREATE TABLE IF NOT EXISTS messages (text TEXT)');
        console.log('테이블이 성공적으로 생성되었습니다.');

        // 데이터 삽입
        const insertResult = await runQuery('INSERT INTO messages (text) VALUES (?)', ['Hello, SQLite!']);
        console.log('데이터가 성공적으로 삽입되었습니다. ID:', insertResult.lastID);

        // 데이터 조회
        const rows = await allQuery('SELECT * FROM messages');
        rows.forEach(row => console.log('조회된 메시지:', row.text));

    } catch (err) {
        console.error('데이터베이스 작업 오류:', err);
    } finally {
        // 데이터베이스 연결 종료
        db.close((err) => {
            if (err) {
                return console.error('데이터베이스 종료 오류:', err);
            }
            console.log('데이터베이스 연결이 종료되었습니다.');
        });
    }
})();
