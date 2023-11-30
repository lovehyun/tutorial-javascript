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

    // 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
    db.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255)
    )`);

    // 모든 사용자 조회
    db.query('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return;
        }
        console.log('All Users:', rows);
    });

    // 특정 사용자 조회
    const userId = 1;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return;
        }
        console.log('User with ID', userId, ':', rows[0]);
    });

    // 새로운 사용자 생성
    const newUser = {
        username: 'john_doe',
        email: 'john.doe@example.com',
    };

    db.query('INSERT INTO users (username, email) VALUES (?, ?)', [newUser.username, newUser.email], (err, results) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return;
        }
        console.log('User added with ID:', results.insertId);
    });

    // 사용자 정보 업데이트
    const updateUser = {
        id: 1,
        username: 'updated_user',
        email: 'updated.user@example.com',
    };

    db.query(
        'UPDATE users SET username = ?, email = ? WHERE id = ?',
        [updateUser.username, updateUser.email, updateUser.id],
        (err) => {
            if (err) {
                console.error('Error updating database:', err);
                return;
            }
            console.log('User updated successfully');
        }
    );

    // 사용자 삭제
    const deleteUser = {
        id: 2,
    };

    db.query('DELETE FROM users WHERE id = ?', [deleteUser.id], (err) => {
        if (err) {
            console.error('Error deleting from database:', err);
            return;
        }
        console.log('User deleted successfully');
    });

    // 데이터베이스 연결 종료
    db.end((err) => {
        if (err) {
            console.error('Error disconnecting from database:', err);
            return;
        }
        console.log('Disconnected from MySQL database');
    });
});
