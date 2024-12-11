require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// 카카오 API REST 키
const KAKAO_RESTAPI_KEY = process.env.KAKAO_RESTAPI_KEY;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

// 단일 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 페이징 처리 추가
app.get('/v2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search2.html'));
});

// 카카오 API 호출
app.get('/api/search', async (req, res) => {
    const { query, type } = req.query;

    if (!query || !type) {
        return res.status(400).json({ error: 'Invalid query or type' });
    }

    let apiUrl;
    if (type === 'web') {
        apiUrl = 'https://dapi.kakao.com/v2/search/web';
    } else if (type === 'image') {
        apiUrl = 'https://dapi.kakao.com/v2/search/image';
    } else if (type === 'vclip') {
        apiUrl = 'https://dapi.kakao.com/v2/search/vclip';
    } else {
        return res.status(400).json({ error: 'Invalid search type' });
    }

    const params = {
        query,
        sort: 'accuracy',
        page: 1,
        size: 10
    };

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`
            },
            params
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Kakao API:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// 카카오 API 호출
app.get('/api/search2', async (req, res) => {
    const { query, type, page = 1 } = req.query;

    if (!query || !type) {
        return res.status(400).json({ error: 'Invalid query or type' });
    }

    let apiUrl;
    if (type === 'web') {
        apiUrl = 'https://dapi.kakao.com/v2/search/web';
    } else if (type === 'image') {
        apiUrl = 'https://dapi.kakao.com/v2/search/image';
    } else if (type === 'vclip') {
        apiUrl = 'https://dapi.kakao.com/v2/search/vclip';
    } else {
        return res.status(400).json({ error: 'Invalid search type' });
    }

    const params = {
        query,
        sort: 'accuracy',
        page: Number(page), // 페이지 번호
        size: 10
    };

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`
            },
            params
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Kakao API:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
