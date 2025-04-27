// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',   // SQLite 파일 위치 (주의. 상대경로는 이 파일 기준이 아니라, 실행하는 app.js 기준)
    logging: false,             // SQL 쿼리 로그 끄기 (true 하면 개발용으로 확인 가능)
});

// 연결 테스트
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ 데이터베이스 연결 성공');
    } catch (error) {
        console.error('❌ 데이터베이스 연결 실패:', error.message);
    }
}

// 테스트 즉시 실행
// testConnection();

module.exports = { 
    sequelize, 
    testConnection 
};
