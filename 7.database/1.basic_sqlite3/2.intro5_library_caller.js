// main.js
const { runQuery, getQuery, allQuery } = require('./2.intro5_library');


async function runDatabaseOperations() {
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
    }
}

// 함수 실행
runDatabaseOperations();
