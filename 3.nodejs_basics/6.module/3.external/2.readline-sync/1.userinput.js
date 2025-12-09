// readline-sync 설치
// npm install readline-sync

// 한글 이슈 해결
// 1. 터미널에서 해결
// chcp 65001  (터미널을 utf-8로 설정)
// node userinput.js


// readline-sync 모듈을 가져옴
const readlineSync = require('readline-sync');

// 사용자로부터 이름을 입력받기
const name = readlineSync.question('당신의 이름은 무엇인가요? ');
console.log(`안녕하세요, ${name}님!`);

// 사용자로부터 나이를 입력받기
const age = readlineSync.questionInt('당신의 나이는 몇 살인가요? ');
console.log(`당신은 ${age}살이군요.`);
