const axios = require('axios');
const cheerio = require('cheerio');

// 웹 페이지에 GET 요청 보내기
const url = 'https://news.naver.com/section/105'; // IT/과학 뉴스

axios.get(url)
    .then(response => {
        const $ = cheerio.load(response.data);

        // 헤드라인 섹션 - section_article 클래스를 가진 div 태그 찾기
        const headlineArticles = $('div.section_article.as_headline._TEMPLATE');

        // 각 headlineArticle에 대해 sa_text_title 클래스를 가진 태그 찾아 출력
        headlineArticles.each((index, element) => {
            $(element).find('a.sa_text_title').each((_, link) => {
                console.log($(link).text().trim());
            });
        });

        console.log('-'.repeat(50));

        // 헤드라인 아래 섹션
        const otherArticles = $('div.section_article._TEMPLATE');

        otherArticles.each((index, element) => {
            $(element).find('a.sa_text_title').each((_, link) => {
                console.log($(link).text().trim());
            });
        });
    })
    .catch(error => {
        console.error('Error fetching the URL:', error);
    });
