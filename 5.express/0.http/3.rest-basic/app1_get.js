// JSON데이터 전송(cmd) : curl -X POST 127.0.0.1:3000/user -H "Content-Type: application/json" -d "{\"name\":\"aaa\"}"
// JSON데이터 전송(bash): curl -X POST 127.0.0.1:3000/user -H 'Content-Type: application/json' -d '{"name":"aaa"}'
// PlainText 전송: curl -X POST 127.0.0.1:3000/user -H "Content-Type: text/plain" -d "name=aaa"

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);

        // Step1. 기본 경로
        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile('./index.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else if (req.url === '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(data);
            } else if (req.url === '/user') { // Step6. user 요청 처리 로직 완성
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end(JSON.stringify(users));
            } else if (req.url.startsWith('/image/')) {
                // Step2. 이미지 처리
                const imageName = req.url.split('/image/')[1];
                const imagePath = path.join(__dirname, 'static', imageName);
                const imageData = await fs.readFile(imagePath);
                res.writeHead(200, { 'Content-Type': 'image/jpg' });

                // const contentType = getContentType(imagePath);
                // res.writeHead(200, { 'Content-Type': contentType });

                return res.end(imageData);                
            } else {
                // Step3. 또는, 동적 이미지 요청 핸들링
                const imageMatch = req.url.match(/^\/image\/(.+)$/);
                if (imageMatch) {
                    const imageName = imageMatch[1];
                    const imagePath = path.join(__dirname, './static/', imageName);
                    try {
                        const imageData = await fs.readFile(imagePath);
                        console.log(imageData);
                        const contentType = getContentType(imagePath);
                        console.log(contentType);
                        res.writeHead(200, { 'Content-Type': contentType });
                        return res.end(imageData);
                    } catch (error) {
                        res.writeHead(404);
                        return res.end('Not Found');
                    }
                } else {
                    res.writeHead(404);
                    return res.end('Not Found');
                }
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
