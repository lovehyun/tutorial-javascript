const fs = require('fs/promises');

async function readFileAsync(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

// 예제: 파일을 읽고 내용을 콘솔에 출력
readFileAsync('file.txt');
