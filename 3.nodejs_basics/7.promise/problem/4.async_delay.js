const fs = require('fs');

// 비동기적으로 파일 읽기를 지연시키는 함수
const delayedReadFile = (filename, callback) => {
    setTimeout(() => {
        fs.readFile(filename, 'utf8', callback);
    }, 1000); // 1초 지연
};

// delayedReadFile 함수를 사용하여 파일 읽기
delayedReadFile('file.txt', (err, data) => {
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
