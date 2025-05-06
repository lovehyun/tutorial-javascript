// npm install yahoo-finance2
const yahooFinance = require('yahoo-finance2').default;

yahooFinance.suppressNotices(['yahooSurvey']);

async function getStockPrice(ticker) {
    try {
        const quote = await yahooFinance.quote(ticker);
        console.log(`${quote.shortName} (${ticker})`);
        console.log(`현재가: ${quote.regularMarketPrice} ${quote.currency}`);
        console.log(`전일 대비: ${quote.regularMarketChange} (${quote.regularMarketChangePercent}%)`);
        console.log('-----------------------------');
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
}

// getStockPrice('005930.KQ'); // 삼성전자

const tickers = ['005930.KS', '035420.KS', '035720.KS']; // 삼성전자, 네이버, 카카오
tickers.forEach(getStockPrice);
