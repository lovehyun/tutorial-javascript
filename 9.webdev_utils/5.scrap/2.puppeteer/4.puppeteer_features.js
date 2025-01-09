const puppeteer = require('puppeteer');

(async () => {
    // Puppeteer를 일반 모드로 실행
    const browser = await puppeteer.launch({ headless: false });

    // 새 페이지 열기
    const page = await browser.newPage();

    // 페이지 이동
    await page.goto('https://www.example.com');

    // 스크린샷 찍기
    await page.screenshot({ path: 'example.png' });

    // PDF로 저장
    await page.pdf({ path: 'example.pdf', format: 'A4' });

    // 브라우저 닫기
    await browser.close();
})();
