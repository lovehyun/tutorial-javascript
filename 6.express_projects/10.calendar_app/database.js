const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'calendar.db');

// DB 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ DB 연결 실패:', err.message);
    } else {
        console.log('✅ SQLite3 DB 연결 완료');
    }
});

// 테이블이 없으면 생성
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT
        )
    `);
});

module.exports = db;
