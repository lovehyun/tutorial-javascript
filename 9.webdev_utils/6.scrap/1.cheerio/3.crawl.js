const axios = require('axios');
const cheerio = require('cheerio');

const startUrl = 'https://www.naver.com/'; // 시작할 URL을 여기에 입력하세요
const maxDepth = 3; // 크롤링을 원하는 최대 깊이

const crawledLinks = [];

async function crawl(url, depth) {
    console.log('URL: ', url);

    if (depth > maxDepth) {
        return;
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // 현재 페이지의 모든 a 태그를 가져와서 리스트에 추가
        const links = [];
        $('a').each((index, element) => {
            const link = $(element).attr('href')
            console.log(link);
            links.push(link);
        });

        crawledLinks.push(links);

        // 다음 깊이로 크롤링 진행
        for (const link of links) {
            const absoluteUrl = new URL(link, url).href;
            await crawl(absoluteUrl, depth + 1);
        }
    } catch (error) {
        console.error(`Error crawling ${url}: ${error.message}`);
    }
}

// 크롤링 시작
crawl(startUrl, 0)
    .then(() => {
        console.log('Crawling complete.');
        console.log(crawledLinks);
    })
    .catch((error) => console.error(`Crawling failed: ${error.message}`));
