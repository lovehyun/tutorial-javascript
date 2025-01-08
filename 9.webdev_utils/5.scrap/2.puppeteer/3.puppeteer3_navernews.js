// npm install puppeteer
const puppeteer = require('puppeteer');

const url = 'https://news.naver.com/section/105';

(async () => {
    const browser = await puppeteer.launch({ headless: true }); // 브라우저 실행
    const page = await browser.newPage(); // 새 페이지 열기
    await page.goto(url, { waitUntil: 'domcontentloaded' }); // 페이지 로딩 대기

    // 헤드라인 뉴스 타이틀 수집
    const headlines = await page.evaluate(() => {
        const titles = [];
        // 모든 div.section_article.as_headline._TEMPLATE 요소 선택
        document.querySelectorAll('div.section_article.as_headline._TEMPLATE').forEach(element => {
            // div.sa_text 아래의 a 태그 하나의 텍스트만 추출
            // const linkElement = element.querySelector('div.sa_text > a');
            // if (linkElement && linkElement.textContent.trim()) {
            //     titles.push(linkElement.textContent.trim());
            // }

            // div.sa_text 아래 모든 a 태그를 순회
            element.querySelectorAll('div.sa_text > a').forEach(aTag => {
                if (aTag.textContent.trim()) {
                    titles.push(aTag.textContent.trim());
                }
            });
        });
        return titles;
    });

    console.log('헤드라인 뉴스 타이틀:');
    console.log(headlines.slice(0, 10)); // 상위 10개 뉴스만 출력

    await browser.close(); // 브라우저 종료
})();
