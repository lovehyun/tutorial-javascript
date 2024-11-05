const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    fs.readFile('./index.html', (err, data) => { // 콜백 기반 처리
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        }
    });
});

server.listen(3000, () => {
    console.log('3000 포트에서 서버 대기 중입니다.');
});
