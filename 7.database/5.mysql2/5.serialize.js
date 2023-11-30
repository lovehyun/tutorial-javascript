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

// 테이블 생성 및 데이터 삽입 예제 - 트랜잭션 구간
async function performTransaction(connection) {
    try {
        // 트랜잭션 시작
        await connection.beginTransaction();

        // 테이블 생성 구문 실행
        await connection.execute('CREATE TABLE users (id INT, name TEXT)');

        // 파라미터화된 쿼리 사용
        const [insertResult] = await connection.execute('INSERT INTO users VALUES (?, ?)', [1, 'John Doe']);
        console.log('Inserted rows:', insertResult.affectedRows);

        const [insertResult2] = await connection.execute('INSERT INTO users VALUES (?, ?)', [2, 'Jane Doe']);
        console.log('Inserted rows:', insertResult2.affectedRows);

        // SELECT 쿼리 실행
        const [rows] = await connection.execute('SELECT id, name FROM users');
        console.log('조회 결과:');
        for (const row of rows) {
            console.log(row.id, row.name);
        }

        // SELECT 쿼리 실행
        const [allRows] = await connection.execute('SELECT * FROM users');
        console.log('전체 조회 결과:', allRows);

        // 커밋 - 트랜잭션 종료
        await connection.commit();
        console.log('Transaction committed successfully');
    } catch (error) {
        // 롤백
        await connection.rollback();
        console.error('Transaction rolled back due to an error:', error);
    }
}

// 메인 함수
async function main() {
    let connection;
    try {
        connection = await connectToDatabase();

        // 트랜잭션 수행
        await performTransaction(connection);

         // 트랜잭션 이후 결과 조회
         const [rows] = await connection.execute('SELECT id, name FROM users');
         console.log('조회 결과:', rows);
    } finally {
        if (connection) {
            connection.end();
            console.log('Disconnected from MySQL database');
        }
    }
}

main();
