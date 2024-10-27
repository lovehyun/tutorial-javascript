const fs = require('fs');

// 동기적으로 파일 읽기
try {
    const data = fs.readFileSync('file.txt', 'utf8');
    const numbers = data.split('\n').map(Number);
    // const sortedNumbers = numbers.sort(); // 문자열 소팅
    const sortedNumbers = numbers.sort((a, b) => a - b); // 숫자 소팅

    console.log(sortedNumbers);
    console.log('동기 작업 완료');
} catch (err) {
    console.error(err);
}

console.log('다음 작업');
