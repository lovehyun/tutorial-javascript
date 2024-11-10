// const sqlite3 = require('sqlite3')
const sqlite3 = require('sqlite3').verbose();

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = new sqlite3.Database('simple.db');

// 테이블 생성 및 데이터 삽입
db.run('CREATE TABLE IF NOT EXISTS messages (text TEXT)');
db.run('INSERT INTO messages (text) VALUES (?)', ['Hello, SQLite!']);

// 데이터 조회
db.each('SELECT * FROM messages', (err, row) => {
    if (err) throw err;
    console.log(row.text); // "Hello, SQLite!"
});

// 데이터베이스 연결 종료
db.close();
