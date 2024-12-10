const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function seleniumWikipediaSummary() {
    // 1. WebDriver 생성 (헤드리스 모드 설정)
    let options = new chrome.Options();
    options.addArguments('--headless'); // 헤드리스 모드 활성화
    options.addArguments('--disable-gpu'); // GPU 비활성화 (Linux 권장 옵션)

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // 2. Wikipedia 페이지 열기 (영어)
        await driver.get('https://en.wikipedia.org/');

        // 3. 검색창 찾기
        let searchBox = await driver.findElement(By.id('searchInput'));

        // 4. 검색어 입력 및 Enter 키 누르기
        await searchBox.sendKeys('Selenium (software)', Key.RETURN);

        // 5. 검색 결과 대기
        await driver.wait(until.elementLocated(By.id('mw-content-text')), 5000);

        // 6. 본문 첫 번째 문단 (요약 내용)
        const paragraphs = await driver.findElements(By.css('div#mw-content-text > div.mw-parser-output > p'));

        let summary = '';
        for (let p of paragraphs) {
            summary = await p.getText();
            if (summary.trim().length > 0) break; // 빈 문단이 아니면 가져오기
        }

        console.log('Summary:', summary);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await driver.quit();
    }
})();
