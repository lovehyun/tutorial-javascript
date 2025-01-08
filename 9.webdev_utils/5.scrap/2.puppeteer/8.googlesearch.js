const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
        // headless: true, // headless 모드
        headless: false, // 브라우저를 시각적으로 확인 가능하게 실행
        // devtools: true  // 개발자 도구 활성화
        defaultViewport: {
            width: 1920,  // 너비 설정
            height: 1080  // 높이 설정
        }
    }); 

    // 새 탭 생성
    // const page = await browser.newPage();

    // 이미 열린 첫 번째 페이지를 가져오기
    const pages = await browser.pages(); 
    const page = pages[0]; // 첫 번째 열린 탭 사용

    // Google로 이동
    await page.goto('https://www.google.com');

    // 검색어 입력
    await page.type('textarea[name="q"]', 'javascript programming');
    await page.keyboard.press('Enter');

    // 검색 결과가 로딩될 때까지 대기
    // await page.waitForSelector('div#res');
    await page.waitForSelector('div#search');

    // 브라우저 내 콘솔을 Node.js 터미널에 전달
    page.on('console', msg => console.log('브라우저 콘솔:', msg.text()));
    
    // div#res 내에서 상위 5개의 검색 결과 제목과 URL 가져오기
    // 참고: page.evaluate()는 브라우저의 콘텍스트에서 실행되는 코드입니다. 
    // 즉, 이 블록 안의 console.log()는 브라우저의 개발자 도구 콘솔에 출력되고, Node.js 터미널에서는 보이지 않습니다.
    const results = await page.evaluate(() => {
        const items = [];
        // const resDiv = document.querySelector('div#res');
        const resDiv = document.querySelector('div#search');
        const elements = resDiv.querySelectorAll('h3');
        // const elements = document.querySelectorAll('div#search h3'); 

        elements.forEach((element, index) => {
            if (index < 5) {  // 상위 5개만 수집
                const linkElement = element.closest('a');
                // console.log('linkElement:', JSON.stringify(linkElement));
                items.push({
                    title: element.innerText,
                    url: linkElement ? linkElement.href : '링크없음'
                });
            }
        });
        return items;
    });

    console.log('검색 결과:');
    results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.title} - ${result.url}`);
    });

    await page.screenshot({ path: 'screenshot.png' }); // 결과 확인을 위한 스크린샷
    await browser.close();
})();
