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
            await handleGetRequest(req, res);
        } else if (req.method === 'POST') {
            handlePostRequest(req, res);
        } else if (req.method === 'PUT') {
            handlePutRequest(req, res);
        } else if (req.method === 'DELETE') {
            handleDeleteRequest(req, res);
        } else {
            sendResponse(res, 404, 'Not Found');
        }
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, '서버 내부 오류');
    }
});

server.listen(3000, () => {
    console.log('3000 포트에서 서버 대기 중입니다.');
});

// 공통 응답 함수
function sendResponse(res, statusCode, message, contentType = 'text/plain') {
    res.writeHead(statusCode, { 'Content-Type': `${contentType}; charset=utf-8` });
    res.end(message);
}

// 파일 읽기 함수
async function readFileAndRespond(res, filePath, contentType) {
    try {
        const data = await fs.readFile(filePath);
        sendResponse(res, 200, data, contentType);
    } catch (error) {
        console.error(`${filePath} 읽기 실패:`, error);
        sendResponse(res, 404, 'Not Found');
    }
}

// GET 요청 처리 함수
async function handleGetRequest(req, res) {
    if (req.url === '/') {
        await readFileAndRespond(res, './index.html', 'text/html');
    } else if (req.url === '/about') {
        await readFileAndRespond(res, './about.html', 'text/html');
    } else if (req.url.startsWith('/static/') || req.url.startsWith('/image/')) {
        const urlPath = req.url.startsWith('/static/') ? req.url : req.url.replace('/image/', './static/');
        const filePath = path.join(__dirname, urlPath);
        await readFileAndRespond(res, filePath, getContentType(filePath));
    } else if (req.url === '/user') {
        sendResponse(res, 200, JSON.stringify(users), 'application/json');
    } else {
        sendResponse(res, 404, 'Not Found');
    }
}

// POST 요청 처리 함수 (사용자 추가)
function handlePostRequest(req, res) {
    if (req.url === '/user') {
        handleRequestBody(req, res, (parsedData) => {
            const username = parsedData.name;
            if (username && !users[username]) {
                users[username] = username;
                sendResponse(res, 201, `${username} 등록 성공`);
            } else {
                sendResponse(res, 400, '유효하지 않거나 이미 존재하는 사용자입니다.');
            }
        });
    }
}

// PUT 요청 처리 함수 (사용자 업데이트)
function handlePutRequest(req, res) {
    if (req.url.startsWith('/user/')) {
        const key = path.basename(req.url);
        if (users[key]) {
            handleRequestBody(req, res, (parsedData) => {
                users[key] = parsedData.name || users[key];
                sendResponse(res, 200, JSON.stringify(users), 'application/json');
            });
        } else {
            sendResponse(res, 404, '사용자를 찾을 수 없습니다.');
        }
    }
}

// DELETE 요청 처리 함수 (사용자 삭제)
function handleDeleteRequest(req, res) {
    if (req.url.startsWith('/user/')) {
        const username = path.basename(req.url);
        if (username && users[username]) {
            delete users[username];
            sendResponse(res, 200, `${username} 삭제 성공`);
        } else {
            sendResponse(res, 404, '사용자를 찾을 수 없습니다.');
        }
    }
}

// 요청 본문 처리 함수
function handleRequestBody(req, res, callback) {
    let body = '';
    req.on('data', (data) => (body += data));
    req.on('end', () => {
        try {
            const parsedData = JSON.parse(body);
            callback(parsedData);
        } catch (error) {
            console.error('JSON 파싱 오류:', error);
            sendResponse(res, 400, '잘못된 JSON 형식입니다.');
        }
    });
}

// 확장자에 따른 Content-Type 반환 함수
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'application/javascript';
        case '.jpg':
            return 'image/jpg';
        default:
            return 'application/octet-stream';
    }
}
