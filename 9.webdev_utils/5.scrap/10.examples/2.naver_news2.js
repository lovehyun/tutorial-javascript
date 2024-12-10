const axios = require('axios');
const cheerio = require('cheerio');

// 뉴스 제목 출력 함수
const printNewsTitles = ($, headline) => {
    // 클래스 이름 결정
    const className = headline 
        ? 'div.section_article.as_headline._TEMPLATE' 
        : 'div.section_article._TEMPLATE';

    // 지정된 클래스의 div 태그 찾기
    $(className).each((_, element) => {
        $(element).find('a.sa_text_title').each((__, link) => {
            console.log($(link).text().trim());
        });
    });
};

// 웹 페이지에 GET 요청 보내기
const url = 'https://news.naver.com/section/105'; // IT/과학 뉴스

axios.get(url)
    .then(response => {
        const $ = cheerio.load(response.data);

        // 헤드라인 섹션 출력
        console.log("Headline Section Titles:");
        printNewsTitles($, true);
        console.log('-'.repeat(50));

        // 헤드라인 아래 섹션 출력
        console.log("Other Section Titles:");
        printNewsTitles($, false);
    })
    .catch(error => {
        console.error('Error fetching the URL:', error);
    });
