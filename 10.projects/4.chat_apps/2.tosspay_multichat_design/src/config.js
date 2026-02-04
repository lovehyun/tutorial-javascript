/**
 * 환경 변수 기반 설정 (.env 로드)
 */
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production', // 세션 암호화용
    toss: {
        secretKey: process.env.TOSS_SECRET_KEY, // 서버용 시크릿 키
        clientKey: process.env.TOSS_CLIENT_KEY,  // 프론트 결제창용
    },
    dbPath: process.env.DB_PATH || './data.db', // SQLite 파일 경로
};
