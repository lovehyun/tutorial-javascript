// npm install express dotenv axios

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// 환경 변수에서 API 키 읽기
const API_KEY = process.env.YOUTUBE_API_KEY;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// REST API: 검색 엔드포인트
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                maxResults: 10,
                key: API_KEY,
            },
        });

        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching YouTube API:', error);
        res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
