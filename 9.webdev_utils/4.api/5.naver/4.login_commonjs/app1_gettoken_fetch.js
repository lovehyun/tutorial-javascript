// require('dotenv').config();
require('dotenv').config({ quiet: 'true' });
const express = require('express');

// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config({ quiet: true });

const app = express();
const PORT = 3000;

// 환경 변수에서 Client ID와 Secret 가져오기
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

// 네이버 로그인 URL
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';  // 1단계: 네이버로 보낸다
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';     // 2단계: code검증 및 token발급
const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me';   // 3단계: 사용자 정보 받아온다

// 로그인 요청
app.get('/login', (req, res) => {
    const state = Math.random().toString(36).slice(2); // 36진수(0-9a-z) 13글자, 상태 코드 생성 (소수점 두번째 글자 이후 나머지)
    
    // 1. 네이버로 보내기
    const authUrl =
        `${NAVER_AUTH_URL}?response_type=code` +
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&state=${state}`;

    res.redirect(authUrl);
});

// 콜백 처리
app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        // 2. 액세스 토큰 요청
        const tokenUrl =
            `${NAVER_TOKEN_URL}?grant_type=authorization_code` +
            `&client_id=${CLIENT_ID}` +
            `&client_secret=${CLIENT_SECRET}` +
            `&code=${code}` +
            `&state=${state}`;

        const tokenRes = await fetch(tokenUrl);
        if (!tokenRes.ok) {
            throw new Error(`Token 요청 실패: ${tokenRes.status}`);
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // 3. 사용자 정보 요청
        const userInfoRes = await fetch(NAVER_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userInfoRes.ok) {
            throw new Error(`UserInfo 요청 실패: ${userInfoRes.status}`);
        }

        const userInfoData = await userInfoRes.json();
        const userInfo = userInfoData.response;

        // 결과 출력
        res.send(`
            <h1>네이버 로그인 성공</h1>
            <p>이름: ${userInfo.name}</p>
            <p>이메일: ${userInfo.email}</p>
            <p>
                프로필 이미지:<br/>
                <img src="${userInfo.profile_image}" alt="Profile">
            </p>
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
