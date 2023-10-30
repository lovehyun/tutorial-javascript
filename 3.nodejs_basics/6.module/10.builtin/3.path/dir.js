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
    });
});
