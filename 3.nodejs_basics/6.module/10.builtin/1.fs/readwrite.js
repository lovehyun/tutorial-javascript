// https://nodejs.org/docs/latest-v18.x/api/
// https://nodejs.org/docs/latest-v18.x/api/fs.html
const fs = require('fs');

// 파일 읽기
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('파일을 읽는 중 오류가 발생했습니다:', err);
        return;
    }
    console.log('파일 내용:', data);
});


// 파일 쓰기
const content = '이것은 파일에 쓰여질 내용입니다.';
fs.writeFile('newFile.txt', content, 'utf8', (err) => {
    if (err) {
        console.error('파일에 쓰는 중 오류가 발생했습니다:', err);
        return;
    }
    console.log('파일에 내용이 성공적으로 쓰여졌습니다.');
});


// 파일 복사
fs.copyFile('sourceFile.txt', 'destinationFile.txt', (err) => {
    if (err) {
        console.error('파일을 복사하는 중 오류가 발생했습니다:', err);
        return;
    }
    console.log('파일이 성공적으로 복사되었습니다.');
});
