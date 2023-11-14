// cmd: curl -X POST 127.0.0.1:8080/user -H "Content-Type: application/json" -d "{\"name\":\"aaa\"}"
// bash: curl -X POST 127.0.0.1:8080/user -H 'Content-Type: application/json' -d '{"name":"aaa"}'


const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// 객체 디스트럭처링
const { parse } = require('querystring');
// const parse = require('querystring').parse;
// 또는
// const querystring = require('querystring');
// const parse = querystring.parse;


const users = {};

http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        
        // Step3. 정적 파일 요청 처리
        if (req.method === 'GET' && req.url.startsWith('/static/')) {
            const filePath = path.join(__dirname, req.url);
            const data = await fs.readFile(filePath);
            const contentType = getContentType(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            return res.end(data);
        }

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
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(JSON.stringify(users));
            } else if (req.url === '/image') {
                const data = await fs.readFile('./static/cats.jpg');
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                return res.end(data);
            } else {
                 // Step4. 동적 이미지 요청 핸들링
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
                }
            }
        // Step2. 기본 CRUD 백엔드 완성
        } else if (req.method === 'POST') {
            // Step5. 상세 CRUD 요청 처리 로직 완성
            if (req.url === '/user') {
                let body = '';

                req.on('data', (data) => {
                    body += data;
                });

                req.on('end', async () => {
                    const formData = parse(body);
                    console.log('Received form data:', formData);

                    const username = formData.name;
                    users[username] = username;
                });
                res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('등록 성공');
            }   
        } else if (req.method === 'PUT') {
            if (req.url.startsWith('/user/')) {
                
            }
        } else if (req.method === 'DELETE') {
            if (req.url.startsWith('/user/')) {
                
            }
        } else {
            res.writeHead(404);
            return res.end('Not Found');
        }
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
        case '.jpg':
            return 'image/jpg';
        default:
            return 'application/octet-stream';
    }
}
