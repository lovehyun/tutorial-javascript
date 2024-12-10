const puppeteer = require('puppeteer');

(async () => {
    const url = 'https://en.wikipedia.org/wiki/Selenium_(software)';

    // PC 및 모바일 해상도 설정
    const resolutions = [
        { name: 'default', width: 800, height: 600 }, // 기본 해상도
        { name: 'pc', width: 1920, height: 1080 },    // PC 해상도
        { name: 'mobile', width: 375, height: 667 }, // 모바일 해상도
    ];

    // 브라우저 시작 (헤드리스 모드)
    const browser = await puppeteer.launch({ headless: true });

    try {
        for (const resolution of resolutions) {
            console.log(`Processing resolution: ${resolution.name}`);

            const page = await browser.newPage();

            // 해상도 설정
            await page.setViewport({
                width: resolution.width,
                height: resolution.height,
                deviceScaleFactor: 1,
            });

            // 페이지 열기
            await page.goto(url, { waitUntil: 'networkidle2' });

            // 추가 대기 (3초)
            // await page.waitForTimeout(3000); // 동적 콘텐츠 로드 대기

            // PDF 저장
            const pdfPath = `output_${resolution.name}.pdf`;
            await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true,
            });
            console.log(`PDF saved: ${pdfPath}`);

            // JPG 저장
            const jpgPath = `output_${resolution.name}.jpg`;
            await page.screenshot({
                path: jpgPath,
                type: 'jpeg',
                quality: 80,
                fullPage: true,
            });
            console.log(`JPG saved: ${jpgPath}`);

            await page.close();
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await browser.close();
    }
})();
