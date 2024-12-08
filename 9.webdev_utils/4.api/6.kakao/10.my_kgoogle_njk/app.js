require('dotenv').config({ path: '../.env' }); // .env 로딩
const express = require('express');
const axios = require('axios');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

// 카카오 API REST 키
const KAKAO_RESTAPI_KEY = process.env.KAKAO_RESTAPI_KEY;

// Nunjucks 설정
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    watch: true // 파일 변경 시 자동 새로고침
});
app.set('view engine', 'html'); // 뷰 엔진을 .html로 설정

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 카카오 API 호출 함수
async function callKakaoApi(apiUrl, params) {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`
            },
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error calling Kakao API:', error.message);
        throw error;
    }
}

// 루트 경로
app.get('/', (req, res) => {
    res.render('index.html');
});

// 검색 경로
app.get('/search', async (req, res) => {
    const { query, type } = req.query;

    if (!query || !type) {
        return res.status(400).send('Invalid query or type');
    }

    let apiUrl;
    if (type === 'web') {
        apiUrl = 'https://dapi.kakao.com/v2/search/web';
    } else if (type === 'image') {
        apiUrl = 'https://dapi.kakao.com/v2/search/image';
    } else if (type === 'vclip') {
        apiUrl = 'https://dapi.kakao.com/v2/search/vclip';
    } else {
        return res.status(400).send('Invalid search type');
    }

    const params = {
        query,
        sort: 'accuracy',
        page: 1,
        size: 10
    };

    try {
        const results = await callKakaoApi(apiUrl, params);
        res.render('results.html', { query, results, searchType: type });
    } catch (error) {
        res.status(500).send('Error fetching search results');
    }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
