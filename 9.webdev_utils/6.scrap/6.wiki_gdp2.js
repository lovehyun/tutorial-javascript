const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new', // 'new' 값을 사용하여 새로운 Headless 모드로 설정
    });
    const page = await browser.newPage();

    await page.goto('https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', {
        waitUntil: 'domcontentloaded',
    });

    // 페이지 내용을 Cheerio로 로드
    const content = await page.content();
    const $ = cheerio.load(content);

    // 테이블 선택 및 데이터 파싱
    const tableRows = $('table.wikitable').find('tr');

    const countryData = [];

    tableRows.each((index, element) => {
        const columns = $(element).find('td');
        const country = $(columns[0]).text().trim();
        const gdp = $(columns[2]).text().trim();

        countryData.push({ country, gdp });
    });

    // 국가명을 기준으로 정렬
    countryData.sort((a, b) => a.country.localeCompare(b.country));

    // GDP를 기준으로 정렬
    // countryData.sort((a, b) => parseFloat(b.gdp.replace(/[^0-9.-]+/g, '')) - parseFloat(a.gdp.replace(/[^0-9.-]+/g, '')));

    // 정렬된 데이터 출력
    countryData.forEach((item, index) => {
        console.log(`${index + 1}. 국가: ${item.country}, GDP: ${item.gdp}`);
    });

    await browser.close();
})();
