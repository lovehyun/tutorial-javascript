// 서버를 생성합니다.
const server = require('http').createServer();
const readline = require('readline');

// 서버를 실행합니다.
server.listen(3000, function() {
	console.log('Server Running at http://127.0.0.1:5555');
});

// 서버를 종료합니다.
server.on('close', function() {
	console.log('서버를 종료합니다');
});


// ------------------------------------
// 10초 후 함수를 실행합니다.
const timer = setTimeout(function() {
    console.log('10초가 지나 서버를 자동으로 종료합니다.');
    server.close();
}, 10000);
// ------------------------------------


// ------------------------------------
// 키보드 입력을 처리할 인터페이스를 생성합니다.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 사용자가 'q'를 입력하면 서버를 종료합니다.
rl.on('line', function (input) {
    if (input.toLowerCase() === 'q') {
        console.log('서버 종료를 시작(?)합니다.');

        // 타이머가 설정되어 있다면 지웁니다.
        clearTimeout(timer);

        // 서버와 readline 인터페이스를 종료합니다.
        server.close();
        rl.close(); // readline 인터페이스도 닫아줍니다.
    }
});
// ------------------------------------
