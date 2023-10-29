const http = require('http');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('안녕, 이것은 HTTP 서버입니다!\n');
});

// 서버가 특정 포트에서 요청을 대기
const port = 3000;
server.listen(port, () => {
    console.log(`서버가 http://localhost:${port}/ 에서 실행 중입니다.`);
});
