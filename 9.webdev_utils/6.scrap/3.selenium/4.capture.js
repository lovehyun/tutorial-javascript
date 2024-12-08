const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

(async function seleniumSavePage() {
    // 저장 폴더 생성
    const outputDir = path.resolve(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
        console.log(`Output directory created: ${outputDir}`);
    }

    // PDF 프린팅 설정
    const CHROME_PREFS = {
        'printing.print_preview_sticky_settings.appState': JSON.stringify({
            version: 2,
            isHeaderFooterEnabled: false,
            marginsType: 1,
            pageSize: 'A4',
            isCssBackgroundEnabled: true,
            scalingTypePdf: 3, // PDF 크기 조정 옵션
        }),
        'savefile.default_directory': outputDir, // PDF 저장 디렉토리
    };

    // 해상도 설정
    const resolutions = [
        { name: 'default', width: 800, height: 600 }, // 기본 해상도
        { name: 'pc', width: 1920, height: 1080 },    // PC 해상도
        { name: 'mobile', width: 375, height: 667 }, // 모바일 해상도
    ];


    // 브라우저 옵션 설정
    const options = new chrome.Options();
    options.addArguments('--kiosk-printing'); // PDF 프린팅 활성화
    options.addArguments('--headless'); // 헤드리스 모드 활성화
    options.addArguments('--disable-gpu'); // GPU 비활성화 (Linux 권장 옵션)
    options.setUserPreferences(CHROME_PREFS);

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        for (const resolution of resolutions) {
            console.log(`Processing resolution: ${resolution.name}`);

            // 해상도 변경
            await driver.manage().window().setRect({
                width: resolution.width,
                height: resolution.height,
            });

            // 페이지 열기
            const url = 'https://en.wikipedia.org/wiki/Selenium_(software)';
            await driver.get(url);

            // 추가 대기 (동적 콘텐츠 로드)
            await driver.sleep(3000); // 3초 대기

            // PDF 저장 (FIXME: 잘 동작 안함)
            const pdfPath = path.join(outputDir, `output_${resolution.name}.pdf`);
            await driver.executeScript('window.print();');
            console.log(`PDF saved: ${pdfPath}`);

            // JPG 저장
            const screenshot = await driver.takeScreenshot();
            const jpgPath = path.join(outputDir, `output_${resolution.name}.jpg`);
            fs.writeFileSync(jpgPath, screenshot, 'base64');
            console.log(`JPG saved: ${jpgPath}`);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await driver.quit();
    }
})();
