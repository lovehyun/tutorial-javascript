// https://developers.google.com/youtube/v3/getting-started?hl=ko
// https://console.cloud.google.com/apis/dashboard?hl=ko (API 및 서비스 -> 사용자 인증 정보 -> API키)
// https://developers.google.com/youtube/v3/docs/search/list
const axios = require('axios');

// YouTube Data API 엔드포인트 및 API 키
const API_KEY = 'YOUR_API_KEY'; // 실제 API 키로 바꾸세요
const searchQuery = 'Python programming';
const url = 'https://www.googleapis.com/youtube/v3/search';

// API 요청 파라미터 설정
const params = {
    part: 'snippet',
    q: searchQuery,
    type: 'video',
    maxResults: 10,
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
            const description = item.snippet.description;

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
