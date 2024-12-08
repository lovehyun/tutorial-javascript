const { Builder, By, Key, until } = require('selenium-webdriver');

(async function seleniumWikipediaExample() {
    // 1. WebDriver 생성
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 2. Wikipedia 페이지 열기
        await driver.get('https://en.wikipedia.org/');

        // 3. 페이지 제목 출력
        let title = await driver.getTitle();
        console.log('Page Title:', title);

        // 4. 검색창 찾기
        let searchBox = await driver.findElement(By.id('searchInput'));

        // 5. 검색어 입력 및 Enter 키 누르기
        await searchBox.sendKeys('Selenium (software)', Key.RETURN);

        // 6. 검색 결과 대기
        await driver.wait(until.elementLocated(By.id('firstHeading')), 5000);

        // 7. 검색 결과 제목 출력
        let heading = await driver.findElement(By.id('firstHeading')).getText();
        console.log('Result Title:', heading);

        // 8. 현재 페이지 URL 출력
        let currentUrl = await driver.getCurrentUrl();
        console.log('Current URL:', currentUrl);

        // 9. 본문 내용 출력
        let content = await driver.findElement(By.css('div#mw-content-text')).getText();
        // console.log('Page Content:');
        // console.log(content);

        // 9-1. 본문 첫 번째 문단 (요약 내용만...)
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
        // 9. 브라우저 닫기
        await driver.quit();
    }
})();
