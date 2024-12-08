// npm install chromedriver selenium-webdriver
// npm install webdriver-manager -g
// webdriver-manager update
// 근데 자동이 일반적으로 잘 안됨. 버전이 안맞음. 그냥 수동으로 설치.
// https://developer.chrome.com/docs/chromedriver/downloads?hl=ko
// https://googlechromelabs.github.io/chrome-for-testing/

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const cheerio = require('cheerio');
const path = require('path');

// ChromeDriver 경로 설정 (수동 설치 시)
const chromeDriverPath = path.resolve('C:/devs/bin/chromedriver.exe'); // ChromeDriver 경로 수정

// Cine21 박스오피스 URL
const url = 'http://www.cine21.com/rank/boxoffice/domestic';

(async () => {
    // ChromeDriver 생성 및 Headless 모드 활성화
    const options = new chrome.Options();
    options.addArguments('--headless'); // Headless 모드 설정
    options.addArguments('--disable-gpu'); // GPU 비활성화 (Headless 모드에서 권장)
    // options.addArguments('--headless', '--disable-gpu');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(new chrome.ServiceBuilder(chromeDriverPath)) // ChromeDriver 경로 설정
        .build();
        
    try {
        // 웹 페이지에 접속
        await driver.get(url);

        // 페이지 소스코드 가져오기
        const pageSource = await driver.getPageSource();

        // Cheerio를 사용하여 페이지 소스 파싱
        const $ = cheerio.load(pageSource);

        // boxoffice_list_content ID를 가진 div 찾기
        const boxofficeListContent = $('#boxoffice_list_content');

        // boxoffice_list_content 내의 모든 boxoffice_li 클래스를 가진 li 요소들 찾기
        const boxofficeLiList = boxofficeListContent.find('li.boxoffice_li');

        // 각 영화의 순위, 제목, 관객 수 출력
        boxofficeLiList.each((index, element) => {
            const rank = $(element).find('span.grade').text().trim();
            const movieName = $(element).find('div.mov_name').text().trim();
            const peopleNum = $(element).find('div.people_num').text().trim();

            console.log(`순위: ${rank}, 영화 제목: ${movieName}, 관객 수: ${peopleNum}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // 웹 드라이버 종료
        await driver.quit();
    }
})();
