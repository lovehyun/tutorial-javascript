const mysql = require('mysql2');

// MySQL 연결 정보를 설정합니다.
const db = mysql.createConnection({
    host: 'localhost',
    user: '사용자명',
    password: '비밀번호',
    database: '데이터베이스명',
});

// 연결
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류: ', err);
        throw err;
    }
    console.log('MySQL과 성공적으로 연결되었습니다.');
});

// 1. CREATE (INSERT)
const newUser = { username: 'user1', email: 'user1@example.com' };
db.query('INSERT INTO users SET ?', newUser, (err, results) => {
    if (err) {
        console.error('INSERT 쿼리 오류: ', err);
        throw err;
    }
    console.log('새로운 사용자가 추가되었습니다.', results.insertId);
});

// 2. READ (SELECT)
db.query('SELECT * FROM users', (err, results) => {
    if (err) {
        console.error('SELECT 쿼리 오류: ', err);
        throw err;
    }
    console.log('사용자 목록: ', results);
});

// 3. UPDATE
const updatedUser = { email: 'user001@example.com' };
db.query('UPDATE users SET ? WHERE username = ?', [updatedUser, 'user1'], (err, results) => {
    if (err) {
        console.error('UPDATE 쿼리 오류: ', err);
        throw err;
    }
    console.log('사용자 정보가 업데이트되었습니다.', results.changedRows);
});

// 4. DELETE
db.query('DELETE FROM users WHERE username = ?', ['user1'], (err, results) => {
    if (err) {
        console.error('DELETE 쿼리 오류: ', err);
        throw err;
    }
    console.log('사용자가 삭제되었습니다.', results.affectedRows);
});

// 연결 종료
db.end((err) => {
    if (err) {
        console.error('MySQL 연결 종료 오류: ', err);
        throw err;
    }
    console.log('MySQL 연결이 성공적으로 종료되었습니다.');
});
