// npm install uuid    <-- 최신버전 v9 이상에서는 ESM전용 모듈임.
// npm install uuid@8

const { v4: uuidv4 } = require('uuid');

// Version 4 UUID 생성
const uuid = uuidv4();
console.log('생성된 UUID:', uuid);
