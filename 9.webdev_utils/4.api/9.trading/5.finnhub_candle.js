const finnhub = require('finnhub');
const { DateTime } = require('luxon');
require('dotenv').config();

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

// 원하는 일 수 (최근 30일)
const DAYS = 30;

// 미국 동부시간 기준으로 "5일 전 장 마감" 시점을 끝점으로 설정 (403 방지)
const toET = DateTime.now()
    .setZone('America/New_York')
    .minus({ days: 5 }) // 데이터 확실히 있는 날
    .set({ hour: 16, minute: 0, second: 0 });

const to = Math.floor(toET.toSeconds());
const from = to - DAYS * 24 * 60 * 60;

// 요청
finnhubClient.stockCandles('AAPL', 'D', from, to, (error, data) => {
    if (error) {
        console.error('오류:', error.message);
        return;
    }

    if (data.s !== 'ok') {
        console.error('데이터 오류 또는 없음:', JSON.stringify(data));
        return;
    }

    console.log(`AAPL 최근 ${DAYS}일 일봉 데이터:`);
    data.t.forEach((timestamp, i) => {
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];
        console.log(`${date} - O: ${data.o[i]} H: ${data.h[i]} L: ${data.l[i]} C: ${data.c[i]} V: ${data.v[i]}`);
    });
});
