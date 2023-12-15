const axios = require('axios');
const cheerio = require('cheerio');

const startUrl = 'https://www.example.com'; // 시작할 URL을 여기에 입력하세요
const maxDepth = 3; // 크롤링을 원하는 최대 깊이

const crawledLinks = []; // 배열로 변경
const crawledLinksDone = []; // 완료된 목록을 저장할 배열

async function crawl(url, depth) {
    if (depth > maxDepth || crawledLinks.includes(url)) {
        // 이미 크롤링한 링크거나, 전체 URL이 아니면 크롤링하지 않음
        return;
    }

    console.log(`URL[${depth}]: ${url}`);

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // 현재 페이지의 모든 a 태그를 가져와서 리스트에 추가
        const links = [];
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link && link.startsWith('http')) {
                links.push(link);
            }
        });

        // 중복된 링크 제외하고 추가
        links.forEach(link => {
            if (!crawledLinks.includes(link)) {
                crawledLinks.push(link);
                console.log(`  COLLECTED: ${link}`);
            }
        });

        // 다음 깊이로 크롤링 진행
        for (const link of links) {
            await crawl(link, depth + 1);
        }

        // 처리된 링크를 완료된 목록으로 이동
        crawledLinksDone.push(url);
    } catch (error) {
        console.error(`Error crawling ${url}: ${error.message}`);
    }
}

async function startCrawling() {
    let currentLink = startUrl;

    // Ctrl+C 핸들링을 위한 이벤트 등록
    process.on('SIGINT', () => {
        console.log('Crawling interrupted. Printing collected and completed links:');
        console.log('Collected links:', crawledLinks);
        console.log('Completed links:', crawledLinksDone);
        process.exit();
    });

    while (currentLink) {
        await crawl(currentLink, 0);
        // 크롤링이 끝난 후 목록에서 다음 링크를 가져옴
        currentLink = crawledLinks.shift();
        console.log(`NEXT: ${currentLink}`);
    }

    console.log('Crawling complete.');
    console.log('Collected links:', crawledLinks);
    console.log('Completed links:', crawledLinksDone);
}

// 크롤링 시작
startCrawling().catch((error) => console.error(`Crawling failed: ${error.message}`));
