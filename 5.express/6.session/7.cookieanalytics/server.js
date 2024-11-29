require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
        return []; // 오류가 있으면 빈 배열 반환
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 정적 파일 제공 (HTML, JS, CSS)
app.use(express.static('public'));

// JSON 요청 처리
app.use(express.json());

// 데이터 수집 API
app.post('/api/collect', async (req, res) => {
    const { userAgent, language, screenResolution, clickActivity, consentTime } = req.body;
    const ip = req.ip;
    let location = { country: 'Unknown', city: 'Unknown' }; // 기본값 설정

    // 브라우저 분석
    const browser = detectBrowser(userAgent);

    if (USE_IPSTACK && IPSTACK_API_KEY) {
        try {
            const locationResponse = await axios.get(`http://api.ipstack.com/${ip}?access_key=${IPSTACK_API_KEY}`);
            console.log('IPStack API Response:', locationResponse.data);
            location = {
                country: locationResponse.data.country_name || 'Unknown',
                city: locationResponse.data.city || 'Unknown',
                latitude: locationResponse.data.latitude || 'Unknown',
                longitude: locationResponse.data.longitude || 'Unknown',
            };
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    }

    const newEntry = {
        userAgent, 
        browser, // 분석된 브라우저 정보 추가
        language, 
        screenResolution, 
        clickActivity, 
        ip, 
        location, 
        consentTime, 
        timestamp: new Date(), // 서버에서 기록 시간 추가
    }

    const data = readData();
    data.push(newEntry);
    writeData(data);

    res.status(200).json({ message: 'Data collected successfully' });
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

// 대시보드 데이터 API
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
            const browser = item.browser || 'Unknown';
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
