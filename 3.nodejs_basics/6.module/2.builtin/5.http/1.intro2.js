const http = require('http');

const server = http.createServer();

server.on('connection', function() { // TCP 연결 호출 시
    console.log('TCP 연결 요청이 시작 되었습니다.');
});

server.on('request', function() { // HTTP 연결시
    console.log('HTTP 요청이 왔습니다.');
});

// server.on('request', function(req, res) {
//     console.log('요청이 왔습니다.');
//     res.writeHead(200, { 'Content-Type': 'text/plain' }); // 응답 헤더 설정
//     res.end('Hello, World!'); // 응답 본문 전송
// });

server.on('listening', function() { // 서버 소켓 준비가 완료 되었을때 (콜백 대신 사용시)
    console.log('대기하고 있습니다.');
});

server.on('close', function() { // 서버 종료시
    console.log('서버가 종료됩니다.');
});

console.log('The Start');
server.listen(3000); // 서버가 시작.. 대기...
console.log('The End');

// server.close();
