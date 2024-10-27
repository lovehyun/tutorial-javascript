const fs = require('fs');

// 동기적으로 파일 읽기
const data = fs.readFileSync('file.txt', 'utf8');
const lines = data.split('\n');
const sortedLines = lines.sort(); // 문자열 소팅

console.log(sortedLines);
console.log('동기 작업 완료');
