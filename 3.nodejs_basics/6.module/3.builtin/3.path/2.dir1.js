const fs = require('fs');
const path = require('path');

const directoryPath = './'; // 현재 디렉토리

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('디렉토리 읽기 오류:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        console.log('파일:', filePath);
        checkFile(filePath);
        // checkFileSync(filePath);
    });
});


// 파일 유형 확인 - 비동기
function checkFile(filePath) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error(err);
            return;
        }

        if (stats.isFile()) {
            console.log('이것은 파일입니다.');
        } else if (stats.isDirectory()) {
            console.log('이것은 디렉토리입니다.');
        } else {
            console.log('이것은 다른 유형의 파일입니다.');
        }
    });
}

// 파일 유형 확인 - 동기
function checkFileSync(filePath) {
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
        console.log('이것은 파일입니다.');
    } else if (stats.isDirectory()) {
        console.log('이것은 디렉토리입니다.');
    } else {
        console.log('이것은 다른 유형의 파일입니다.');
    }
}
