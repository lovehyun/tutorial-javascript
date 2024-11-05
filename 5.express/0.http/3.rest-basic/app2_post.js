// PlainText 전송: curl -X POST 127.0.0.1:3000/user -H "Content-Type: text/plain" -d "name=aaa"
// Form 형식으로 전송: curl -X POST http://127.0.0.1:3000/user -H "Content-Type: application/x-www-form-urlencoded" -d "name=aaa&age=25"
// Application/json 으로 전송: curl -X POST http://127.0.0.1:3000/user -H "Content-Type: application/json" -d "{\"name\":\"aaa\", \"age\":25}"

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

const server = http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        
        // Step4. 정적 파일 요청 처리
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
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end(JSON.stringify(users));
            } else if (req.url.startsWith('/image/')) {
                // Step2. 이미지 처리
                // const imageName = req.url.split('/image/')[1];
                const imageName = path.basename(req.url);  // 파일명 추출

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
        // Step5. 기본 CRUD 백엔드 완성
        } else if (req.method === 'POST') {
            // Step6. 상세 CRUD 요청 처리 로직 완성
            if (req.url === '/user') {
                let body = '';

                req.on('data', (data) => {
                    body += data;
                });

                req.on('end', () => {
                    // form이 application/x-www-form-urlencoded로 전송될 때 파싱
                    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                        const parsedData = parse(body);

                        // 위에처럼 하면 [Object: null prototype] { name: 'bbb' }
                        // 그게 싫으면, 스프레드 연산자로 일반 객체로 담기
                        // const parsedData = { ...parse(body) };

                        console.log('Received form data:', parsedData);

                        const username = parsedData.name;
                        if (username) {
                            users[username] = username;
                            res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                            return res.end('등록 성공');

                            // 또는 원래 페이지로 돌리려면??
                            // 리디렉션 설정
                            // res.writeHead(303, { 'Location': '/' });
                            // return res.end();
                        } else {
                            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                            return res.end('name 필드가 필요합니다.');
                        }
                    } else if (req.headers['content-type'] === 'text/plain') {
                        // text/plain Content-Type 처리
                        const parsedData = parse(body); // 쿼리 문자열로 파싱

                        console.log('Received plain text data:', parsedData);
        
                        const username = parsedData.name;
                        if (username) {
                            users[username] = username;
                            res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                            return res.end('등록 성공');
                        } else {
                            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                            return res.end('name 필드가 필요합니다.');
                        }
                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                        return res.end('지원되지 않는 Content-Type입니다.');
                    }
                });
            }   
        } else if (req.method === 'PUT') {
            // PUT 처리
        } else if (req.method === 'DELETE') {
            // DELETE 처리
        } else {
            res.writeHead(404);
            return res.end('Not Found');
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
