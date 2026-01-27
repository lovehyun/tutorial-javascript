require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const morgan = require('morgan');

// import express from 'express';
// import session from 'express-session';
// import axios from 'axios';
// import path from 'path';
// import dotenv from 'dotenv';
// dotenv.config({ quiet: true });

const app = express();
const PORT = 3000;

// 환경 변수에서 클라이언트 정보 가져오기
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

// 세션 설정
app.use(
    session({
        secret: 'your_secret_key', // 세션 암호화 키
        resave: false,
        saveUninitialized: false,
    })
);

// 로깅
app.use(morgan('dev'));

// 정적 파일 제공
// app.use(express.static(path.join(__dirname, 'public')));
// 정적 파일을 /static 경로에서만 서빙
app.use('/static', express.static(path.join(__dirname, 'public')));

// 로그인 확인 미들웨어
function ensureLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        // res.redirect('/');
        res.status(403).sendFile(path.join(__dirname, 'public', 'error.html'));
        // res.status(403).send(`
        //     <h1>403 Forbidden</h1>
        //     <p>로그인되지 않았습니다. 보호된 페이지에 접근하려면 로그인이 필요합니다.</p>
        //     <a href="/">로그인 페이지로 이동</a>
        // `);
    }
}

// 홈 페이지
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// 로그인 요청
app.get('/login', (req, res) => {
    const state = Math.random().toString(36).substring(7); // 상태 값 생성
    const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;
    res.redirect(authUrl);
});

// 네이버 OAuth 콜백 처리
app.get('/api/oauth2/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        // 액세스 토큰 요청
        const tokenResponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
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
        const userInfoResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userInfo = userInfoResponse.data.response;

        // 세션에 사용자 정보 저장
        // req.session.user = {
        //     name: userInfo.name,
        //     email: userInfo.email,
        //     profileImage: userInfo.profile_image,
        // };

        // 모든 사용자 정보를 세션에 저장
        req.session.user = {
            name: userInfo.name || 'Unknown',
            nickname: userInfo.nickname || 'N/A',
            email: userInfo.email || 'No email provided',
            profileImage: userInfo.profile_image || null,
            age: userInfo.age || 'N/A',
            gender: userInfo.gender === 'M' ? 'Male' : userInfo.gender === 'F' ? 'Female' : 'N/A',
            birthday: userInfo.birthday || 'N/A',
            mobile: userInfo.mobile || 'N/A',
            id: userInfo.id || 'N/A',
        };

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during OAuth process:', error.response ? error.response.data : error.message);
        res.status(500).send('Error during OAuth process');
    }
});

// 보호된 페이지
app.get('/dashboard', ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API: 사용자 데이터 반환
app.get('/api/user', ensureLoggedIn, (req, res) => {
    res.json(req.session?.user);
});

// 로그아웃
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
        }
        res.redirect('/');
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
