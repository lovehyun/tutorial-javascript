// curl --cookie-jar cookie.txt http://localhost:3000/
// curl --cookie cookie.txt http://localhost:3000/

const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, {'Set-Cookie': 'mycookie=test'});
    res.end('Hello Cookie');
});

server.listen(3000, () => {
    console.log('서버가 대기중입니다.');
});
