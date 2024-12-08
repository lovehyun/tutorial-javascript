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
