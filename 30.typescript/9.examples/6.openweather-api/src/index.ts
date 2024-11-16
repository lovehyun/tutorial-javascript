// node-fetch 는 ESM(ES Module) 만 지원함 - package.json 에 "type":"module" 추가 및 tsconfig.json 파일 수정 "module": "ESNext"

// ts-node src/index.ts는 기본적으로 CommonJS 모드에서 실행되며, ESM 환경을 지원하지 않습니다.
// node --loader ts-node/esm는 Node.js에서 TypeScript를 ESM 모드로 실행하기 위한 설정입니다. 이는 ESM 전용 라이브러리(node-fetch)를 사용하는 TypeScript 프로젝트에서 필요합니다.
// node-fetch를 2.x로 다운그레이드하면 이전처럼 ts-node src/index.ts로 실행할 수 있습니다.

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const API_KEY = process.env.API_KEY; // .env 파일에서 API 키 가져오기
const CITY = 'Seoul';
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;

// API 응답 타입 정의
interface WeatherResponse {
    weather: { description: string }[];
}

async function getWeather() {
    try {
        console.log(`Fetching weather data from: ${URL}`);
        const response = await fetch(URL);

        // HTTP 상태 코드 확인
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
            throw new Error('Failed to fetch weather data');
        }
        
        // Cast the response as WeatherResponse
        // const data: WeatherResponse = await response.json();
        
        // response.json() 의 기본 반환 타입이 unknown 이라 TypeAssertion 사용해서 강제 변환해야 함
        // const data = (await response.json()) as WeatherResponse;
        // 또는 제네릭을 사용해서 변환해야 함.
        // const data = await response.json<WeatherResponse>();

        const data = (await response.json()) as WeatherResponse;
        console.log(`Weather in ${CITY}:`, data.weather[0].description);
    } catch (error) {
        // 오류 처리
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

getWeather();
