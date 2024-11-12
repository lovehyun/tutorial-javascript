// better-sqlite3는 verbose 옵션이 없습니다. better-sqlite3는 SQLite3의 강력한 바인딩을 제공하면서도 높은 성능을 유지하는 목적으로 만들어진 라이브러리입니다. 따라서 verbose와 같은 디버깅을 위한 추가 기능은 제공하지 않습니다.
// better-sqlite3는 동기적이며 프로미스를 지원하지 않습니다. 사용 방법은 다소 간단하고 직관적이며, 높은 성능을 제공하는 특징이 있습니다. 

const sqlite = require('better-sqlite3');

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = sqlite('mydatabase.db');

// 1. 테이블 생성
db.exec(`CREATE TABLE IF NOT EXISTS greetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT
)`);


// 2. 데이터 삽입
const insert = db.prepare('INSERT INTO greetings (message) VALUES (?)');
const insertResult = insert.run('Hello, Better-Sqlite3!');
console.log('Hello, Better-Sqlite3! added with ID:', insertResult.lastInsertRowid);


// 3. 데이터 조회
const select = db.prepare('SELECT * FROM greetings');
const greetings = select.all();
greetings.forEach((row) => {
    console.log('Greeting:', row.message);
});


// 데이터베이스 연결 종료
db.close();
