// npm install puppeteer

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
