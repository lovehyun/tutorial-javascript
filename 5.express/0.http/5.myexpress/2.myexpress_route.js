const http = require('http');

const myapp = {
    routes: {},

    // 라우트 등록 (라우트 handler 등록)
    register(route, handler) {
        this.routes[route] = handler;
    },

    // 요청 처리 - http 모듈로부터 req, res 를 전달받아 경로를 처리
    handleRequest(req, res) {
        const route = req.url;
        const handler = this.routes[route]; // 라우터 검색

        if (handler) {
            handler(req, res);   // 바로 핸들러 호출
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    }
};

// 각 라우트용 핸들러들
function rootHandler(req, res) {
    res.end('Response for /');
}

function userHandler(req, res) {
    res.write('User-specific processing\n');
    res.end('Response for /user');
}

function adminHandler(req, res) {
    res.write('Admin authentication required\n');
    res.end('Response for /admin');
}

// 라우트 등록
myapp.register('/', rootHandler);
myapp.register('/user', userHandler);
myapp.register('/admin', adminHandler);

// 여기서 등록된 라우트들 출력
console.log('Registered routes:');
for (const route of Object.keys(myapp.routes)) {
    console.log(` - ${route}`);
}

console.log('Registered routes and handler names:');
for (const [route, handler] of Object.entries(myapp.routes)) {
    console.log(` - ${route} -> ${handler.name || '(anonymous handler)'}`);
}

// 등록후 기대 라우팅 테이블
// {
//   "/": rootHandler,
//   "/user": userHandler,
//   "/admin": adminHandler
// }

// 서버 생성
const server = http.createServer((req, res) => {
    myapp.handleRequest(req, res);
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
