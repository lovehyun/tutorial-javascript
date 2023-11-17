const sqlite = require('better-sqlite3');

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = sqlite('mydatabase.db');

// 테이블 생성
db.exec(`
    CREATE TABLE IF NOT EXISTS greetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT
    )
`);

// 데이터 삽입
const insert = db.prepare('INSERT INTO greetings (message) VALUES (?)');
const insertResult = insert.run('Hello, Better-Sqlite3!');
console.log('Hello, Better-Sqlite3! added with ID:', insertResult.lastInsertRowid);

// 데이터 조회
const select = db.prepare('SELECT * FROM greetings');
const greetings = select.all();
greetings.forEach((row) => {
    console.log('Greeting:', row.message);
});

// 데이터베이스 연결 종료
db.close();
