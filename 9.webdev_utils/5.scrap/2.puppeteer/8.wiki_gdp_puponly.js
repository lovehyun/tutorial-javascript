const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new', // 'new' 값을 사용하여 새로운 Headless 모드로 설정
    });
    const page = await browser.newPage();

    await page.goto('https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', {
        waitUntil: 'domcontentloaded',
    });

    // 테이블의 모든 행 선택 및 데이터 파싱
    // 방법1. querySelectorAll + evaluate 방식
    // 1-1. 쉬운문법
    const countryData = await page.evaluate(() => {
        // 테이블 행 전체를 선택
        const rows = document.querySelectorAll('table.wikitable tr');
        const result = [];
    
        // 각 행을 순회하면서 데이터를 추출
        rows.forEach(row => {
            // 해당 행에서 모든 열(td) 가져오기
            const columns = row.querySelectorAll('td');
    
            // 데이터가 충분히 있는 경우만 추출
            if (columns.length > 2) {
                // 첫 번째 열에서 국가명 가져오기
                const country = columns[0].innerText.trim();
    
                // 두 번째 열에서 GDP 가져오기
                const gdp = columns[1].innerText.trim();
    
                // 국가명이 존재하는 경우에만 배열에 추가
                if (country) {
                    result.push({ country, gdp });
                }
            }
        });
    
        // 결과 배열 반환
        return result;
    });

    console.log(countryData);
    console.log('-----');

    // 1-2. 모던 JS문법
    const countryData2 = await page.evaluate(() => {
        const rows = document.querySelectorAll('table.wikitable tr');
        return Array.from(rows).map(row => {
            const columns = row.querySelectorAll('td');
            return {
                country: columns[0]?.innerText.trim() || "N/A",
                gdp: columns[1]?.innerText.trim() || "N/A"
            };
        }).filter(item => item.country !== "N/A");
    });

    console.log(countryData2);
    console.log('-----');

    // 방법2. $$eval 사용
    // 문법설명: await page.$$eval(selector, elementHandler)
    //  - selector: CSS 선택자로, 페이지 내에서 해당 요소들을 선택합니다.
    //  - elementHandler: 선택된 요소들의 "배열을 인자"로 받아 실행될 JavaScript 함수입니다
    const tableRows = await page.$$eval('table.wikitable tr', rows => {
        return rows.map(row => {
            const columns = row.querySelectorAll('td');
            const country = columns[0]?.innerText.trim() || "N/A";
            const gdp = columns[2]?.innerText.trim() || "N/A";
            return { country, gdp };
        });
    });

    // 결과 출력
    tableRows.forEach((row, index) => {
        console.log(`${index + 1}. 국가: ${row.country}, GDP: ${row.gdp}`);
    });
    console.log('-----');

    // 후처리: 데이터 가공
    // 국가명을 기준으로 정렬 (localeCompare()는 문자열을 사전식으로 비교)
    countryData.sort((a, b) => a.country.localeCompare(b.country)); // ㄱ-ㅎ0-9A-Za-z
    // countryData.sort((a, b) => (a.country > b.country ? 1 : -1)); // 0-9A-Za-zㄱ-ㅎ


    // GDP를 기준으로 정렬 (주석 해제 시 GDP 기준 정렬 가능)
    // countryData.sort((a, b) => parseFloat(b.gdp.replace(/[^0-9.-]+/g, '')) - parseFloat(a.gdp.replace(/[^0-9.-]+/g, '')));

    // 정렬된 데이터 출력
    countryData.forEach((item, index) => {
        console.log(`${index + 1}. 국가: ${item.country}, GDP: ${item.gdp}`);
    });

    await browser.close();
})();
