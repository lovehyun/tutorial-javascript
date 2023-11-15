// JSON데이터 전송(cmd) : curl -X POST 127.0.0.1:8080/user -H "Content-Type: application/json" -d "{\"name\":\"aaa\"}"
// JSON데이터 전송(bash): curl -X POST 127.0.0.1:8080/user -H 'Content-Type: application/json' -d '{"name":"aaa"}'
// PlainText 전송: curl -X POST 127.0.0.1:3000/user -H "Content-Type: text/plain" -d "name=aaa"

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {};

http.createServer(async (req, res) => {
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
            // Step3. 정적 파일 요청 처리
            // Step4. 동적 이미지 요청 핸들링
            // Step3&4 통합 리펙토링
            } else if (req.url.startsWith('/static/') || req.url.startsWith('/image/')) {
                const urlPath = req.url.startsWith('/static/') ? req.url : req.url.replace('/image/', './static/');
                const filePath = path.join(__dirname, urlPath);
                try {
                    const data = await fs.readFile(filePath);
                    const contentType = getContentType(filePath);
                    res.writeHead(200, { 'Content-Type': contentType });
                    return res.end(data);
                } catch (error) {
                    res.writeHead(404);
                    return res.end('Not Found');
                }
            } else if (req.url === '/user') { // Step6. user 요청 처리 로직 완성
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                return res.end(JSON.stringify(users));
            } else {
                res.writeHead(404);
                return res.end('Not Found');
            }
        // Step2. 기본 CRUD 백엔드 완성
        } else if (req.method === 'POST') {
            // Step5. 상세 CRUD 요청 처리 로직 완성
            if (req.url === '/user') {
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    try {
                        console.log('POST Body: ', body);
                        const { name } = JSON.parse(body);
                        const id = Date.now();
                        users[id] = name;
                        res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('등록 성공');
                    } catch (error) {
                        console.error('POST 요청 처리 중 오류 발생: ', error)
                        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('서버 내부 오류');
                    }
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
                    try {
                        console.log('PUT Body: ', body);
                        users[key] = JSON.parse(body).name;
                        return res.end(JSON.stringify(users));
                    } catch (error) {
                        console.error('PUT 요청 처리 중 오류 발생: ', error)
                        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('서버 내부 오류');
                    }
                });
            }
        } else if (req.method === 'DELETE') {
            if (req.url.startsWith('/user/')) {
                try {
                    const key = req.url.split('/')[2];
                    delete users[key];
                    return res.end(JSON.stringify(users));
                }  catch (error) {
                    console.error('DELETE 요청 처리 중 오류 발생: ', error)
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('서버 내부 오류');
                }
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
