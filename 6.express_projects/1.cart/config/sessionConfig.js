// config/sessionConfig.js

import session from 'express-session';

const sessionConfig = session({
    secret: process.env.SESSION_SECRET || 'default-secret-key', // 환경 변수로 관리하는 것이 좋습니다
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 secure 쿠키 사용
        maxAge: 1000 * 60 * 60 * 24, // 1일
    },
});

export { sessionConfig };
