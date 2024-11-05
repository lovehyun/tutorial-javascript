const http = require('http');
const fs = require('fs');

// fs.readFile을 Promise로 감싸는 함수
function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err); // 에러 발생 시 reject 호출
            } else {
                resolve(data); // 성공 시 resolve 호출
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    try {
        const data = await readFilePromise('./index.html'); // Promise로 감싼 readFile 호출
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
    }
});

server.listen(3000, () => {
    console.log('3000 포트에서 서버 대기 중입니다.');
});
