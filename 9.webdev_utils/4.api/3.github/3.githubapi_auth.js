require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// 환경 변수에서 Personal Access Token 가져오기
const token = process.env.GITHUB_TOKEN;
if (!token) {
    console.error("Personal Access Token이 설정되지 않았습니다. .env 파일을 확인하세요.");
    process.exit(1);
}

// GitHub API 요청 함수
async function getUserRepos(username) {
    const url = `https://api.github.com/users/${username}/repos`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${token}` // 인증 헤더 추가
            }
        });

        if (response.status === 200) {
            console.log(`\n${username}의 리포지토리 목록:`);
            response.data.forEach(repo => {
                console.log(`- ${repo.name} (Stars: ${repo.stargazers_count})`);
            });
        } else {
            console.error(`요청 실패: 상태 코드 ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
            console.error(`요청 실패: 상태 코드 ${error.response.status}`);
            console.error("응답 내용:", error.response.data);
        } else {
            console.error(`에러 발생: ${error.message}`);
        }
    }
}

// 특정 사용자 리포지토리 가져오기
getUserRepos('lovehyun');
