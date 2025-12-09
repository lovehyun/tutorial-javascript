const fs = require('fs');
const http = require('http');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    // 클라이언트 IP 주소 출력
    const ip = req.socket.remoteAddress;
    console.log(`요청이 들어옴 - IP 주소: ${ip}`);

    // 요청이 들어올 때마다 index.html을 비동기 방식으로 읽기
    fs.readFile('index.html', 'utf-8', (err, data) => {
        if (err) {
            console.error('index.html 파일을 읽는 데 실패했습니다:', err);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>오류: index.html 파일을 읽을 수 없습니다.</h1>');
            return;
        }

        // 정상적으로 읽었을 때 응답
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
});

// 서버 포트 설정 및 실행
const port = 3000;
server.listen(port, () => {
    console.log(`서버가 http://localhost:${port}/ 에서 실행 중입니다.`);
});
