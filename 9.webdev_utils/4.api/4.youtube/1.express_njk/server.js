// npm install express nunjucks chokidar dotenv axios

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const nunjucks = require('nunjucks');

const app = express();
const PORT = 3000;

// 환경 변수에서 API 키 읽기
const API_KEY = process.env.YOUTUBE_API_KEY;

// Nunjucks 설정: .html을 기본 확장자로 사용
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true, // 변경 사항 자동 감지
});

// 사용자 정의 필터 등록
env.addFilter('stringify', function (obj) {
    return JSON.stringify(obj);
});

// Express에서 템플릿 엔진 기본 설정
app.set('view engine', 'html'); // 기본 확장자를 .html로 설정

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 검색 페이지
app.get('/', (req, res) => {
    res.render('index', { videos: [], selectedVideo: null });
});

// 검색 API 라우트
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send('Bad parameter');
        // return res.render('index', { videos: [], selectedVideo: null });
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

        const videos = response.data.items;

        // response.data.items 에서 필요한 정보만 추출
        // const videos = response.data.items.map(item => ({
        //     videoId: item.id.videoId, // 유튜브 영상 ID
        //     title: item.snippet.title, // 영상 제목
        //     description: item.snippet.description, // 영상 설명
        //     thumbnailUrl: item.snippet.thumbnails.medium.url, // 썸네일 URL
        // }));
        
        res.render('index', { videos });
    } catch (error) {
        console.error('Error fetching YouTube API:', error);
        return res.status(500).send('Fetch Error');
    }
});

// 동영상 재생 라우트
app.get('/play', (req, res) => {
    const videoId = req.query.videoId;
    const videos = JSON.parse(decodeURIComponent(req.query.videos || '[]'));
    const selectedVideo = videos.find((video) => video.id.videoId === videoId);

    res.render('index', { videos, selectedVideo });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
