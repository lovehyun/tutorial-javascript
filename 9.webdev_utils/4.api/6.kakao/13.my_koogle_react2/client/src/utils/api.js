// utils/api.js
import { KAKAO_RESTAPI_KEY, USE_BACKEND, BACKEND_URL, KAKAO_API_URLS } from './config';

// 공통 API 호출 함수
export const fetchResults = async (query, type, page) => {
    if (USE_BACKEND) {
        // 백엔드를 통해 요청
        console.log('백엔드!!');
        return fetchBackendResults(query, type, page);
    } else {
        console.log('직접!');
        // 카카오 API에 직접 요청
        return fetchDirectResults(query, type, page);
    }
};

// 백엔드 요청
const fetchBackendResults = async (query, type, page) => {
    const response = await fetch(`${BACKEND_URL}/api/search2?query=${query}&type=${type}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch results from backend');
    return response.json();
};

// 카카오 API 직접 요청
const fetchDirectResults = async (query, type, page) => {
    const apiUrl = KAKAO_API_URLS[type];
    if (!apiUrl) throw new Error('Invalid search type');

    const response = await fetch(`${apiUrl}?query=${encodeURIComponent(query)}&page=${page}&size=10&sort=accuracy`, {
        headers: {
            Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`,
        },
    });
    if (!response.ok) throw new Error('Failed to fetch results from Kakao API');
    return response.json();
};
