// utils/config.js
export const KAKAO_RESTAPI_KEY = process.env.REACT_APP_KAKAO_RESTAPI_KEY;

// API 요청을 백엔드로 보낼지, 카카오 API로 직접 보낼지 설정 (기본값: false, 카카오로 직접 보냄)
export const USE_BACKEND = process.env.REACT_APP_USE_BACKEND === "true";
console.log(USE_BACKEND);
// 백엔드 URL
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// 카카오 API URL
export const KAKAO_API_URLS = {
    web: 'https://dapi.kakao.com/v2/search/web',
    image: 'https://dapi.kakao.com/v2/search/image',
    vclip: 'https://dapi.kakao.com/v2/search/vclip',
};
