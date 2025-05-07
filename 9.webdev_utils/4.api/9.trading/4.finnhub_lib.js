require('dotenv').config();
const finnhub = require('finnhub');

// Finnhub API 클라이언트 설정
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;

const finnhubClient = new finnhub.DefaultApi();

// 애플 현재 시세
finnhubClient.quote('AAPL', (error, data) => {
    if (error) {
        console.error('quote 오류:', error.message);
    } else {
        console.log('\n현재 애플(AAPL) 주가:');
        console.log(`- 현재가: $${data.c}`);
        console.log(`- 고가: $${data.h}, 저가: $${data.l}`);
        console.log(`- 전일 종가: $${data.pc}`);
    }
});

// 애플 프로파일 (회사 정보)
finnhubClient.companyProfile2({ symbol: 'AAPL' }, (error, data) => {
    if (error) {
        console.error('profile 오류:', error.message);
    } else {
        console.log('\n회사 정보:');
        console.log(`- 이름: ${data.name}`);
        console.log(`- 산업: ${data.finnhubIndustry}`);
        console.log(`- 웹사이트: ${data.weburl}`);
    }
});

// 애플 재무 비율
finnhubClient.companyBasicFinancials('AAPL', 'all', (error, data) => {
    if (error) {
        console.error('재무 정보 오류:', error.message);
    } else {
        console.log('\n기본 재무 지표:');
        const metrics = data.metric;
        // console.log(Object.keys(metrics));

        console.log(`- Gross Margin (TTM): ${metrics.grossMarginTTM} %`);
        console.log(`- Net Profit Margin (TTM): ${metrics.netProfitMarginTTM} %`);
        console.log(`- Long-Term Debt/Equity: ${metrics['longTermDebt/equityQuarterly']} %`);
        console.log(`- EPS Growth YoY: ${metrics.epsGrowthTTMYoy} %`);
        console.log(`- Dividend Yield: ${metrics.dividendYieldIndicatedAnnual} %`);
        console.log(`- PER (TTM): ${metrics.peTTM}`);
        console.log(`- PBR (Quarterly): ${metrics.pbQuarterly}`);
    }
});

// 뉴스 (최근 7일)
const today = new Date();
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);

const format = (date) => date.toISOString().split('T')[0];

finnhubClient.companyNews('AAPL', format(sevenDaysAgo), format(today), (error, data) => {
    if (error) {
        console.error('news 오류:', error.message);
    } else {
        console.log('\n최근 뉴스 (7일 이내):');
        data.slice(0, 3).forEach((news, i) => {
            console.log(`- [${news.datetime}] ${news.headline}`);
            console.log(`  ${news.url}`);
        });
    }
});
