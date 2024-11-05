// application/json 전송(cmd) : curl -X POST 127.0.0.1:3000/user -H "Content-Type: application/json" -d "{\"name\":\"aaa\"}"
// application/json 전송(bash): curl -X POST 127.0.0.1:3000/user -H 'Content-Type: application/json' -d '{"name":"aaa"}'
// text/plain 전송: curl -X POST 127.0.0.1:3000/user -H "Content-Type: text/plain" -d "name=aaa"

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {};

const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);

    try {
        if (req.method === 'GET') {
            handleGetRequest(req, res);
        } else if (req.method === 'POST') {
            handlePostRequest(req, res);
        } else if (req.method === 'PUT') {
            handlePutRequest(req, res);
        } else if (req.method === 'DELETE') {
            handleDeleteRequest(req, res);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('서버 내부 오류');
    }
});

server.listen(3000, () => {
    console.log('3000 포트에서 서버 대기 중입니다.');
});

// GET 요청 처리 함수
async function handleGetRequest(req, res) {
    try {
        if (req.url === '/') {
            const data = await fs.readFile('./index.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } else if (req.url === '/about') {
            const data = await fs.readFile('./about.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } else if (req.url.startsWith('/static/') || req.url.startsWith('/image/')) {
            const urlPath = req.url.startsWith('/static/') ? req.url : req.url.replace('/image/', './static/');
            const filePath = path.join(__dirname, urlPath);
            try {
                const data = await fs.readFile(filePath);
                res.writeHead(200, { 'Content-Type': getContentType(filePath) });
                res.end(data);
            } catch {
                res.writeHead(404);
                res.end('Not Found');
            }
        } else if (req.url === '/user') {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(users));
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('서버 내부 오류');
    }
}

// POST 요청 처리 함수 (사용자 추가)
function handlePostRequest(req, res) {
    if (req.url === '/user') {
        let body = '';
        req.on('data', (data) => (body += data));
        req.on('end', () => {
            try {
                if (req.headers['content-type'] === 'application/json') {
                    const parsedData = JSON.parse(body);
                    const username = parsedData.name;
                    if (username && !users[username]) {
                        users[username] = username; // 사용자 추가
                        res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`${username} 등록 성공`);
                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('유효하지 않거나 이미 존재하는 사용자입니다.');
                    }
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('지원되지 않는 Content-Type입니다.');
                }
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('서버 내부 오류');
            }
        });
    }
}

// PUT 요청 처리 함수 (사용자 업데이트)
function handlePutRequest(req, res) {
    if (req.url.startsWith('/user/')) {
        const key = req.url.split('/')[2];
        let body = '';
        req.on('data', (data) => (body += data));
        req.on('end', () => {
            try {
                if (users[key]) {
                    const parsedData = JSON.parse(body);
                    users[key] = parsedData.name || users[key];
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(users));
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('사용자를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('서버 내부 오류');
            }
        });
    }
}

// DELETE 요청 처리 함수 (사용자 삭제)
function handleDeleteRequest(req, res) {
    if (req.url.startsWith('/user/')) {
        const username = path.basename(req.url);
        if (username && users[username]) {
            delete users[username];
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`${username} 삭제 성공`);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('사용자를 찾을 수 없습니다.');
        }
    }
}

// 확장자에 따른 Content-Type 반환 함수
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html; charset=utf-8';
        case '.js':
            return 'application/javascript; charset=utf-8';
        case '.jpg':
            return 'image/jpg';
        default:
            return 'application/octet-stream';
    }
}
