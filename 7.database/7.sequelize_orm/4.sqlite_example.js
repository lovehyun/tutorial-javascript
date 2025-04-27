// npm install sqlite3
const sqlite3 = require('sqlite3').verbose();

// 1. 데이터베이스 연결
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // 2. 테이블 초기화
    db.run('DROP TABLE IF EXISTS User');
    db.run(`
        CREATE TABLE User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            age INTEGER
        )
    `, (err) => {
        if (err) throw err;
        console.log('User 테이블이 생성되었습니다.');

        // 3. 데이터 삽입
        const insertStmt = db.prepare('INSERT INTO User (name, email, age) VALUES (?, ?, ?)');
        insertStmt.run('Alice', 'alice@example.com', 25);
        insertStmt.run('Bob', 'bob@example.com', 30);
        insertStmt.finalize(() => {
            console.log('Alice와 Bob이 삽입되었습니다.');

            // 4. 데이터 조회
            db.all('SELECT * FROM User', (err, rows) => {
                if (err) throw err;
                console.log('모든 사용자:', rows);

                // 5. 데이터 업데이트 (Alice 나이 변경)
                db.run('UPDATE User SET age = ? WHERE name = ?', [26, 'Alice'], function (err) {
                    if (err) throw err;
                    console.log('Alice의 나이가 업데이트되었습니다.');

                    // 6. 데이터 삭제 (Bob 삭제)
                    db.run('DELETE FROM User WHERE name = ?', ['Bob'], function (err) {
                        if (err) throw err;
                        console.log('Bob이 삭제되었습니다.');

                        // 7. 마지막으로 DB 닫기
                        db.close();
                    });
                });
            });
        });
    });
});
