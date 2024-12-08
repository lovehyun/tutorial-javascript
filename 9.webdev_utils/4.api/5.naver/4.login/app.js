const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// 환경 변수에서 Client ID와 Secret 가져오기
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

// 네이버 로그인 URL
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me';

// 로그인 요청
app.get('/login', (req, res) => {
    const state = Math.random().toString(36).substr(2); // 상태 코드 생성
    const authUrl = `${NAVER_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;
    res.redirect(authUrl);
});

// 콜백 처리
app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        // 액세스 토큰 요청
        const tokenResponse = await axios.get(NAVER_TOKEN_URL, {
            params: {
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                state: state,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // 사용자 정보 요청
        const userInfoResponse = await axios.get(NAVER_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userInfo = userInfoResponse.data.response;

        // 사용자 정보 출력
        res.send(`
            <h1>네이버 로그인 성공</h1>
            <p>이름: ${userInfo.name}</p>
            <p>이메일: ${userInfo.email}</p>
            <p>프로필 이미지: <img src="${userInfo.profile_image}" alt="Profile"></p>
        `);
    } catch (error) {
        console.error('Error during OAuth process:', error.response ? error.response.data : error.message);
        res.status(500).send('Error during OAuth process');
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Go to http://localhost:${PORT}/login to start the login process`);
});
