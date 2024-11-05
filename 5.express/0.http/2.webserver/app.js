const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile('./index.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else if (req.url === '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else {
                res.writeHead(404);
                return res.end('Not Found');
            }
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
    }
});

server.listen(3000, () => {
    console.log('3000 포트에서 서버 대기 중입니다.');
});
