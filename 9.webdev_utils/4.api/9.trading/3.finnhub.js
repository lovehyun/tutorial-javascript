// https://finnhub.io/docs/api

const axios = require('axios');
const { DateTime } = require('luxon'); // npm install luxon
require('dotenv').config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';
const SYMBOL = 'TSLA'; // AAPL, MSFT, TSLA, GOOG 등으로 변경


// 현재 가격 가져오기
async function getCurrentPrice() {
    const url = `${BASE_URL}/quote?symbol=${SYMBOL}&token=${FINNHUB_API_KEY}`;
    const res = await axios.get(url);
    return res.data;
}

// 미국장 전날 마감(16:00 ET) 기준으로 from/to 계산하여 캔들 데이터 가져오기
async function getHistoricalPrices(days) {
    const toET = DateTime.now().setZone('America/New_York')
        .minus({ days: 1 })
        .set({ hour: 16, minute: 0, second: 0 });

    const to = Math.floor(toET.toUTC().toSeconds());
    const from = to - days * 24 * 60 * 60;

    const url = `${BASE_URL}/stock/candle?symbol=${SYMBOL}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
    console.log('요청 URL:', url);

    const res = await axios.get(url);
    if (res.data.s !== 'ok') {
        throw new Error(`Finnhub 응답 오류: ${JSON.stringify(res.data)}`);
    }

    return res.data;
}

async function getLastCompleteDayPrice() {
    const toET = DateTime.now().setZone('America/New_York')
        .minus({ days: 2 }) // 장 마감 완료된 날짜
        .set({ hour: 16, minute: 0, second: 0 });

    const to = Math.floor(toET.toUTC().toSeconds());
    const from = to - 24 * 60 * 60;

    const url = `${BASE_URL}/stock/candle?symbol=${SYMBOL}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
    console.log('어제 데이터 요청 URL:', url);

    const res = await axios.get(url);
    if (res.data.s !== 'ok') {
        throw new Error(`어제 시세 가져오기 실패: ${JSON.stringify(res.data)}`);
    }

    return res.data;
}

// 실행 함수
(async () => {
    try {
        console.log('현재 애플 주가 조회 중...');
        const current = await getCurrentPrice();
        console.log(`현재 가격: $${current.c} (고가: $${current.h}, 저가: $${current.l})`);

        console.log('\n어제 하루치 가격:');
        const yesterday = await getLastCompleteDayPrice();
        const date = new Date(yesterday.t[0] * 1000).toISOString().split('T')[0];
        console.log(`${date} - 시가: $${yesterday.o[0]}, 고가: $${yesterday.h[0]}, 저가: $${yesterday.l[0]}, 종가: $${yesterday.c[0]}`);

        console.log('\n최근 7일치 가격:');
        const history7 = await getHistoricalPrices(7);
        history7.t.forEach((timestamp, i) => {
            const date = new Date(timestamp * 1000).toISOString().split('T')[0];
            console.log(`${date} - 종가: $${history7.c[i]}`);
        });

        console.log('\n최근 30일치 가격:');
        const history30 = await getHistoricalPrices(30);
        history30.t.forEach((timestamp, i) => {
            const date = new Date(timestamp * 1000).toISOString().split('T')[0];
            console.log(`${date} - 종가: $${history30.c[i]}`);
        });

    } catch (err) {
        console.error('오류 발생:', err.message);
    }
})();
