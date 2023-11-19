// app.js

// dotenv를 사용하여 .env 파일 로드
require('dotenv').config();

// 환경 변수 출력
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
