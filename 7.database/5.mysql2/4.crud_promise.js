const mysql = require('mysql2/promise');

// MySQL 연결 정보를 설정합니다.
const dbConfig = {
    host: 'localhost',
    user: '사용자명',
    password: '비밀번호',
    database: '데이터베이스명',
};

// MySQL 데이터베이스 연결
async function connectToDatabase() {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
}

// 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
async function createTable(connection) {
    await connection.execute(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255)
    )`);
}

// 모든 사용자 조회
async function getAllUsers(connection) {
    const [rows] = await connection.execute('SELECT * FROM users');
    return rows;
}

// 특정 사용자 조회
async function getUserById(connection, userId) {
    const [row] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return row[0];
}

// 새로운 사용자 생성
async function insertUser(connection, newUser) {
    const [result] = await connection.execute('INSERT INTO users (username, email) VALUES (?, ?)', [
        newUser.username,
        newUser.email,
    ]);
    return result.insertId;
}

// 사용자 정보 업데이트
async function updateUser(connection, updateUser) {
    await connection.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [
        updateUser.username,
        updateUser.email,
        updateUser.id,
    ]);
}

// 사용자 삭제
async function deleteUser(connection, userId) {
    await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
}

// 메인 함수
async function main() {
    let connection;
    try {
        connection = await connectToDatabase();
        await createTable(connection);

        const allUsers = await getAllUsers(connection);
        console.log('All Users:', allUsers);

        const userId = 1;
        const userById = await getUserById(connection, userId);
        console.log('User with ID', userId, ':', userById);

        const newUser = {
            username: 'john_doe',
            email: 'john.doe@example.com',
        };
        const newUserId = await insertUser(connection, newUser);
        console.log('User added with ID:', newUserId);

        const updateUserDetails = {
            id: 1,
            username: 'updated_user',
            email: 'updated.user@example.com',
        };
        await updateUser(connection, updateUserDetails);
        console.log('User updated successfully');

        const deleteUserDetails = {
            id: 2,
        };
        await deleteUser(connection, deleteUserDetails.id);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            connection.end();
            console.log('Disconnected from MySQL database');
        }
    }
}

main();
