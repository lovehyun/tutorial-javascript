const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<H1>Hello Node!</H1>');
    res.end('<P>Hello Server1!</P>');
})
    .listen(8080, () => { // 서버 연결
        console.log('8080번 포트에서 버서 대기 중입니다.');
    });

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<H1>Hello Node!</H1>');
    res.end('<P>Hello Server2!</P>');
})
    .listen(8081, () => { // 서버 연결
        console.log('8081번 포트에서 버서 대기 중입니다.');
    });
