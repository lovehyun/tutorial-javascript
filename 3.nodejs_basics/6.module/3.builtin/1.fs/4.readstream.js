const fs = require('fs');

const readStream = fs.createReadStream('example.txt', { encoding: 'utf8' });

// const readStream = fs.createReadStream('example.txt', { highWaterMark: 16 * 1024 }); // 16KB씩 읽기
// highWaterMark: 한 번에 읽어올 데이터 크기. 이 예제에서는 16KB씩 데이터를 읽어오도록 설정. 기본값은 64KB입니다.

readStream.on('data', (chunk) => {
    console.log('New chunk:', chunk);  // 파일의 데이터 조각을 출력
});

readStream.on('end', () => {
    console.log('File read completed.');  // 파일을 모두 읽었을 때 출력
});

readStream.on('error', (err) => {
    console.error('Error reading file:', err);  // 파일 읽기 중 오류가 발생하면 출력
});
