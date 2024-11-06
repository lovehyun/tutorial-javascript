const http = require('http');

const myapp = {
    globalMiddlewares: [],
    routes: {},

    // 공통 미들웨어 등록 메서드
    use(middleware) {
        this.globalMiddlewares.push(middleware);
    },

    // 라우트 등록 메서드
    register(route, ...middlewares) {
        this.routes[route] = this.routes[route] || [];
        this.routes[route].push(...middlewares);
    },

    // 요청 처리 메서드
    handleRequest(req, res) {
        const route = req.url;
        const middlewares = [...this.globalMiddlewares, ...(this.routes[route] || [])];
        
        const context = { req, res, route };

        let index = 0;

        const next = () => {
            if (index < middlewares.length) {
                const middleware = middlewares[index++];
                middleware(context, next);
            } else {
                if (!res.writableEnded) {
                    res.end(`Response for ${route}`);
                }
            }
        };

        next();
    }
};

// 공통 미들웨어 정의
function loggerMiddleware(context, next) {
    console.log(`Logger: ${context.req.method} ${context.route}`);
    next();
}

function requestTimeMiddleware(context, next) {
    context.requestTime = Date.now();
    console.log(`Request time: ${context.requestTime}`);
    next();
}

// 개별 미들웨어 정의
function authMiddleware(context, next) {
    if (context.route === '/admin') {
        context.res.write('Admin authentication required\n');
    }
    next();
}

function userMiddleware(context, next) {
    if (context.route === '/user') {
        context.res.write('User-specific processing\n');
    }
    next();
}

// 공통 미들웨어 등록
myapp.use(loggerMiddleware);
myapp.use(requestTimeMiddleware);

// 라우트별 미들웨어 등록
myapp.register('/', (context, next) => {
    context.res.write('Home Page\n');
    next();
});
myapp.register('/user', userMiddleware);
myapp.register('/admin', authMiddleware);

// 서버 생성 및 요청 리스너 설정
const server = http.createServer((req, res) => {
    myapp.handleRequest(req, res);
});

// 서버 시작
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
