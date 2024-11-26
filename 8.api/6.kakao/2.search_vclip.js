require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// .env 파일에서 REST API 키 가져오기
const REST_API_KEY = process.env.KAKAO_RESTAPI_KEY;

// 검색할 텍스트
const query = "아이유";

// API 요청 URL 및 헤더 설정
const url = "https://dapi.kakao.com/v2/search/vclip";
const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`
};

// 요청 파라미터 설정
const params = {
    query: query,
    sort: "accuracy", // 정확도순 정렬
    page: 1,          // 페이지 번호
    size: 10          // 한 페이지에 보여질 문서 수
};

// GET 요청 보내기
axios.get(url, { headers, params })
    .then(response => {
        const data = response.data;

        // 검색 결과 출력
        console.log(`Total Count: ${data.meta.total_count}`);
        console.log(`Pageable Count: ${data.meta.pageable_count}`);
        console.log(`Is End: ${data.meta.is_end}`);
        console.log('-'.repeat(40));

        // 검색 결과 문서 출력
        data.documents.forEach(item => {
            const title = item.title.replace(/<b>/g, "").replace(/<\/b>/g, "");
            const url = item.url;
            const playTime = item.play_time;
            const thumbnail = item.thumbnail;
            const datetime = item.datetime;
            const author = item.author;

            console.log(`Title: ${title}`);
            console.log(`URL: ${url}`);
            console.log(`Play Time: ${playTime} seconds`);
            console.log(`Thumbnail: ${thumbnail}`);
            console.log(`Datetime: ${datetime}`);
            console.log(`Author: ${author}`);
            console.log('-'.repeat(40));
        });
    })
    .catch(error => {
        console.error(`Error Code: ${error.response?.status || error.message}`);
    });
