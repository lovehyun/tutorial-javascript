const sqlite = require('better-sqlite3');

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = sqlite('mydatabase.db');

// 1. 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT
)`);


// 2. 모든 사용자 조회
// const allUsers = db.prepare('SELECT * FROM users').all();
// console.log('All Users:', allUsers);
const allUsers = db.prepare('SELECT * FROM users');
const allUsersResult = allUsers.all();
console.log('All Users:', allUsersResult);


// 3. 새로운 사용자 생성
const newUser = {
    username: 'user1',
    email: 'user1@example.com',
};

const insert = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
const insertResult = insert.run(newUser.username, newUser.email);
console.log('User added with ID:', insertResult.lastInsertRowid);


// 4. 특정 사용자 조회
const userId = 1;
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
console.log('User with ID', userId, ':', user);


// 5. 사용자 정보 업데이트
const updateUser = {
    id: 1,
    username: 'user001',
    email: 'user001@example.com',
};

const update = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
update.run(updateUser.username, updateUser.email, updateUser.id);
console.log('User updated successfully');


// 6. 사용자 삭제
const deleteUser = {
    id: 2,
};

const deleteQuery = db.prepare('DELETE FROM users WHERE id = ?');
deleteQuery.run(deleteUser.id);
console.log('User deleted successfully');


// 데이터베이스 연결 종료
db.close();
