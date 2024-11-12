const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

// Promise로 감싼 실행 함수
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.lastID); // 삽입된 데이터의 ID 반환
        });
    });
}

function eachQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        const results = [];
        db.each(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                results.push(row);
            }
        }, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(results); // 모든 행의 결과 반환
            }
        });
    });
}

function closeDb() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// 전체 작업을 실행하는 함수
(async () => {
    try {
        // 테이블 생성
        await runQuery(`CREATE TABLE IF NOT EXISTS greetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT,
            author TEXT
        )`);
        console.log('테이블이 성공적으로 생성되었습니다.');

        // 데이터 삽입
        const insertId = await runQuery('INSERT INTO greetings (message, author) VALUES (?, ?)', ['Hello, World!', 'Alice']);
        console.log('데이터가 성공적으로 삽입되었습니다. ID:', insertId);

        // 데이터 조회
        const rows = await eachQuery('SELECT * FROM greetings');
        rows.forEach(row => console.log('조회된 메시지:', row.message));

    } catch (err) {
        console.error('데이터베이스 작업 오류:', err);
    } finally {
        // 데이터베이스 연결 종료
        await closeDb();
        console.log('데이터베이스 연결이 종료되었습니다.');
    }
})();
