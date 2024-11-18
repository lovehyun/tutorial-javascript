const axios = require('axios');

// GitHub 검색 API 엔드포인트 URL
const url = 'https://api.github.com/search/repositories';

// 검색할 키워드
const keyword = 'python scraping';

// API 쿼리 파라미터 설정
const params = {
    q: keyword
};

// API 호출
axios.get(url, { params })
    .then(response => {
        const data = response.data;

        // 검색 결과 확인
        if (data.items && data.items.length > 0) {
            const repositories = data.items;

            // 검색된 저장소 순회하며 출력
            repositories.forEach(repo => {
                const name = repo.name;
                const fullName = repo.full_name;
                const htmlUrl = repo.html_url;
                const description = repo.description || 'No description';

                console.log(`Repository Name: ${name}`);
                console.log(`Full Name: ${fullName}`);
                console.log(`URL: ${htmlUrl}`);
                console.log(`Description: ${description}`);
                console.log('-'.repeat(40));
            });
        } else {
            console.log("No repositories found.");
        }
    })
    .catch(error => {
        console.error("Error fetching data from GitHub API:", error.message);
    });
