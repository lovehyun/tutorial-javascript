const fs = require('fs');

// 'example.txt' 파일을 읽기 스트림으로 열기 (utf8 인코딩으로 설정)
const readStream = fs.createReadStream('example.txt', { encoding: 'utf8' });

// 'output.txt' 파일을 쓰기 스트림으로 열기
const writeStream = fs.createWriteStream('output.txt');

let lineNumber = 1;
let leftover = ''; // 줄이 완전히 끝나지 않은 조각을 임시로 저장할 변수

readStream.on('data', (chunk) => {
    // 읽은 데이터를 줄 단위로 나누기 위해 줄바꿈 기준으로 split
    let lines = chunk.split('\n');

    // 만약 이전 데이터에서 남은 줄이 있으면 첫 번째 줄과 결합
    lines[0] = leftover + lines[0];

    // 마지막 줄이 완성되지 않을 수 있으므로 그 줄을 저장
    leftover = lines.pop();

    // 각 줄 앞에 줄번호를 추가하고 쓰기 스트림에 씀
    lines.forEach((line) => {
        writeStream.write(`${lineNumber++}: ${line}\n`);
    });
});

// 스트림이 끝나면 마지막 남은 줄을 처리
readStream.on('end', () => {
    if (leftover) {
        writeStream.write(`${lineNumber++}: ${leftover}\n`);
    }
    console.log('Finished writing to output.txt with line numbers.');
});

readStream.on('error', (err) => {
    console.error('Error reading file:', err);
});

writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
});
