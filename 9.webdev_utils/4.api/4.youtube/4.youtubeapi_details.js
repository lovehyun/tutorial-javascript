// https://developers.google.com/youtube/v3/docs/search?hl=ko
// https://developers.google.com/youtube/v3/docs/videos?hl=ko

require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// API 키 설정
const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
    console.error("Error: YOUTUBE_API_KEY is not defined in the .env file.");
    process.exit(1);
}

// YouTube Data API 엔드포인트 설정
const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
const videosUrl = 'https://www.googleapis.com/youtube/v3/videos';

// 검색 쿼리 설정
const searchQuery = '아이유';

// 페이지별 최대 결과 수와 페이지 수 설정
const maxResultsPerPage = 10;
const totalPages = 5;

// 검색 결과를 저장할 리스트
const searchResults = [];

// API 요청 및 데이터 수집
const fetchYouTubeData = async () => {
    let nextPageToken = null;

    try {
        for (let page = 1; page <= totalPages; page++) {
            const searchParams = {
                part: 'snippet',
                q: searchQuery,
                type: 'video',
                maxResults: maxResultsPerPage,
                pageToken: nextPageToken,
                key: API_KEY
            };

            // search.list API 요청
            const searchResponse = await axios.get(searchUrl, { params: searchParams });
            const searchData = searchResponse.data;

            // 검색 결과 저장
            searchResults.push(...searchData.items);

            // 다음 페이지 토큰 업데이트
            nextPageToken = searchData.nextPageToken;
            if (!nextPageToken) break; // 다음 페이지가 없으면 종료
        }

        // 검색 결과를 테이블 형식으로 출력
        const table = [];
        for (let index = 0; index < searchResults.length; index++) {
            const result = searchResults[index];
            const title = result.snippet.title;
            const videoId = result.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // videos.list API 요청하여 통계 정보 가져오기
            const videoParams = {
                part: 'statistics',
                id: videoId,
                key: API_KEY
            };

            const videoResponse = await axios.get(videosUrl, { params: videoParams });
            const videoData = videoResponse.data;

            // 통계 정보에서 조회수 가져오기
            const viewCount = videoData.items && videoData.items[0]?.statistics?.viewCount
                ? videoData.items[0].statistics.viewCount
                : 'N/A';

            table.push({ Index: index + 1, Title: title, 'View Count': viewCount, 'Video URL': videoUrl });
        }

        console.table(table); // 테이블 형식으로 출력
    } catch (error) {
        console.error("Error fetching data from YouTube API:", error.message);
    }
};

// 실행
fetchYouTubeData();
