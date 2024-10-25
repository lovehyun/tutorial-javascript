const fs = require('fs');
const path = require('path');

const directoryPath = "../";

function listFilesRecursively(directory, prefix) {

    const files = fs.readdirSync(directory); // 동기 방식으로 디렉토리 읽기

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath); // 동기 방식으로 파일의 상태 확인

        if (stats.isDirectory()) {
            console.log(prefix + '-+', filePath);
            listFilesRecursively(filePath, prefix + '  '); // 디렉토리일 경우 재귀적으로 다시 호출
        } else {
            console.log(prefix + '\\--', filePath);
        }
    });
}

listFilesRecursively(directoryPath, '+');
