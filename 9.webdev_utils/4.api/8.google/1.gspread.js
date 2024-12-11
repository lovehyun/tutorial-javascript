const { google } = require('googleapis');
const path = require('path');

require('dotenv').config();

// 서비스 계정 JSON 키 파일 경로
// const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'path/to/your-service-account-key.json');
const SERVICE_ACCOUNT_FILE = path.join(__dirname, process.env.SERVICE_ACCOUNT_FILE);

// Google Sheets ID (스프레드시트 URL에서 ID 추출)
// https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVWxYz1234567890/edit#gid=0
// const SPREADSHEET_ID = 'your-spreadsheet-id';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// 인증 및 Google Sheets API 클라이언트 생성
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function main() {
    try {
        // 1. A1 셀에 데이터 쓰기
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1',
            valueInputOption: 'RAW',
            requestBody: {
                values: [['Hello, Google Sheets!']],
            },
        });
        console.log('Updated A1 cell.');

        // 2. A1 셀 데이터 읽기
        const readResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1',
        });
        console.log('Read A1 value:', readResponse.data.values?.[0]?.[0]);

        // 3. 여러 셀 업데이트
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A2:B5',
            valueInputOption: 'RAW',
            requestBody: {
                values: [
                    ['Name', 'Score'],
                    ['Alice', 95],
                    ['Bob', 88],
                    ['Charlie', 78],
                ],
            },
        });
        console.log('Updated A2:B5 range.');

        // 4. 여러 셀 읽기
        const rangeResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A2:B5',
        });
        console.log('Read range A2:B5:', rangeResponse.data.values);

        // 5. 행 추가
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A:B',
            valueInputOption: 'RAW',
            requestBody: {
                values: [['David', 82]],
            },
        });
        console.log('Appended a new row.');

    } catch (error) {
        console.error('Error interacting with Google Sheets:', error.message);
    }
}

main();
