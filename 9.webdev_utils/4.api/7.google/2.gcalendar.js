const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config({ path: '.env' });

// OAuth2 클라이언트 설정
const CLIENT_ID = process.env.GOOGLE_DESKTOP_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DESKTOP_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// 권한 요청 URL
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

console.log('아래 URL을 브라우저에서 열어 인증 코드를 가져오세요:');
console.log(authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 인증 코드 입력
rl.question('인증 코드를 입력하세요: ', async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log('Access Token을 성공적으로 받았습니다.');

        // Google Calendar API 클라이언트 생성
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // 오늘 날짜로 일정 생성
        const now = new Date();
        const event = {
            summary: 'Test Event',
            description: 'This is a test event.',
            start: {
                dateTime: now.toISOString(), // 시작 시간
                timeZone: 'Asia/Seoul',
            },
            end: {
                dateTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString(), // 종료 시간 (1시간 후)
                timeZone: 'Asia/Seoul',
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary', // 기본 캘린더
            resource: event,
        });

        console.log('일정이 성공적으로 추가되었습니다:', response.data);
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
    } finally {
        rl.close();
    }
});
