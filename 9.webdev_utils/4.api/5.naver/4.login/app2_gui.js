const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// 환경 변수에서 클라이언트 정보 가져오기
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

// 네이버 OAuth URL
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me';

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 로그인 요청
app.get('/login', (req, res) => {
    const state = Math.random().toString(36).substring(7); // 상태 값 생성
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
                redirect_uri: REDIRECT_URI,
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

        // 추가 데이터 (예: 성별, 연령 등 동의 항목 확인)
        const additionalInfo = {
            gender: userInfo.gender || '미동의',
            age: userInfo.age || '미동의',
            birthday: userInfo.birthday || '미동의',
        };

        // 사용자 정보 렌더링
        res.send(`
            <h1>네이버 로그인 성공</h1>
            <p>이름: ${userInfo.name}</p>
            <p>이메일: ${userInfo.email}</p>
            <p>프로필 이미지: <img src="${userInfo.profile_image}" alt="Profile"></p>
            <h2>추가 정보</h2>
            <p>성별: ${additionalInfo.gender}</p>
            <p>연령대: ${additionalInfo.age}</p>
            <p>생일: ${additionalInfo.birthday}</p>
            <a href="/">홈으로 돌아가기</a>
        `);
    } catch (error) {
        console.error('Error during OAuth process:', error.response ? error.response.data : error.message);
        res.status(500).send('Error during OAuth process');
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
