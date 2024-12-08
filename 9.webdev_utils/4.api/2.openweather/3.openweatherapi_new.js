// https://openweathermap.org/api/one-call-api
// 별도 구독 필요

const axios = require('axios');

// API 요청을 보낼 URL과 파라미터
const url = 'https://api.openweathermap.org/data/3.0/onecall';
const params = {
    lat: 37.5665,         // 서울의 위도
    lon: 126.9780,        // 서울의 경도
    appid: 'YOUR_API_KEY', // 사용자의 API 키
    units: 'metric',      // 섭씨 온도 사용 (기본값: Kelvin)
    exclude: 'minutely,hourly' // 제외할 데이터 (선택)
};

// GET 요청 보내기
axios.get(url, { params })
    .then(response => {
        if (response.status === 200) {
            // JSON 데이터 가져오기
            const weatherData = response.data;

            // 필요한 정보 추출
            const currentWeather = weatherData.current;
            const dailyWeather = weatherData.daily[0]; // 오늘의 날씨

            const currentTemp = currentWeather.temp; // 현재 온도
            const currentDescription = currentWeather.weather[0].description; // 현재 날씨 설명

            const maxTemp = dailyWeather.temp.max; // 최고 온도
            const minTemp = dailyWeather.temp.min; // 최저 온도

            // 결과 출력
            console.log(`현재 온도: ${currentTemp}°C`);
            console.log(`현재 날씨: ${currentDescription}`);
            console.log(`최고 온도: ${maxTemp}°C`);
            console.log(`최저 온도: ${minTemp}°C`);
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
