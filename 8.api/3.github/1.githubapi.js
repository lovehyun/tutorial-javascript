const axios = require('axios');

// GitHub API 엔드포인트 URL
const url = 'https://api.github.com/users/lovehyun/repos';

// API로부터 데이터 가져오기
axios.get(url)
    .then(response => {
        const data = response.data;

        // 1. 데이터 파싱 및 출력
        console.log("Repositories:");
        data.forEach(repo => {
            const name = repo.name;
            const html_url = repo.html_url;
            const description = repo.description || 'No description'; // 설명이 없을 경우 기본값 설정
            console.log(`Repository Name: ${name}`);
            console.log(`URL: ${html_url}`);
            console.log(`Description: ${description}`);
            console.log('-'.repeat(40));
        });

        // 2. 데이터 파싱 및 테이블 형태로 출력
        console.log(`\n${'Name'.padEnd(30)} ${'Full Name'.padEnd(50)} ${'Private'.padEnd(10)}`);
        console.log('-'.repeat(90));

        data.forEach(repo => {
            const name = repo.name;
            const fullName = repo.full_name;
            const isPrivate = repo.private;
            console.log(`${name.padEnd(30)} ${fullName.padEnd(50)} ${String(isPrivate).padEnd(10)}`);
        });
    })
    .catch(error => {
        console.error("Error fetching data from GitHub API:", error.message);
    });
