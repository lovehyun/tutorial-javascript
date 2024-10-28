const fs = require('fs');
const path = require('path');

const directoryPath = "../";

function listFilesRecursively(directory, prefix='') {

    const files = fs.readdirSync(directory); // 동기 방식으로 디렉토리 읽기
    const lastIndex = files.length - 1; // 마지막 파일을 구분하기 위한 변수

    files.forEach((file, index) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath); // 동기 방식으로 파일의 상태 확인
        const isLast = index === lastIndex; // 마지막 파일인지 확인
        const baseName = path.basename(filePath);

        if (stats.isDirectory()) {
            console.log(`${prefix}${isLast ? '└── ' : '├── '}${baseName}`);
            listFilesRecursively(filePath, prefix + (isLast ? '    ' : '│   '));
        } else {
            console.log(`${prefix}${isLast ? '└── ' : '├── '}${baseName}`);
        }
    });
}

listFilesRecursively(directoryPath);
