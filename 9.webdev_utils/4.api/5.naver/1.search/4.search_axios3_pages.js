const axios = require('axios');
require('dotenv').config(); // dotenv를 사용하여 환경 변수 로드

// 환경 변수에서 클라이언트 ID와 시크릿 가져오기
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

// 검색할 텍스트와 API URL
const text = '반갑습니다';
const url = 'https://openapi.naver.com/v1/search/blog';

// 요청 헤더 설정
const headers = {
    'X-Naver-Client-Id': client_id,
    'X-Naver-Client-Secret': client_secret,
};

// 다중 페이지 요청 함수
async function fetchMultiplePages(query, maxPages = 3) {
    let currentPage = 1;
    const resultsPerPage = 10; // 네이버 API의 기본 페이지당 출력 개수
    let start = 1; // 첫 번째 페이지의 시작 값
    const allResults = [];

    try {
        while (currentPage <= maxPages) {
            console.log(`Fetching page ${currentPage}...`);

            const params = {
                query: query,
                start: start,
                display: resultsPerPage,
            };

            const response = await axios.get(url, { headers, params });

            if (response.status === 200) {
                const data = response.data;
                console.log(`Page ${currentPage} results:`);

                data.items.forEach(item => {
                    const title = item.title.replace(/<[^>]+>/g, ''); // HTML 태그 제거
                    console.log(`- ${title}: ${item.link}`);
                    allResults.push(item); // 결과를 배열에 저장
                });

                // 다음 페이지로 이동
                start += resultsPerPage;
                currentPage++;
            } else {
                console.error(`Failed to fetch page ${currentPage}: ${response.status}`);
                break;
            }
        }

        console.log(`\nTotal Results Collected: ${allResults.length}`);
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.statusText : error.message);
    }
}

// 실행
fetchMultiplePages(text, 3);
