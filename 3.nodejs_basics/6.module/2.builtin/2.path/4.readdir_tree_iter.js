const fs = require('fs');
const path = require('path');

const directoryPath = "../";

function listFilesIteratively(directory) {
    const stack = [{ dir: directory, prefix: '+' }]; // 초기 디렉토리를 스택에 추가

    while (stack.length > 0) {
        const { dir, prefix } = stack.pop();
        const files = fs.readdirSync(dir); // 현재 디렉토리 읽기

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath); // 파일 상태 확인

            if (stats.isDirectory()) {
                console.log(prefix + '-+', filePath);
                stack.push({ dir: filePath, prefix: prefix + '  ' }); // 디렉토리인 경우 스택에 추가
            } else {
                console.log(prefix + '\\--', filePath);
            }
        });
    }
}

listFilesIteratively(directoryPath);
