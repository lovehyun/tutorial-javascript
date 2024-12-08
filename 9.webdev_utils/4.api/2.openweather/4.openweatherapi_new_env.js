// https://openweathermap.org/api/one-call-api
// 별도 구독 필요

require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// 환경 변수에서 API 키 가져오기
const apiKey = process.env.OPENWEATHERMAP3_API_KEY;
if (!apiKey) {
    console.error("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
    process.exit(1);
}

// 서울의 좌표
const LAT = 37.5665;
const LON = 126.9780;

// One Call API v3.0 요청을 보낼 URL과 파라미터
const url = 'https://api.openweathermap.org/data/3.0/onecall';
const params = {
    lat: LAT,
    lon: LON,
    appid: apiKey,
    units: 'metric', // 섭씨로 결과를 얻기 위해 'metric' 사용
    lang: 'kr',      // 한국어로 결과를 얻기 위해 'kr' 사용
    exclude: 'minutely,hourly' // 제외할 데이터 지정
};

// GET 요청 보내기
axios.get(url, { params })
    .then(response => {
        // console.log("Response:", response.data);

        if (response.status === 200) {
            // JSON 데이터 가져오기
            const weatherData = response.data;

            // 현재 날씨 정보 추출
            const currentTemp = weatherData.current.temp; // 현재 온도
            const currentDescription = weatherData.current.weather[0].description; // 현재 날씨 설명

            // 오늘의 일별 날씨 정보 추출
            const today = weatherData.daily[0];
            const maxTemp = today.temp.max; // 최고 온도
            const minTemp = today.temp.min; // 최저 온도

            // 결과 출력
            console.log(`현재 온도: ${currentTemp} °C`);
            console.log(`현재 날씨: ${currentDescription}`);
            console.log(`오늘 최고 온도: ${maxTemp} °C`);
            console.log(`오늘 최저 온도: ${minTemp} °C`);
        } else {
            console.error(`요청에 실패하였습니다. 상태 코드: ${response.status}`);
        }
    })
    .catch(error => {
        if (error.response) {
            console.error("요청 실패:", error.response.status);
            console.error("응답 내용:", error.response.data);
        } else if (error.request) {
            console.error("응답이 없습니다. 요청 내용:", error.request);
        } else {
            console.error("요청 설정 중 오류:", error.message);
        }
    });
