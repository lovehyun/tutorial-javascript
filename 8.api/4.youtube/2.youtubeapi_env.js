require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// .env 파일에서 API_KEY 읽어오기
const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
    console.error("Error: YOUTUBE_API_KEY is not defined in the .env file.");
    process.exit(1);
}

// YouTube Data API 엔드포인트 및 검색 쿼리 설정
const searchQuery = 'Python programming';
const url = 'https://www.googleapis.com/youtube/v3/search';

// API 요청 파라미터 설정
const params = {
    part: 'snippet',
    q: searchQuery,
    type: 'video',
    maxResults: 10, // 최대값 50
    key: API_KEY
};

// API 요청 보내기
const fetchYouTubeVideos = async () => {
    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        // 결과 파싱 및 출력
        data.items.forEach(item => {
            const title = item.snippet.title;
            const videoId = item.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const description = item.snippet.description || 'No description';

            console.log(`Title: ${title}`);
            console.log(`URL: ${videoUrl}`);
            console.log(`Description: ${description}`);
            console.log('-'.repeat(40));
        });
    } catch (error) {
        console.error("Error fetching data from YouTube API:", error.message);
    }
};

// 실행
fetchYouTubeVideos();
