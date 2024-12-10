const express = require('express');
const axios = require('axios');

const router = express.Router();

// 환경 변수에서 API 키 로드
const KAKAO_RESTAPI_KEY = process.env.KAKAO_RESTAPI_KEY;

// 검색 API 핸들러
router.get('/', async (req, res) => {
    const { query, type, page = 1 } = req.query;

    if (!query || !type) {
        return res.status(400).json({ error: 'Invalid query or type' });
    }

    // API URL 매핑
    const apiUrlMap = {
        web: 'https://dapi.kakao.com/v2/search/web',
        image: 'https://dapi.kakao.com/v2/search/image',
        vclip: 'https://dapi.kakao.com/v2/search/vclip',
    };

    const apiUrl = apiUrlMap[type];
    if (!apiUrl) return res.status(400).json({ error: 'Invalid type' });

    try {
        // 카카오 API 요청
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}` },
            params: { query, page, size: 10, sort: 'accuracy' },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Kakao API:', error.message);
        res.status(500).json({ error: 'Failed to fetch results from Kakao API' });
    }
});

module.exports = router;
