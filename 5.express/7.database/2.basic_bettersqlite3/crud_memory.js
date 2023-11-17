const sqlite = require('better-sqlite3');

// 메모리 내에서 데이터베이스 연결
const db = sqlite(':memory:');
// const db = sqlite(':memory:', { verbose: console.log });

// 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT
    )
`);

// 샘플 데이터 추가
const insertSampleData = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
insertSampleData.run('john_doe', 'john.doe@example.com');
insertSampleData.run('jane_doe', 'jane.doe@example.com');

// 모든 사용자 조회
const allUsers = db.prepare('SELECT * FROM users').all();
console.log('All Users:', allUsers);

// 새로운 사용자 생성
const newUser = {
    username: 'bob_smith',
    email: 'bob.smith@example.com',
};
const insert = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
const insertResult = insert.run(newUser.username, newUser.email);
console.log('User added with ID:', insertResult.lastInsertRowid);

// 사용자 정보 업데이트
const updateUser = {
    id: 1,
    username: 'updated_user',
    email: 'updated.user@example.com',
};
const update = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
update.run(updateUser.username, updateUser.email, updateUser.id);
console.log('User updated successfully');

// 사용자 삭제
const deleteUser = {
    id: 2,
};
const deleteQuery = db.prepare('DELETE FROM users WHERE id = ?');
deleteQuery.run(deleteUser.id);
console.log('User deleted successfully');

// 데이터베이스 연결 종료 (메모리 데이터베이스는 프로그램 종료 시 자동으로 삭제됨)
// 따라서 명시적인 close 호출은 선택사항입니다.
db.close();
