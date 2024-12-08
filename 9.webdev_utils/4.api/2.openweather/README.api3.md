
# OpenWeatherMap One Call API v3.0 예제 (Node.js)

## 개요
이 예제는 OpenWeatherMap의 **One Call API v3.0**을 사용하여 Node.js와 `axios`를 통해 특정 위치의 현재 날씨와 일별 날씨 예보를 가져오는 방법을 보여줍니다.

---

## 코드 예제

```javascript
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
            console.log(\`현재 온도: \${currentTemp}°C\`);
            console.log(\`현재 날씨: \${currentDescription}\`);
            console.log(\`최고 온도: \${maxTemp}°C\`);
            console.log(\`최저 온도: \${minTemp}°C\`);
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
```

---

## v3.0에서 변경된 주요 사항

### 1. URL 변경
URL이 `v2.5`에서 `v3.0`으로 업데이트되었습니다:
```javascript
const url = 'https://api.openweathermap.org/data/3.0/onecall';
```

### 2. 위도와 경도 사용
`q`(도시 이름) 대신 `lat`(위도)와 `lon`(경도)를 사용합니다:
```javascript
lat: 37.5665,  // 서울의 위도
lon: 126.9780, // 서울의 경도
```

### 3. 데이터 제외
`exclude` 파라미터를 사용하여 불필요한 데이터를 제외하고 응답 크기를 줄일 수 있습니다:
```javascript
exclude: 'minutely,hourly'
```

### 4. 온도 단위
`units` 파라미터를 통해 온도 단위를 설정할 수 있습니다:
- `metric`: 섭씨
- `imperial`: 화씨
- 기본값: Kelvin

예제:
```javascript
units: 'metric'
```

### 5. 데이터 구조
- 현재 날씨: `weatherData.current`
- 일별 날씨: `weatherData.daily`

---

## 출력 예제

```
현재 온도: 10.5°C
현재 날씨: 맑음
최고 온도: 15.2°C
최저 온도: 8.1°C
```

---

## 참고 사항

- 유효한 OpenWeatherMap API 키가 필요합니다. `'YOUR_API_KEY'`를 실제 API 키로 교체하세요.
- 특정 도시의 위도와 경도를 얻으려면 OpenWeatherMap의 [Geocoding API](https://openweathermap.org/api/geocoding-api)를 사용할 수 있습니다.

---

## 참고 링크

- [OpenWeatherMap One Call API 3.0 문서](https://openweathermap.org/api/one-call-3)
- [Geocoding API 문서](https://openweathermap.org/api/geocoding-api)
