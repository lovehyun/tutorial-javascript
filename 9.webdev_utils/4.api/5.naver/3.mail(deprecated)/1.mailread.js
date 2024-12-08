const axios = require('axios');
require('dotenv').config();

// 환경 변수에서 Client ID, Secret 및 Redirect URI 가져오기
const clientId = process.env.NAVER_CLIENT_ID;
const clientSecret = process.env.NAVER_CLIENT_SECRET;
const redirectUri = process.env.NAVER_REDIRECT_URI; // OAuth 인증에 사용

// 네이버 메일 API 엔드포인트
const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
const mailUrl = 'https://openapi.naver.com/v1/mailbox';

async function getAccessToken(code) {
    try {
        const response = await axios.post(tokenUrl, null, {
            params: {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code: code, // OAuth 인증 후 받은 code
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getMailList(accessToken) {
    try {
        const response = await axios.get(mailUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Mail List:', response.data);
    } catch (error) {
        console.error('Error fetching mail list:', error.response ? error.response.data : error.message);
    }
}

// 실행 예제
(async () => {
    try {
        // OAuth 인증 후 네이버에서 받은 인증 코드
        const authCode = 'YOUR_AUTHORIZATION_CODE';

        // 액세스 토큰 가져오기
        const accessToken = await getAccessToken(authCode);

        // 메일 목록 가져오기
        await getMailList(accessToken);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
