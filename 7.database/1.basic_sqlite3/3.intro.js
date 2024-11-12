// sqlite3 라이브러리는 기본적으로 비동기적으로 동작합니다. 
// SQLite3 자체는 동기적이지만, sqlite3 라이브러리는 비동기적 콜백을 사용하여 Node.js 환경에서 사용할 수 있도록 구현되었습니다.
// 예를 들어, 쿼리를 수행하는 run 메소드는 콜백 함수를 통해 결과를 반환합니다.

const sqlite3 = require('sqlite3').verbose();
// const sqlite3 = require('sqlite3');

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = new sqlite3.Database('mydatabase.db');

// 테이블 생성
db.run(`CREATE TABLE IF NOT EXISTS greetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    author TEXT
)`);

// 데이터 삽입
db.run('INSERT INTO greetings (message, author) VALUES (?, ?)', ['Hello, World!', 'Alice'], function (err) {
    if (err) {
        console.error('Error inserting into database:', err);
        return;
    }
    console.log('Added with ID:', this.lastID);
});

// 데이터 조회
db.each('SELECT * FROM greetings', (err, row) => {
    if (err) {
        console.error('Error querying database:', err);
        return;
    }
    console.log('Greeting:', row.message);
});

// 데이터베이스 연결 종료
db.close();
