require('dotenv').config();
const express = require('express');
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

// Nunjucks 템플릿 설정
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

// 메인 페이지 렌더링
app.get('/', (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
    res.render('index.html', { kakaoAuthUrl });
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
                client_secret: process.env.KAKAO_CLIENT_SECRET,
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

        // 2. 액세스 토큰으로 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user = userResponse.data;

        // 3. 사용자 정보 출력
        res.send(`
            <h1>로그인 성공!</h1>
            <p>닉네임: ${user.properties.nickname}</p>
            <p>이메일: ${user.kakao_account.email || '없음'}</p>
        `);
    } catch (err) {
        console.error('카카오 로그인 실패:', err.response?.data || err.message);
        res.status(500).send('카카오 로그인 처리 중 오류 발생');
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
