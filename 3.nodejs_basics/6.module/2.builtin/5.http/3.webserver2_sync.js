const fs = require('fs');
const http = require('http');

// 서버 시작 시 index.html 파일을 읽어서 변수에 저장
let indexHtml = '';
try {
    indexHtml = fs.readFileSync('index.html', 'utf-8');
    console.log('index.html 파일이 성공적으로 로드되었습니다.');
} catch (err) {
    console.error('index.html 파일을 읽는 데 실패했습니다:', err);
    indexHtml = '<h1>오류: index.html 파일을 찾을 수 없습니다.</h1>';
}

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    // 클라이언트 IP 주소 출력
    const ip = req.socket.remoteAddress;
    console.log(`요청이 들어옴 - IP 주소: ${ip}`);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(indexHtml);
});

// 서버 포트 설정 및 실행
const port = 3000;
server.listen(port, () => {
    console.log(`서버가 http://localhost:${port}/ 에서 실행 중입니다.`);
});
