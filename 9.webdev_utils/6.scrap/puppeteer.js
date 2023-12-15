// npm install puppeteer
// Puppeteer는 Chrome이나 Chromium 브라우저를 제어하여 웹 페이지를 스크래핑하거나 자동화하는 데 사용됩니다. 
// 주로 웹 페이지 스크린샷을 찍거나 페이지의 DOM을 조작하는 등의 작업을 수행할 수 있습니다.

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new', // 'new' 값을 사용하여 새로운 Headless 모드로 설정
    });
    const page = await browser.newPage();

    await page.goto('https://example.com');

    // 여기서 Puppeteer를 사용하여 필요한 데이터 추출
    const title = await page.title();
    console.log('페이지 제목:', title);

    await browser.close();
})();
