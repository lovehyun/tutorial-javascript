const fs = require('fs');

// 비동기적으로 파일 읽기
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const numbers = data.split('\n').map(Number);
    const sortedNumbers = numbers.sort((a, b) => a - b);

    console.log(sortedNumbers);
    console.log('비동기 작업 완료');
});

console.log('다음 작업');
