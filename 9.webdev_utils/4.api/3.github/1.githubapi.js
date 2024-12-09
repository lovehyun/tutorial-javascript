// https://docs.github.com/en/rest?apiVersion=2022-11-28
// https://docs.github.com/ko/rest?apiVersion=2022-11-28

const axios = require('axios');

// GitHub 사용자 정보 가져오기
const username = 'lovehyun'; // 원하는 GitHub 사용자 이름
const url = `https://api.github.com/users/${username}`;

axios.get(url)
    .then(response => {
        console.log("사용자 정보:", response.data);
    })
    .catch(error => {
        console.error("에러 발생:", error.message);
    });

const fetchGitHubUserInfo = async () => {
    try {
        const response = await axios.get(url);
        console.log("사용자 정보:", response.data);
    } catch (error) {
        console.error("에러 발생:", error.message);
    }
};

// 함수 호출
// fetchGitHubUserInfo();
