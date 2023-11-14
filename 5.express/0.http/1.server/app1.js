// 서버를 생성합니다.
var server = require('http').createServer();
var readline = require('readline');

// 서버를 실행합니다.
server.listen(3000, function() {
	console.log('Server Running at http://127.0.0.1:5555');
});


// ------------------------------------
// 10초 후 함수를 실행합니다.
var test = function() {
	// 서버를 종료합니다.
	server.close();
};

setTimeout(test, 10000);
// ------------------------------------


// ------------------------------------
// 키보드 입력을 처리할 인터페이스를 생성합니다.
// var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// 사용자가 'q'를 입력하면 서버를 종료합니다.
// rl.on('line', function (input) {
//     if (input.toLowerCase() === 'q') {
//         console.log('서버를 종료합니다.');
//         server.close();
//         rl.close(); // readline 인터페이스도 닫아줍니다.
//     }
// });
// ------------------------------------
