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
    // console.log($.html());

    // 테이블 선택 및 데이터 파싱
    const tableRows = $('table.wikitable').find('tr');

    const countryData = [];
    tableRows.each((index, element) => {
        const columns = $(element).find('td');
        const country = $(columns[0]).text().trim();
        const gdp = $(columns[2]).text().trim();

        // console.log(`${index + 1}. 국가: ${country}, GDP: ${gdp}`);
        // 빈 값이 없는 경우에만 추가
        if (country && gdp) {
            countryData.push({ country, gdp });
        }
    });

    // 후처리3: 데이터 가공
    // 3-1. 국가명을 기준으로 정렬
    countryData.sort((a, b) => a.country.localeCompare(b.country));

    // 3-2. GDP를 기준으로 정렬
    // countryData.sort((a, b) => parseFloat(b.gdp.replace(/[^0-9.-]+/g, '')) - parseFloat(a.gdp.replace(/[^0-9.-]+/g, '')));

    // 정렬된 데이터 출력
    countryData.forEach((item, index) => {
        console.log(`${index + 1}. 국가: ${item.country}, GDP: ${item.gdp}`);
    });

    // 3-3. GDP가 10,000 ~ 20,000 사이인 국가만 필터링
    const filteredCountryData = countryData.filter(item => {
        // 쉼표 제거 후 숫자로 변환
        const gdpValue = parseInt(item.gdp.replace(/,/g, '').replace(/[^0-9.-]+/g, ''));
        
        // 10,000 이상 20,000 이하만 필터링
        return gdpValue >= 10000 && gdpValue <= 20000;
    });

    // 필터링된 결과 출력
    filteredCountryData.forEach((item, index) => {
        console.log(`${index + 1}. 국가: ${item.country}, GDP: ${item.gdp}`);
    });

    await browser.close();
})();
