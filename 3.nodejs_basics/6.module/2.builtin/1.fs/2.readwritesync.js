// https://nodejs.org/docs/latest-v18.x/api/
// https://nodejs.org/docs/latest-v18.x/api/fs.html
const fs = require('fs');

// 파일 읽기
const data = fs.readFileSync('example.txt', 'utf8');


// 파일 쓰기
const content = '이것은 파일에 쓰여질 내용입니다.';
fs.writeFileSync('newFile.txt', content);
console.log('파일쓰기 성공');
