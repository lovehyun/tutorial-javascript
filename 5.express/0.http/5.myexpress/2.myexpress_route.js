const http = require('http');

const myapp = {
    routes: {},

    // 라우트 등록 메서드
    register(route, ...middlewares) {
        this.routes[route] = this.routes[route] || [];
        this.routes[route].push(...middlewares);
    },

    // 요청 처리 메서드
    handleRequest(req, res) {
        const route = req.url;
        const middlewares = this.routes[route] || [];
        
        // context 객체를 사용하여 미들웨어 간 데이터를 공유
        const context = { req, res, route };

        let index = 0;

        // 미들웨어 실행을 위한 함수
        const next = () => {
            if (index < middlewares.length) {
                const middleware = middlewares[index++];
                middleware(context, next); // 다음 미들웨어로 전달
            } else {
                // 모든 미들웨어가 끝난 후 응답
                if (!res.writableEnded) {
                    res.end(`Response for ${route}`);
                }
            }
        };

        next(); // 첫 번째 미들웨어부터 실행 시작
    }
};

// 미들웨어 함수 정의
function loggerMiddleware(context, next) {
    console.log(`Logger: ${context.req.method} ${context.route}`);
    next();
}

function authMiddleware(context, next) {
    // 간단한 인증 예시
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

// 라우트 및 미들웨어 등록
myapp.register('/', loggerMiddleware);
myapp.register('/user', loggerMiddleware, userMiddleware);
myapp.register('/admin', loggerMiddleware, authMiddleware);

// 서버 생성 및 요청 리스너 설정
const server = http.createServer((req, res) => {
    myapp.handleRequest(req, res);
});

// 서버 시작
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
