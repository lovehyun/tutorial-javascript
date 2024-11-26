require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// .env 파일에서 REST API 키 가져오기
const REST_API_KEY = process.env.KAKAO_RESTAPI_KEY;

// 검색할 텍스트
const query = "아이유";

// API 요청 URL 및 헤더 설정
const url = "https://dapi.kakao.com/v2/search/image";
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
            const collection = item.collection;
            const thumbnailUrl = item.thumbnail_url;
            const imageUrl = item.image_url;
            const width = item.width;
            const height = item.height;
            const displaySitename = item.display_sitename;
            const docUrl = item.doc_url;
            const datetime = item.datetime;

            console.log(`Collection: ${collection}`);
            console.log(`Thumbnail URL: ${thumbnailUrl}`);
            console.log(`Image URL: ${imageUrl}`);
            console.log(`Width: ${width}`);
            console.log(`Height: ${height}`);
            console.log(`Display Sitename: ${displaySitename}`);
            console.log(`Document URL: ${docUrl}`);
            console.log(`Datetime: ${datetime}`);
            console.log('-'.repeat(40));
        });
    })
    .catch(error => {
        console.error(`Error Code: ${error.response?.status || error.message}`);
    });
