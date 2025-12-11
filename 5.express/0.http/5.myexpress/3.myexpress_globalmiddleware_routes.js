const http = require('http');

const myapp = {
    globalMiddlewares: [],   // 전역 미들웨어
    routes: {},              // 라우트별 핸들러

    // 전역 미들웨어 등록 (Express의 app.use와 동일)
    use(fn) {
        this.globalMiddlewares.push(fn);
    },

    // 라우트 등록 (라우트 handler 등록)
    register(route, handler) {
        this.routes[route] = handler;
    },

    // 요청 처리
    handleRequest(req, res) {
        // const route = req.url;
        const route = req.url.split('?')[0]; // 쿼리 파라미터 제거하고 등록
        const handler = this.routes[route];

        // 라우트 못 찾으면 404
        if (!handler) {
            res.statusCode = 404;
            return res.end(`Not Found: ${route}`);
        }

        // 미들웨어 간 공유되는 context 객체
        const context = { req, res, route };

        const stack = [...this.globalMiddlewares, handler]; // 전역 미들웨어 뒤에 핸들러 추가
        let index = 0;

        // 각 미들웨어 가져와서 실재 handler 함수 호출
        const next = () => {
            if (res.writableEnded) return;

            const fn = stack[index++];
            if (fn) {
                fn(context, next);
            }
        };

        next(); // 첫 번째 미들웨어부터 실행
    }
};

// ----------------------------
// 전역 미들웨어들
// ----------------------------
function loggerMiddleware(context, next) {
    console.log(`[LOG] ${context.req.method} ${context.route}`);
    next();
}

function timeMiddleware(context, next) {
    context.startTime = Date.now();
    next();
}

function headerMiddleware(context, next) {
    context.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    next();
}

// ----------------------------
// 라우트 핸들러들
// ----------------------------
function rootHandler(context) {
    context.res.end('Hello from /\n');
}

function userHandler(context) {
    context.res.end('Hello from /user\n');
}

function adminHandler(context) {
    context.res.end('Hello from /admin\n');
}

// ----------------------------
// 라우트 등록
// ----------------------------
myapp.use(loggerMiddleware);
myapp.use(timeMiddleware);
myapp.use(headerMiddleware);

myapp.register('/', rootHandler);
myapp.register('/user', userHandler);
myapp.register('/admin', adminHandler);

// 디버그 출력
function printRouteStacks(app) {
    console.log('=== Route execution plan ===');

    for (const [route, handler] of Object.entries(app.routes)) {
        // 이 라우트가 실제 요청 시 거치게 될 함수들
        const stack = [...app.globalMiddlewares, handler];

        const names = [
            'req',
            ...stack.map(fn => fn.name || '(anonymous)'),
            'res'
        ];

        console.log(`${route}: ${names.join(' -> ')}`);
    }

    console.log('================================');
}

printRouteStacks(myapp);

// ----------------------------
// 서버 시작
// ----------------------------
const server = http.createServer((req, res) => {
    myapp.handleRequest(req, res);
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
