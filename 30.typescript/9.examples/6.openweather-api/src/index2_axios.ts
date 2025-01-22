// Axios를 사용한 TypeScript 버전
// npm install axios
// npm install --save-dev @types/axios

import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const API_KEY: string | undefined = process.env.API_KEY;

if (!API_KEY) {
    throw new Error('API_KEY is not defined in the .env file');
}

const CITY: string = 'Seoul';
const URL: string = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;

// API 응답 타입 정의
interface Weather {
    description: string;
}

interface WeatherResponse {
    weather: Weather[];
}

async function getWeather(): Promise<void> {
    try {
        console.log(`Fetching weather data from: ${URL}`);

        // AxiosResponse를 활용한 타입 안전성 제공
        const response: AxiosResponse<WeatherResponse> = await axios.get<WeatherResponse>(URL);

        // HTTP 상태 코드 확인
        if (response.status !== 200) {
            console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
            throw new Error('Failed to fetch weather data');
        }

        const data: WeatherResponse = response.data;
        console.log(`Weather in ${CITY}:`, data.weather[0].description);
    } catch (error: unknown) { // 명시적으로 unknown 타입 지정
        // 타입 가드로 error를 판별
        // unknown은 TypeScript에서 any보다 안전한 타입으로, 실제로 사용할 때는 타입을 확인해야 합니다.
        
        // 오류 처리
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.message);
        } else if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

getWeather();
