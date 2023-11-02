const fs = require('fs');
const path = require('path');

const directoryPath = "../";

function listFilesRecursively(directory, prefix) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log('읽기 오류', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log('읽기 오류', err);
                    return;
                }

                if (stats.isDirectory()) {
                    console.log(prefix + '  ', filePath);
                    listFilesRecursively(filePath, prefix + '  '); // 디렉토리일 경우 재귀적으로 다시 호출
                } else {
                    console.log(prefix + '  ', filePath);
                }
            });
        });
    });
}

listFilesRecursively(directoryPath, '');
