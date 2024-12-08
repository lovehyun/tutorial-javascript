const axios = require('axios');

// GitHub 검색 API 엔드포인트 URL
const url = 'https://api.github.com/search/repositories';

// 검색할 키워드
const keyword = 'python scraping';

// 검색 결과를 저장할 배열
const allRepositories = [];

// 최대 검색 페이지 수
const maxPages = 3;

const fetchRepositories = async () => {
    try {
        for (let page = 1; page <= maxPages; page++) {
            // API 쿼리 파라미터 설정
            const params = {
                q: keyword,
                page: page
            };

            // API 호출
            const response = await axios.get(url, { params });
            const data = response.data;

            // 검색 결과 확인
            if (data.items && data.items.length > 0) {
                allRepositories.push(...data.items);
            } else {
                console.log(`No repositories found on page ${page}`);
                break;
            }
        }

        // 모든 검색 결과 출력
        allRepositories.forEach((repo, index) => {
            const name = repo.name;
            const fullName = repo.full_name;
            const htmlUrl = repo.html_url;
            const description = repo.description || 'No description';

            console.log(`Index: ${index + 1}`);
            console.log(`Repository Name: ${name}`);
            console.log(`Full Name: ${fullName}`);
            console.log(`URL: ${htmlUrl}`);
            console.log(`Description: ${description}`);
            console.log('-'.repeat(40));
        });
    } catch (error) {
        console.error("Error fetching data from GitHub API:", error.message);
    }
};

// 실행
fetchRepositories();
