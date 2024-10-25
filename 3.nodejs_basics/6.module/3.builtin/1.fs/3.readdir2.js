const fs = require('fs');
const path = require('path');

const directoryPath = "../";

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('읽기 오류', err);
        return;
    }

    // console.log(files);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        console.log('파일: ', filePath);
        checkFileSync(filePath);
    })
});

function checkFile(filePath) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error(err);
            return;
        }
    
        // isFile() 및 isDirectory() 함수를 사용하여 파일 또는 디렉토리를 확인합니다.
        if (stats.isFile()) {
            console.log('이것은 파일입니다.');
        } else if (stats.isDirectory()) {
            console.log('이것은 디렉토리입니다.');
        } else {
            console.log('파일도 디렉토리도 아닙니다.');
        }
    });
}

function checkFileSync(filePath) {
    const stats = fs.statSync(filePath);
    
    // isFile() 및 isDirectory() 함수를 사용하여 파일 또는 디렉토리를 확인합니다.
    if (stats.isFile()) {
        console.log('이것은 파일입니다.');
    } else if (stats.isDirectory()) {
        console.log('이것은 디렉토리입니다.');
    } else {
        console.log('파일도 디렉토리도 아닙니다.');
    }
}
