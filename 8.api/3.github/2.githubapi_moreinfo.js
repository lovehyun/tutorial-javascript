const axios = require('axios');

// GitHub API 엔드포인트 URL
const url = 'https://api.github.com/users/lovehyun/repos';

// 현재 날짜와 한 달 전 날짜 계산
const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setDate(today.getDate() - 30);
const oneMonthAgoISO = oneMonthAgo.toISOString();

// 데이터 가져오기
axios.get(url)
    .then(response => {
        const data = response.data;

        // 1. 데이터 파싱 및 상세 정보 출력
        console.log(`${'Name'.padEnd(20)} ${'URL'.padEnd(50)} ${'Description'.padEnd(30)} ${'Owner'.padEnd(20)} ${'Language'.padEnd(15)} ${'Stars'.padEnd(7)} ${'Forks'.padEnd(7)} ${'Default Branch'.padEnd(15)} ${'Created At'.padEnd(25)} ${'Updated At'.padEnd(25)}`);
        console.log('-'.repeat(180));

        data.forEach(repo => {
            const name = repo.name;
            const htmlUrl = repo.html_url;
            const description = repo.description || "";
            const owner = repo.owner.login;
            const language = repo.language || "N/A";
            const stargazersCount = repo.stargazers_count;
            const forksCount = repo.forks_count;
            const defaultBranch = repo.default_branch;
            const createdAt = repo.created_at;
            const updatedAt = repo.updated_at;

            console.log(`${name.padEnd(20)} ${htmlUrl.padEnd(50)} ${description.padEnd(30)} ${owner.padEnd(20)} ${language.padEnd(15)} ${String(stargazersCount).padEnd(7)} ${String(forksCount).padEnd(7)} ${defaultBranch.padEnd(15)} ${createdAt.padEnd(25)} ${updatedAt.padEnd(25)}`);
        });

        // 2. 특정 필드별로 데이터를 그룹화하여 출력
        console.log("\n스타가 많은 레포지토리들:");
        const starThreshold = 50;
        data.forEach(repo => {
            if (repo.stargazers_count > starThreshold) {
                console.log(`${repo.name}: ${repo.stargazers_count} stars`);
            }
        });

        console.log("\n최근 한 달간 업데이트된 레포지토리들:");
        data.forEach(repo => {
            if (repo.updated_at > oneMonthAgoISO) {
                console.log(`${repo.name}: Last updated at ${repo.updated_at}`);
            }
        });
    })
    .catch(error => {
        console.error("Error fetching data from GitHub API:", error.message);
    });
