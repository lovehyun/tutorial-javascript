const fs = require('fs/promises');

function readFileAsync(filePath) {
    return fs.readFile(filePath, 'utf-8');
}

// 예제: 파일을 읽고 내용을 콘솔에 출력
readFileAsync('file.txt')
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });
