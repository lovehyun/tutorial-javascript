const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {};

http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        
        // 정적 파일 요청 처리
        if (req.method === 'GET' && req.url.startsWith('/static/')) {
            const filePath = path.join(__dirname, req.url);
            const data = await fs.readFile(filePath);
            const contentType = getContentType(filePath);
            
            res.writeHead(200, { 'Content-Type': contentType });
            return res.end(data);
        }

        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile('./index.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else if (req.url === '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else if (req.url === '/user') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(JSON.stringify(users));
            }
        } else if (req.method === 'POST') {
            if (req.url === '/user') {
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('POST Body: ', body);
                    const { name } = JSON.parse(body);
                    const id = Date.now();
                    users[id] = name;
                    res.writeHead(201);
                    res.end('등록 성공');
                });
            }
        } else if (req.method === 'PUT') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT Body: ', body);
                    users[key] = JSON.parse(body).name;
                    return res.end(JSON.stringify(users));
                });
            }
        } else if (req.method === 'DELETE') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }

        res.writeHead(404);
        return res.end('Not Found');
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
    }
})
    .listen(8080, () => {
        console.log('8080포트에서 서버 대기 중입니다.');
    });

// 확장자에 따른 Content-Type 반환 함수
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html; charset=utf-8';
        case '.js':
            return 'application/javascript; charset=utf-8';
        default:
            return 'application/octet-stream';
    }
}
