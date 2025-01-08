// npm i puppeteer
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    // 5초 대기 후 브라우저 닫기
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await browser.close();
})();
