const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // HTML 예제 로딩
    const html = `
        <html>
            <head>
                <title>Puppeteer 예제</title>
            </head>
            <body>
                <div><p>첫 번째 문단</p><p>두 번째 문단</p></div>
                <a href="https://www.example.com">링크</a>
                <p>원래 텍스트</p>
                <div class="box">내용</div>
            </body>
        </html>
    `;

    // HTML 로딩
    await page.setContent(html);

    // 0. HTML 파싱 및 선택자 사용
    const content = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(content);

    // 1. 요소 가져오기
    const paragraphs = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('p'));
        return elements.map(el => el.textContent);
    });
    paragraphs.forEach((text, index) => {
        console.log(`첫 번째 예제: ${text}`);
    });

    // 1-1. 특정 파라그래프 가져오기
    const firstParagraph = await page.evaluate(() => document.querySelector('p').textContent);
    const secondParagraph = await page.evaluate(() => document.querySelectorAll('p')[1].textContent);
    console.log(`첫 번째 P: ${firstParagraph}`);
    console.log(`두 번째 P: ${secondParagraph}`);

    // 1-2. 특정 depth 요소 가져오기
    const specificParagraph = await page.evaluate(() => {
        return document.querySelector('body > div > p:nth-of-type(2)').textContent;
    });
    console.log(`두 번째 p 태그 내용: ${specificParagraph}`);

    // 2. 속성 값 가져오기
    const linkInfo = await page.evaluate(() => {
        const link = document.querySelector('a');
        return { text: link.textContent, href: link.href };
    });
    console.log(`두 번째 예제: ${linkInfo.text} ${linkInfo.href}`);

    // 3. 텍스트 내용 변경
    await page.evaluate(() => {
        document.querySelectorAll('p').forEach(p => p.textContent = '새로운 텍스트');
    });
    const updatedContent = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(`세 번째 예제: ${updatedContent}`);

    // 3-1. 특정 P 태그만 변경
    await page.evaluate(() => {
        document.querySelector('p').textContent = '첫 번째 p 태그가 변경되었습니다!';
        document.querySelectorAll('p')[1].textContent = '두 번째 p 태그가 변경되었습니다!';
    });
    const modifiedContent = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(`세 번째 예제 (수정 후): ${modifiedContent}`);

    // 4. 클래스 추가 및 제거
    await page.evaluate(() => {
        document.querySelector('div').classList.add('highlight');
        document.querySelector('div').classList.remove('box');
    });
    const classModified = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(`네 번째 예제: ${classModified}`);

    // 5. 요소 생성 및 추가
    await page.evaluate(() => {
        const newElement = document.createElement('p');
        newElement.textContent = '새로운 요소';
        document.querySelector('div').appendChild(newElement);
    });
    const finalContent = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(`다섯 번째 예제: ${finalContent}`);

    await browser.close();
})();
