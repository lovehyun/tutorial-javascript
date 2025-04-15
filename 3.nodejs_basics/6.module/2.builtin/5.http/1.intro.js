const http = require('http');

const server = http.createServer();

server.on('connection', function() { // TCP 연결 호출 시
    console.log('TCP 연결 요청이 시작 되었습니다.');
});

server.on('request', function() { // HTTP 연결시
    console.log('HTTP 요청이 왔습니다.');
});

console.log('The Start');
server.listen(3000); // 서버가 시작.. 대기...
console.log('The End');
