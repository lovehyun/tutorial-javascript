const axios = require('axios');

// API 요청을 보낼 URL과 파라미터
const url = 'http://api.openweathermap.org/data/2.5/weather';
const params = {
    q: 'Seoul',         // 도시 이름
    appid: 'YOUR_API_KEY' // 사용자의 API 키
};

// GET 요청 보내기
axios.get(url, { params })
    .then(response => {
        if (response.status === 200) {
            // JSON 데이터 가져오기
            const weatherData = response.data;

            // 필요한 정보 추출
            const cityName = weatherData.name;
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            // 결과 출력
            console.log(`도시: ${cityName}`);
            console.log(`온도: ${temperature} K`);
            console.log(`날씨: ${description}`);
        }
    })
    .catch(error => {
        // 에러 처리
        if (error.response) {
            // 서버에서 응답을 받은 경우
            console.error("요청 실패:", error.response.status, error.response.data);
        } else if (error.request) {
            // 요청이 전송되었으나 응답을 받지 못한 경우
            console.error("응답 없음:", error.request);
        } else {
            // 요청 설정 중에 문제가 발생한 경우
            console.error("요청 설정 오류:", error.message);
        }
    });
