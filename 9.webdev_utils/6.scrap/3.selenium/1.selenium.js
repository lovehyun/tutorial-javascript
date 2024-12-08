const { Builder, By, Key, until } = require('selenium-webdriver');

(async function seleniumBasic() {
    // 1. WebDriver 생성
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 2. Google 페이지 열기
        await driver.get('https://www.google.com');

        // 3. 페이지 제목 출력
        let title = await driver.getTitle();
        console.log('Page Title:', title);

        // 4. 검색창 찾기
        let searchBox = await driver.findElement(By.name('q'));

        // 5. 검색어 입력 및 Enter 키 누르기
        await searchBox.sendKeys('Selenium Node.js tutorial', Key.RETURN);

        // 6. 검색 결과 대기
        await driver.wait(until.elementLocated(By.css('div.g')), 5000);

        // 7. 검색 결과 출력
        let results = await driver.findElements(By.css('div.g'));
        for (let i = 0; i < Math.min(results.length, 5); i++) {
            let title = await results[i].findElement(By.css('h3')).getText();
            console.log(`${i + 1}. ${title}`);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        // 8. 브라우저 닫기
        await driver.quit();
    }
})();
