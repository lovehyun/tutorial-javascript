const axios = require('axios');

// 사용자 이름과 GitHub API URL
const username = 'lovehyun'; // 원하는 GitHub 사용자 이름
const url = `https://api.github.com/users/${username}/repos`;

// 현재 날짜 계산
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

// GitHub API 요청 함수
async function getRepositories() {
    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const repos = response.data;

            // 전체 리포지토리 출력
            console.log(`\n${username}의 전체 리포지토리 목록:`);
            repos.forEach(repo => {
                console.log(`- ${repo.name} (Stars: ${repo.stargazers_count})`);
            });

            // 스타가 많은 리포지토리 (내림차순 정렬 후 상위 5개)
            const topStarredRepos = repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5);

            console.log(`\n스타가 많은 리포지토리 (Top 5):`);
            topStarredRepos.forEach(repo => {
                console.log(`- ${repo.name} (Stars: ${repo.stargazers_count})`);
            });

            // 최근 한 달 내 업데이트된 리포지토리
            const recentlyUpdatedRepos = repos.filter(repo => {
                const updatedAt = new Date(repo.updated_at);
                return updatedAt >= oneMonthAgo;
            });

            console.log(`\n최근 한 달 내 업데이트된 리포지토리:`);
            recentlyUpdatedRepos.forEach(repo => {
                console.log(`- ${repo.name} (Last Updated: ${repo.updated_at})`);
            });
        } else {
            console.error("요청 실패: 상태 코드", response.status);
        }
    } catch (error) {
        console.error("에러 발생:", error.message);
    }
}

// 실행
getRepositories();
