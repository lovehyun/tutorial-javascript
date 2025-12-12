// curl -X GET http://localhost:3000/admin -H "Authorization: Bearer admin1234"

const http = require('http');

const myapp = {
    globalMiddlewares: [],   // app 전체에 공통으로 적용되는 미들웨어들
    routes: {},              // 라우트별 미들웨어 & 핸들러들

    // 전역 미들웨어 등록 (app.use 와 비슷)
    use(fn) {
        this.globalMiddlewares.push(fn);
    },

    // 라우트 등록 (경로별 미들웨어 + 최종 핸들러)
    // 예: myapp.register('/user', logger, userMiddleware, userHandler);
    register(route, ...handlers) {
        this.routes[route] = handlers; // 다중 핸들러 등록
    },

    // 요청 처리
    handleRequest(req, res) {
        const route = req.url.split('?')[0]; // 쿼리스트링 제거
        const routeHandlers = this.routes[route] || [];

        // 라우트를 못 찾으면 여기서 바로 404 리턴
        if (!routeHandlers || routeHandlers.length === 0) {
            res.statusCode = 404;
            res.end(`Not Found: ${route}`);
            return;
        }

        // 실행할 스택: 전역 미들웨어 + 라우트 전용 미들웨어/핸들러
        const stack = [...this.globalMiddlewares, ...routeHandlers];

        // 미들웨어 간 공유할 context
        const context = { req, res, route };

        let index = 0;

        const next = () => {
            // 이미 응답이 끝났으면 더 이상 진행 X
            if (res.writableEnded) return;

            if (index < stack.length) {
                const fn = stack[index++];
                fn(context, next);  // (context, next) 패턴으로 호출
            } else {
                // 여기까지 왔다 = 라우트는 있었는데 아무도 응답을 안 보냈다
                // → 이건 서버 쪽 문제니까 500
                res.statusCode = 500;
                res.end('Server did not send any response\n');
            }
        };

        next(); // 첫 번째 미들웨어부터 시작
    }
};

/********************/
/* 전역 미들웨어들   */
/********************/

// 모든 요청에 대해 공통 로깅
function loggerMiddleware(context, next) {
    const { req, res, route } = context;
    // 1. 로그 찍고 끝
    // console.log(`[LOG] ${req.method} ${route}`);
    context.startTime = Date.now();  // 시작 시간 새로 등록 (또는 이전 timeMiddleware 에서 추가)

    next();

    // 2. 먼저 다음 연산자부터 호출하고, 그 이후에 처리...
    // 그 다음, 처리 끝난 후에 경과 시간 계산
    if (context.startTime) {  // 이전 timeMiddleware 에서 하는 방식이었다면...
        const duration = Date.now() - context.startTime;
        console.log(`[LOG] ${req.method} ${route} -> ${res.statusCode} ${duration}ms`);
    } else {
        console.log(`[LOG] ${req.method} ${route} -> ${res.statusCode} (no startTime)`);
    }
}

// 모든 요청에 대해 간단한 헤더 설정
function headerMiddleware(context, next) {
    context.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    next();
}

/********************/
/* 라우트별 미들웨어 */
/********************/

function userMiddleware(context, next) {
    // /user 전용 전처리 예시
    context.res.write('User-specific processing...\n');
    next();
}

function adminAuthMiddleware(context, next) {
    const { req, res } = context;

    // Node.js에서는 헤더 키가 소문자로 들어옴 (authorization)
    const authHeader = req.headers['authorization'];

    // 헤더가 없으면 실패
    if (!authHeader) {
        res.statusCode = 401; // Unauthorized
        res.end('Authorization header missing\n');
        return;
    }

    // 형식: "Bearer 토큰값"
    const [scheme, token] = authHeader.split(' ');

    // 형식 또는 토큰이 잘못된 경우
    if (scheme !== 'Bearer' || token !== 'admin1234') {
        res.statusCode = 403; // Forbidden
        res.end('Invalid or expired token\n');
        return;
    }

    console.log('Admin authenticated successfully');
    // 인증 성공 → 다음 핸들러 (adminHandler)로 진행
    next();
}

/********************/
/* 라우트 핸들러들   */
/********************/

function rootHandler(context, next) {
    context.res.end('Hello from /\n');
    // 보통 최종 핸들러에서는 next() 를 안 부릅니다.
}

function userHandler(context, next) {
    context.res.end('Hello from /user\n');
}

function adminHandler(context, next) {
    context.res.end('Welcome, admin!\n');
}

/*************************/
/* 라우트 & 미들웨어 등록  */
/*************************/

// 전역 미들웨어 (모든 요청에 공통 적용)
myapp.use(loggerMiddleware);
myapp.use(headerMiddleware);

// 라우트별 체인
myapp.register('/', rootHandler);

myapp.register('/user', userMiddleware, userHandler); // user 전용 미들웨어 -> user 최종 라우터 핸들러

myapp.register(
    '/admin',
    adminAuthMiddleware, // /admin 전용 인증 미들웨어
    adminHandler         // 인증 통과 시만 실행될 핸들러
);

// 디버그 출력
function printRouteStacks(app) {
    console.log('=== Route execution plan ===');

    for (const [route, handlers] of Object.entries(app.routes)) {
        // handlers도 이제 배열임 [...global, ...handlers]
        const stack = [...app.globalMiddlewares, ...handlers];

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

/********************/
/* 서버 시작         */
/********************/

const server = http.createServer((req, res) => {
    myapp.handleRequest(req, res);
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
