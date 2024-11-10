const database = require('./8.include_db');

async function main() {
    try {
        await database.createTable();
        await database.insertUser();
        await database.updateUser();
        await database.readUser();
        await database.deleteUser();
    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        // 데이터베이스 연결 종료
        database.closeDatabase();
    }
}

main();
