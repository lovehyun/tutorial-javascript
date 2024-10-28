const fs = require('fs');
const path = require('path');

const directoryPath = "../";

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('읽기 오류', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        console.log('파일: ', filePath);
        checkFileSync(filePath);

        const stats = fs.statSync(filePath);

        // 첫 번째 레벨의 파일이 디렉토리일 경우, 내부 내용도 확인
        if (stats.isDirectory()) {
            const subFiles = fs.readdirSync(filePath); // 두 번째 레벨 디렉토리 동기 읽기

            subFiles.forEach(subFile => {
                const subFilePath = path.join(filePath, subFile);
                console.log('  하위 파일: ', subFilePath);
                checkFileSync(subFilePath);
            });
        }
    });
});

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
