const sqlite3 = require('sqlite3').verbose();

// 메모리 내에 SQLite3 데이터베이스를 만듭니다.
const db = new sqlite3.Database(':memory:');

// 테이블 생성 및 데이터 삽입 예제 - 트랜잭션 구간
db.serialize(() => {
    // 테이블 생성 구문 실행
    db.run('CREATE TABLE users (id INT, name TEXT)');

    // 파라미터화된 쿼리 사용
    const stmt = db.prepare('INSERT INTO users VALUES (?, ?)');
    stmt.run(1, 'user1'); // 사용자1
    stmt.run(2, 'user2'); // 사용자2
    stmt.finalize();

    // SELECT 쿼리 실행
    db.each('SELECT id, name FROM users', (err, row) => {
        console.log('조회:', row.id, row.name);
    });

    // SELECT 쿼리 실행
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('조회 결과:', rows);
        }
    });
});

// 데이터베이스 닫기
db.close();
