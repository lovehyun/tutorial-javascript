
# OpenWeatherMap API v2.5 사용법 (Node.js)

## 개요
OpenWeatherMap의 **API v2.5**를 사용하여 Node.js를 통해 날씨 데이터를 가져오는 방법을 설명합니다. v2.5는 현재 무료 계정으로 사용할 수 있는 버전입니다.

---

## 주요 엔드포인트

### 1. Current Weather Data
- **URL**: `http://api.openweathermap.org/data/2.5/weather`
- **기능**: 특정 도시, 위도/경도, 또는 도시 ID를 기준으로 현재 날씨 데이터를 제공합니다.

#### 요청 파라미터
| 파라미터       | 설명                                     | 필수 여부 |
|----------------|------------------------------------------|-----------|
| `q`            | 도시 이름 (예: `q=Seoul`)               | 선택 |
| `lat` / `lon`  | 위도와 경도                             | 선택 |
| `id`           | 도시 ID                                 | 선택 |
| `appid`        | OpenWeatherMap API 키                   | 필수 |
| `units`        | 온도 단위 (`metric`, `imperial`, `default`) | 선택 |
| `lang`         | 언어 설정 (예: `kr` = 한국어)           | 선택 |

### 2. 5 Day / 3 Hour Forecast
- **URL**: `http://api.openweathermap.org/data/2.5/forecast`
- **기능**: 5일 간의 3시간 단위 날씨 예보를 제공합니다.

### 3. Air Pollution
- **URL**: `http://api.openweathermap.org/data/2.5/air_pollution`
- **기능**: 위도와 경도를 기준으로 공기 오염 데이터를 제공합니다.

---

## 예제 코드

### 1. Current Weather Data (현재 날씨)

```javascript
require('dotenv').config();
const axios = require('axios');

// 환경 변수에서 API 키 가져오기
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
if (!apiKey) {
    console.error("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
    process.exit(1);
}

// 도시 이름으로 현재 날씨 데이터 가져오기
const city = "Seoul";
const url = 'http://api.openweathermap.org/data/2.5/weather';
const params = {
    q: city,
    appid: apiKey,
    units: 'metric', // 섭씨 온도
    lang: 'kr'       // 한국어
};

axios.get(url, { params })
    .then(response => {
        if (response.status === 200) {
            const data = response.data;
            console.log(`도시: ${data.name}`);
            console.log(`온도: ${data.main.temp} °C`);
            console.log(`날씨: ${data.weather[0].description}`);
        } else {
            console.error(`요청 실패: 상태 코드 ${response.status}`);
        }
    })
    .catch(error => {
        console.error("에러 발생:", error.message);
    });
```

---

## 참고 링크
- [Current Weather Data API](https://openweathermap.org/current)
- [5 Day / 3 Hour Forecast API](https://openweathermap.org/forecast5)
- [Air Pollution API](https://openweathermap.org/api/air-pollution)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [도시 ID 목록](http://bulk.openweathermap.org/sample/)

---

## 주의 사항
1. **API 키 발급**: OpenWeatherMap 계정에서 무료 API 키를 발급받아야 합니다.
2. **언어 설정**: `lang` 파라미터로 한국어를 포함한 다양한 언어를 설정할 수 있습니다.
3. **요청 제한**: 무료 계정은 분당 요청 횟수 제한이 있으니 주의하세요.

---

## .env 파일 예제
```
OPENWEATHERMAP_API_KEY=your_actual_api_key
```
