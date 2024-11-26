// https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide

require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// .env 파일에서 REST API 키 가져오기
const REST_API_KEY = process.env.KAKAO_RESTAPI_KEY;

// 검색할 텍스트
const query = "아이유";

// API 요청 URL 및 헤더 설정
const url = "https://dapi.kakao.com/v2/search/web";
const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`
};

// 페이지 수 설정
const totalPages = 3;

// 요청 파라미터 설정
const params = {
    query: query,
    sort: "accuracy", // 정확도순 정렬
    size: 10          // 10개의 문서
};

// 비동기 함수로 구현
async function fetchSearchResults() {
    for (let page = 1; page <= totalPages; page++) {
        params.page = page; // 현재 페이지 설정

        try {
            const response = await axios.get(url, { headers, params });
            const data = response.data;

            // 검색 결과 출력
            console.log(`Page ${page}`);
            console.log(`Total Count: ${data.meta.total_count}`);
            console.log(`Pageable Count: ${data.meta.pageable_count}`);
            console.log(`Is End: ${data.meta.is_end}`);
            console.log('-'.repeat(40));

            // 검색 결과 문서 출력
            data.documents.forEach(item => {
                const title = item.title.replace(/<b>/g, "").replace(/<\/b>/g, "");
                const url = item.url;
                const contents = item.contents.replace(/<b>/g, "").replace(/<\/b>/g, "");
                const datetime = item.datetime;

                console.log(`Title: ${title}`);
                console.log(`URL: ${url}`);
                console.log(`Contents: ${contents}`);
                console.log(`Datetime: ${datetime}`);
                console.log('-'.repeat(40));
            });

        } catch (error) {
            console.error(`Error Code: ${error.response?.status || error.message}`);
            break; // 에러 발생 시 반복 중단
        }
    }
}

// 함수 호출
fetchSearchResults();
