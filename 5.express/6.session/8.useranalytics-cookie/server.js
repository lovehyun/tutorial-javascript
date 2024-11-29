require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser'); // 쿠키 파서 추가

const app = express();
const PORT = process.env.PORT || 3000;
const USE_IPSTACK = process.env.USE_IPSTACK === 'true';
const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY;

// 데이터 저장 파일 경로
const DATA_FILE = path.join(__dirname, 'data.json');

// JSON 데이터 읽기/쓰기 헬퍼 함수
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading data file:', error);
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 미들웨어
app.use(express.json());
app.use(cookieParser()); // 쿠키 파서 등록

// 자동 데이터 수집 미들웨어
app.use((req, res, next) => {
    // /api 경로는 미들웨어를 생략
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    if (!req.cookies.consentTime) {
        // 동의하지 않은 사용자는 제외
        return next();
    }

    const cookies = req.cookies;
    const ip = req.ip;
    let location = { country: 'Unknown', city: 'Unknown' }; // 기본값 설정

    // 브라우저 분석
    const browser = detectBrowser(cookies.userAgent);

    const newEntry = {
        userAgent: cookies.userAgent || 'Unknown',
        browser,
        language: cookies.language || 'Unknown',
        screenResolution: cookies.screenResolution || 'Unknown',
        clickActivity: JSON.parse(cookies.clickActivity || '[]'),
        ip,
        location,
        consentTime: cookies.consentTime || 'Unknown',
        timestamp: new Date(), // 현재 요청 시간
    };

    // 기존 데이터에 추가
    const data = readData();
    data.push(newEntry);
    writeData(data);

    console.log('Data collected via middleware:', newEntry);

    // 쿠키에서 클릭 데이터 초기화
    res.cookie('clickActivity', JSON.stringify([]), { path: '/' });
    
    next();
});

function detectBrowser(userAgent) {
    if (/Edg/i.test(userAgent)) {
        return 'Edge';
    } else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
        return 'Chrome';
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        return 'Safari';
    } else if (/Firefox/i.test(userAgent)) {
        return 'Firefox';
    } else if (/MSIE|Trident/i.test(userAgent)) {
        return 'Internet Explorer';
    } else {
        return 'Other';
    }
}

// 기본 라우트: 정적 HTML 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 정적 파일 제공
app.use(express.static('public'));

// 데이터 분석 API
app.get('/api/dashboard', (req, res) => {
    const data = readData();

    // 분석 결과 생성
    const analysis = {
        osSummary: data.reduce((acc, item) => {
            const os = /Windows|Mac|Linux|Android|iPhone/i.exec(item.userAgent)?.[0] || 'Other';
            acc[os] = (acc[os] || 0) + 1;
            return acc;
        }, {}),
        browserSummary: data.reduce((acc, item) => {
            const browser = detectBrowser(item.userAgent) || 'Unknown';
            acc[browser] = (acc[browser] || 0) + 1;
            return acc;
        }, {}),
        countrySummary: data.reduce((acc, item) => {
            const country = item.location?.country || 'Unknown';
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {}),
    };

    res.json({ rawData: data, analysis });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
