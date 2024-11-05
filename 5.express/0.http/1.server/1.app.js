// 모듈을 로딩합니다.
const http = require('http');

// server 객체를 생성합니다.
const server = http.createServer();

// 1. server 객체에 이벤트를 연결합니다.
// 클라이언트가 서버에 연결될 때
server.on('connection', function() {
	console.log('Connection On');
});

// 1-2. 클라이언트가 서버에 연결될 때
// server.on('connection', function(socket) {
// 	console.log('Connection On');
    
//     // 소켓의 close 이벤트를 통해 접속 종료를 감지합니다.
//     socket.on('close', function() {
//         console.log('Client Disconnected');
//     });
// });

// 2. 서버에 요청이 들어올때
server.on('request', function() {
	console.log('Request On');
});

// 3. 서버가 종료될 때
server.on('close', function() {
	console.log('Close On');
});

// listen() 메서드를 실행합니다.
// server.listen(3000);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
