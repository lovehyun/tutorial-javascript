const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {}

const myapp = {
    routes: {
        GET: [],
        POST: [],
        PUT: [],
        DELETE: []
    },
    middlewares: [],
    staticFolder: '',

    // 미들웨어 등록
    use(middleware) {
        this.middlewares.push(middleware);
    },

    // 라우트 등록 메서드 (경로 패턴을 정규 표현식으로 저장)
    get(route, handler) {
        this.routes.GET.push({ route: this._createRoutePattern(route), handler });
    },
    post(route, handler) {
        this.routes.POST.push({ route: this._createRoutePattern(route), handler });
    },
    put(route, handler) {
        this.routes.PUT.push({ route: this._createRoutePattern(route), handler });
    },
    delete(route, handler) {
        this.routes.DELETE.push({ route: this._createRoutePattern(route), handler });
    },

    // 정적 파일 폴더 설정
    static(folderPath) {
        this.staticFolder = folderPath;
    },

    // 경로 패턴을 정규 표현식으로 변환하는 함수
    _createRoutePattern(route) {
        const paramNames = [];
        const pattern = route.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
            paramNames.push(key);
            return '([^/]+)'; // 매개변수 부분을 캡처하는 정규 표현식
        });
        return { regex: new RegExp(`^${pattern}$`), paramNames };
    },

    // 요청 처리 메서드
    async handleRequest(req, res) {
        // 정적 파일 라우팅 처리
        if (req.method === 'GET' && this.staticFolder && req.url.startsWith('/' + this.staticFolder)) {
            const staticFilePath = path.join(__dirname, req.url);
            try {
                const data = await fs.readFile(staticFilePath);
                sendResponse(res, 200, data, getContentType(staticFilePath));
                return; // 정적 파일을 찾았으면 여기서 응답 종료
            } catch (error) {
                console.error(`Static file not found: ${staticFilePath}`);
            }
        }

        const methodRoutes = this.routes[req.method];
        if (!methodRoutes) {
            return sendResponse(res, 404, 'Not Found');
        }

        let routeHandler = null;
        let params = {};

        // 등록된 경로와 현재 요청 URL을 매칭
        for (const { route, handler } of methodRoutes) {
            const match = req.url.match(route.regex);
            if (match) {
                routeHandler = handler;
                params = route.paramNames.reduce((acc, paramName, index) => {
                    acc[paramName] = match[index + 1]; // 매칭된 매개변수 값 저장
                    return acc;
                }, {});
                break;
            }
        }

        if (routeHandler) {
            const context = { req, res, params }; // params 객체 추가
            let index = 0;

            // 미들웨어와 라우트 핸들러 순차적으로 실행
            const next = () => {
                if (index < this.middlewares.length) {
                    const middleware = this.middlewares[index++];
                    middleware(context, next);
                } else {
                    routeHandler(context); // 라우트 핸들러 실행
                }
            };

            next();
        } else {
            sendResponse(res, 404, 'Not Found');
        }
    }
};

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

// 공통 응답 함수
function sendResponse(res, statusCode, message, contentType = 'text/plain') {
    res.writeHead(statusCode, { 'Content-Type': `${contentType}; charset=utf-8` });
    res.end(message);
}

// 파일 확장자에 따른 Content-Type 반환 함수
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'application/javascript';
        case '.css':
            return 'text/css';
        case '.jpg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        default:
            return 'application/octet-stream';
    }
}

// 공통 미들웨어 예제
function loggerMiddleware(context, next) {
    console.log(`${context.req.method} ${context.req.url}`);
    next();
}

// 요청 본문 처리 미들웨어
function parseJsonMiddleware(context, next) {
    const { req } = context;
    if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', (data) => (body += data));
        req.on('end', () => {
            try {
                context.req.body = JSON.parse(body);
                next();
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
                sendResponse(context.res, 400, '잘못된 JSON 형식입니다.');
            }
        });
    } else {
        next();
    }
}

// 미들웨어 등록
myapp.use(loggerMiddleware);
myapp.use(parseJsonMiddleware);

// 정적 파일 폴더 등록
myapp.static('static');

// 라우트 등록
myapp.get('/', async (context) => {
    await readFileAndRespond(context.res, './index.html', 'text/html');
});

myapp.get('/about', async (context) => {
    await readFileAndRespond(context.res, './about.html', 'text/html');
});

myapp.get('/user', (context) => {
    sendResponse(context.res, 200, JSON.stringify(users), 'application/json');
});

myapp.post('/user', (context) => {
    const { name } = context.req.body;
    if (name && !users[name]) {
        users[name] = name;
        sendResponse(context.res, 201, `${name} 등록 성공`);
    } else {
        sendResponse(context.res, 400, '유효하지 않거나 이미 존재하는 사용자입니다.');
    }
});

myapp.put('/user/:name', (context) => {
    const name = path.basename(context.req.url);
    if (users[name]) {
        users[name] = context.req.body.name || users[name];
        sendResponse(context.res, 200, JSON.stringify(users), 'application/json');
    } else {
        sendResponse(context.res, 404, '사용자를 찾을 수 없습니다.');
    }
});

myapp.delete('/user/:name', (context) => {
    const name = path.basename(context.req.url);
    if (name && users[name]) {
        delete users[name];
        sendResponse(context.res, 200, `${name} 삭제 성공`);
    } else {
        sendResponse(context.res, 404, '사용자를 찾을 수 없습니다.');
    }
});

// 서버 생성 및 요청 리스너 설정
const server = http.createServer((req, res) => {
    myapp.handleRequest(req, res);
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
