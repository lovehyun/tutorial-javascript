const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 3000;

// Helmet 사용
app.use(helmet());

// 1. Content Security Policy (CSP): 크로스 사이트 스크립팅 공격을 방지하기 위해 콘텐츠 소스를 제어합니다.
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "example.com"],
        },
    })
);

// CSP 예제2
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://example.com"],
        scriptSrc: ["'self'", "https://trusted.com"],
    },
}));

// 2. HSTS (HTTP Strict Transport Security): HTTPS를 사용하도록 강제합니다.
app.use(helmet.hsts({
    maxAge: 63072000, // 2 years
    includeSubDomains: true,
    preload: true,
}));

// 3. X-Content-Type-Options: MIME 타입을 차단하여 콘텐츠 타입 변조를 방지합니다.
app.use(helmet.noSniff());

// 4. X-Frame-Options: 클릭재킹 공격을 방지합니다.
app.use(helmet.frameguard({ action: 'deny' })); // 모든 iframe에서 차단
app.use(helmet.frameguard({ action: 'sameorigin' })); // 같은 출처에서만 iframe 허용

// 5. X-XSS-Protection: 크로스 사이트 스크립팅 공격을 감지하고 차단합니다.
app.use(helmet.xssFilter());

// 6. Referrer Policy: 요청을 보낼 때 어떤 정보를 포함할지 결정합니다.
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));


// 기본 경로
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
