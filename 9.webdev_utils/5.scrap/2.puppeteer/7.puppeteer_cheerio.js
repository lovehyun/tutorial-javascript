// npm i puppeteer cheerio
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    const html = `
        <html>
            <head>
                <title>파싱 예제</title>
            </head>
            <body>
                <div>
                    <p>첫번째 문단</p>
                    <p>두번째 문단</p>
                </div>
                <a href="https://www.naver.com">네이버 링크</a>
                <p>또하나의 문단</p>
                <div class="box">박스내용</div>
            </body>
        </html>
    `;

    // Puppeteer를 사용하여 HTML 로딩
    await page.setContent(html);

    // 현재 페이지의 HTML 가져오기
    const pageContent = await page.content();

    // Cheerio로 파싱
    const $ = cheerio.load(pageContent);

    // p 요소 모두 추출
    $('p').each((index, element) => {
        console.log(`Cheerio 결과: ${$(element).text()}`);
    });

    // 5초 대기 후 브라우저 종료
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
})();
