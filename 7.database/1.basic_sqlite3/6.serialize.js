const sqlite3 = require('sqlite3').verbose();

// 메모리 내 SQLite3 데이터베이스 생성
const db = new sqlite3.Database(':memory:');

// db.serialize()를 사용하면 각 작업이 순서대로 실행되며, 이전 작업이 완료될 때까지 다음 작업이 대기합니다.
// 즉, serialize 블록 안에서 작성한 쿼리들은 직렬화되어 하나의 작업이 완료된 후에 다음 작업이 실행됩니다.
db.serialize(() => {
    // 테이블 생성
    db.run('CREATE TABLE users (id INT, name TEXT)');
    
    // 데이터 삽입
    db.run('INSERT INTO users (id, name) VALUES (1, "Alice")');
    db.run('INSERT INTO users (id, name) VALUES (2, "Bob")');

    // 데이터 조회
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('조회된 데이터:', rows); // 조회된 데이터 출력
    });
});

// 데이터베이스 종료
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('데이터베이스 연결이 종료되었습니다.');
});
