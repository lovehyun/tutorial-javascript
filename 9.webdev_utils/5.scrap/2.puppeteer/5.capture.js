const puppeteer = require('puppeteer');

(async () => {
    const url = 'https://en.wikipedia.org/wiki/Selenium_(software)';

    // 단일 해상도 설정 (PC 해상도로 고정)
    const resolution = { name: 'pc', width: 1920, height: 1080 };

    // 브라우저 시작 (헤드리스 모드)
    const browser = await puppeteer.launch({ headless: true });
    // 브라우저 시작 시 해상도 설정 (PC 해상도로 고정)
    // const browser = await puppeteer.launch({
    //     headless: true,
    //     defaultViewport: {
    //         width: 1920,
    //         height: 1080,
    //         deviceScaleFactor: 1
    //     }
    // });

    try {
        console.log(`Processing resolution: ${resolution.name}`);

        const page = await browser.newPage();

        // 해상도 설정
        await page.setViewport({
            width: resolution.width,
            height: resolution.height,
            deviceScaleFactor: 1,
        });

        // 페이지 열기 (2개 이하의 네트워크 요청만 남을 때까지 대기.)
        // SPA(Single Page Applications)와 같은 동적 페이지에서 추가 리소스 로딩이 끝났을 때 사용.
        // 백그라운드 요청(예: 분석 데이터 전송)이 지속될 수 있어 이를 감안한 설정.
        await page.goto(url, { waitUntil: 'networkidle2' });

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
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await browser.close();
    }
})();
