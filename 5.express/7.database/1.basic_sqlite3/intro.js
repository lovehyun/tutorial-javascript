const sqlite3 = require('sqlite3').verbose();

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = new sqlite3.Database('mydatabase.db');

// 테이블 생성
db.run(`
    CREATE TABLE IF NOT EXISTS greetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT
    )
`);

// 데이터 삽입
db.run('INSERT INTO greetings (message) VALUES (?)', ['Hello, World!'], function (err) {
    if (err) {
        console.error('Error inserting into database:', err);
        return;
    }
    console.log('Hello, World! added with ID:', this.lastID);
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
