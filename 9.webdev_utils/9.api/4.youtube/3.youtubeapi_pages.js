require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// API 키 설정
const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
    console.error("Error: YOUTUBE_API_KEY is not defined in the .env file.");
    process.exit(1);
}

// YouTube Data API 엔드포인트 및 검색 쿼리 설정
const url = 'https://www.googleapis.com/youtube/v3/search';
const searchQuery = 'Python programming';

// 페이지별 최대 결과 수와 페이지 수 설정
const maxResultsPerPage = 10;
const totalPages = 5;

// 검색 결과를 저장할 리스트
const searchResults = [];

// API 호출 및 검색 결과 저장 함수
const fetchYouTubeSearchResults = async () => {
    let nextPageToken = null;

    try {
        for (let page = 1; page <= totalPages; page++) {
            const params = {
                part: 'snippet',
                q: searchQuery,
                type: 'video',
                maxResults: maxResultsPerPage,
                pageToken: nextPageToken,
                key: API_KEY
            };

            // API 요청 보내기
            const response = await axios.get(url, { params });
            const data = response.data;

            // 검색 결과 파싱하여 저장
            searchResults.push(...data.items);

            // 다음 페이지 토큰 저장
            nextPageToken = data.nextPageToken;

            // 페이지가 더 이상 없으면 중단
            if (!nextPageToken) break;
        }

        // 검색 결과 출력
        const table = searchResults.map((result, index) => {
            const title = result.snippet.title;
            const videoId = result.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            return { Index: index + 1, Title: title, URL: videoUrl };
        });

        console.table(table);
    } catch (error) {
        console.error("Error fetching data from YouTube API:", error.message);
    }
};

// 실행
fetchYouTubeSearchResults();
