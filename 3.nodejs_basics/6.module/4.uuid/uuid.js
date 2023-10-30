// npm install uuid

const { v4: uuidv4 } = require('uuid');

// Version 4 UUID 생성
const uuid = uuidv4();
console.log('생성된 UUID:', uuid);
