const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
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

    // cine21 폴더 생성
    const outputDir = path.resolve(__dirname, 'cine21');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
        console.log(`폴더 생성 완료: ${outputDir}`);
    }

    try {
        // Cine21 박스오피스 URL
        const baseUrl = 'http://www.cine21.com';
        const rankingUrl = `${baseUrl}/rank/boxoffice/domestic`;

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

        let globalRank = 1; // 전체 순위

        // 데이터 수집 함수
        const getMovieLists = async () => {
            const boxofficeListContent = await driver.findElement(By.css('div#boxoffice_list_content'));
            const boxofficeLiList = await boxofficeListContent.findElements(By.css('li.boxoffice_li'));

            for (const boxofficeLi of boxofficeLiList) {
                const movNameDiv = await boxofficeLi.findElement(By.css('div.mov_name')).getText();
                const peopleNumDiv = await boxofficeLi.findElement(By.css('div.people_num')).getText();
                const aLink = await boxofficeLi.findElement(By.tagName('a'));
                const movLink = `${baseUrl}${await aLink.getAttribute('href')}`;
                const imgSrc = await boxofficeLi.findElement(By.css('img')).getAttribute('src');

                console.log(`순위: ${globalRank}, 영화 제목: ${movNameDiv}, 관객 수: ${peopleNumDiv}`);

                // 행 추가
                const row = worksheet.addRow({
                    순위: globalRank,
                    영화제목: movNameDiv,
                    관객수: peopleNumDiv,
                    웹사이트: movLink,
                });

                // 이미지 다운로드 및 삽입
                const imgPath = path.resolve(outputDir, `poster_${globalRank}.jpg`);
                const response = await axios({
                    url: imgSrc,
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

                // 전체 순위 증가
                globalRank++;
            }
        };

        // 첫 페이지부터 마지막 페이지까지 반복
        for (let page = 1; page <= 10; page++) {
            try {
                console.log('-'.repeat(50));
                console.log(`Navigating to page ${page}...`);

                // 페이지 로드
                await driver.get(`${rankingUrl}?page=${page}`);

                // 페이지 로딩 대기
                await driver.wait(until.elementLocated(By.css('div#boxoffice_list_content')), 5000);

                // 데이터 수집
                await getMovieLists();
            } catch (error) {
                console.error(`Error on page ${page}:`, error);
                break; // 오류 발생 시 중지
            }
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
