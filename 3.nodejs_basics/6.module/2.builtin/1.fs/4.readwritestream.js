const fs = require('fs');

// 'example.txt' 파일을 읽기 스트림으로 열고, 'utf8' 인코딩으로 설정
const readStream = fs.createReadStream('example.txt', { encoding: 'utf8' });

// 'output.txt' 파일을 쓰기 스트림으로 엽니다.
const writeStream = fs.createWriteStream('output.txt');

// 읽기 스트림에서 데이터를 읽고 쓰기 스트림으로 파이핑합니다.
readStream.pipe(writeStream);

// 스트림 이벤트 설정
readStream.on('data', (chunk) => {
    console.log('Chunk read:', chunk);  // 읽은 데이터 조각(chunk)을 출력
});

readStream.on('end', () => {
    console.log('Finished reading file.');
});

writeStream.on('finish', () => {
    console.log('Finished writing to output.txt');
});

readStream.on('error', (err) => {
    console.error('Error reading file:', err);
});

writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
});
