// npm install selenium-webdriver cheerio exceljs axios sharp

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Cine21 박스오피스 URL
        const baseUrl = 'http://www.cine21.com/';
        const rankingUrl = `${baseUrl}rank/boxoffice/domestic`;

        // 웹 페이지 접속
        await driver.get(rankingUrl);

        // 페이지 소스코드 가져오기
        const pageSource = await driver.getPageSource();

        // Cheerio를 사용하여 HTML 파싱
        const $ = cheerio.load(pageSource);
        const boxofficeListContent = $('#boxoffice_list_content');
        const boxofficeLiList = boxofficeListContent.find('li.boxoffice_li');

        // cine21 폴더 생성
        const outputDir = path.resolve(__dirname, 'cine21');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
            console.log(`폴더 생성 완료: ${outputDir}`);
        }

        // 데이터 수집
        const data = [];
        boxofficeLiList.each((index, element) => {
            const rank = index + 1;
            const movName = $(element).find('div.mov_name').text().trim();
            const peopleNum = $(element).find('div.people_num').text().trim().replace('관객수|', '');
            const movLink = baseUrl + $(element).find('a').attr('href');
            const imgSrc = $(element).find('img').attr('src');

            data.push({ 순위: rank, 영화제목: movName, 관객수: peopleNum, 웹사이트: movLink, 포스터: imgSrc });
        });

        // Excel 파일 생성
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Box Office Rankings');

        // 헤더 작성
        worksheet.columns = [
            { header: '순위', key: '순위', width: 10 },
            { header: '포스터', key: '포스터', width: 30 },
            { header: '영화 제목', key: '영화제목', width: 40 },
            { header: '관객 수', key: '관객수', width: 15 },
            { header: '웹사이트 정보', key: '웹사이트', width: 50 },
        ];

        // 데이터 입력 및 이미지 삽입
        for (const item of data) {
            const row = worksheet.addRow({
                순위: item.순위,
                영화제목: item.영화제목,
                관객수: item.관객수,
                웹사이트: item.웹사이트,
            });

            // 하이퍼링크 추가
            const cell = worksheet.getCell(`E${row.number}`);
            cell.value = { text: item.웹사이트, hyperlink: item.웹사이트 };

            // 이미지 다운로드 및 삽입
            const imgPath = path.resolve(outputDir, `poster_${item.순위}.jpg`);
            const response = await axios({
                url: item.포스터,
                method: 'GET',
                responseType: 'arraybuffer',
            });

            // 이미지 크기 조정 및 저장
            await sharp(response.data).resize(100, 100).toFile(imgPath);

            // Excel에 이미지 삽입
            const imageId = workbook.addImage({
                filename: imgPath,
                extension: 'jpeg',
            });
            worksheet.addImage(imageId, {
                tl: { col: 1, row: row.number - 1 }, // 시작 위치
                ext: { width: 100, height: 100 }, // 이미지 크기
            });

            // 행 높이 설정
            worksheet.getRow(row.number).height = 75;
        }

        // Excel 파일 저장
        const excelPath = path.resolve(outputDir, 'boxoffice_rankings_with_images.xlsx');
        await workbook.xlsx.writeFile(excelPath);
        console.log(`Excel 파일 저장 완료: ${excelPath}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // 브라우저 종료
        await driver.quit();
    }
})();
