// 모듈을 로딩합니다.
var http = require('http');

// server 객체를 생성합니다.
var server = http.createServer();

// server 객체에 이벤트를 연결합니다.
// 클라이언트가 서버에 연결될 때
server.on('connection', function(code) {
	console.log('Connection On');
});

// 서버에 요청이 들어올때
server.on('request', function(code) {
	console.log('Request On');
});

// 서버가 종료될 때
server.on('close', function(code) {
	console.log('Close On');
});

// listen() 메서드를 실행합니다.
server.listen(3000);
