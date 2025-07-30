require('dotenv').config();
const express = require('express');
const session = require("express-session");
const nunjucks = require('nunjucks');
const axios = require('axios');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

app.use(morgan('dev'))

// 정적 파일 서빙 (/style.css 로 할건지 /static/style.css 로 할건지에 따라 결정)
// app.use(express.static(path.join(__dirname, 'static')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret',
    resave: false,
    saveUninitialized: true,
}));

// Nunjucks 템플릿 설정
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

// 메인 페이지 렌더링
app.get('/', (req, res) => {
    // const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&scope=talk_message`;
    res.render('index3.html', { kakaoAuthUrl, user: req.session.user });
});

// 카카오 로그인 리디렉션 URI 처리
app.get('/auth/kakao/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) return res.status(400).send('인가 코드가 없습니다.');

    try {
        // 1. 인가 코드를 이용해 액세스 토큰 요청
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_REST_API_KEY,
                client_secret: process.env.KAKAO_CLIENT_SECRET, // optional
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code: code,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token } = tokenResponse.data;

        console.log("부여된 scope:", tokenResponse.data.scope);

        // 2. 액세스 토큰으로 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // 3. 세션 저장
        req.session.user = userResponse.data;
        req.session.token = access_token;

        res.redirect("/profile");
    } catch (err) {
        console.error('카카오 로그인 실패:', err.response?.data || err.message);
        res.status(500).send('카카오 로그인 처리 중 오류 발생');
    }
});

// 프로필 페이지
app.get("/profile", (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect("/");
    res.render("profile3.html", { user });
});

// 로그아웃
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// 나에게 메시지 보내기
app.get("/message", async (req, res) => {
    if (!req.session.token) return res.status(401).send("로그인이 필요합니다.");

    try {
        const message_template = {
            object_type: "text",
            text: "안녕하세요! 이것은 카카오톡 자동 메시지입니다.",
            link: {
                web_url: "https://my-service.com/notice/123",
                mobile_web_url: "https://my-service.com/notice/123",
            },
            // web_url - PC 환경에서 메시지를 클릭했을 때 이동할 주소
            // mobile_web_url - 모바일 환경에서 메시지를 클릭했을 때 이동할 주소

            // 1. 카카오 개발자 콘솔에서 "사이트 도메인" 설정
            // 카카오 개발자센터 > 내 애플리케이션 → 앱 선택
            // 좌측 메뉴 [앱 > 일반 > 플랫폼 > Web] 이동
            // 사이트 도메인 등록 (http, https, 도메인, 서브도메인 각각 따로 등록)
            //  - https://my-service.com
            //  - https://www.my-service.com

        };

        const response = await axios.post(
            "https://kapi.kakao.com/v2/api/talk/memo/default/send",
            new URLSearchParams({
                template_object: JSON.stringify(message_template),
            }),
            {
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${req.session.token}`,
                },
            }
        );

        console.log("메시지 응답:", response.data);

        res.send(`<h2>메시지 전송 성공</h2><pre>${JSON.stringify(response.data, null, 2)}</pre>`);
    } catch (err) {
        console.error("메시지 전송 실패:", err.response?.data || err.message);
        res.status(500).send("메시지 전송 실패");
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
