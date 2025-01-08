// npm install axios cheerio
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://news.naver.com/section/105';

axios.get(url)
    .then((response) => {
        const $ = cheerio.load(response.data);

        // 모든 <script> 태그 제거
        $('script').remove();

        // script 태그 제거 후의 HTML 출력
        // console.log($.html());

        // 헤드라인 뉴스 타이틀 담기
        const headlines = [];

        // 방법1. li 태그 중에서 class="sa_item _SECTION_HEADLINE"을 가진 요소를 모두 선택합니다.
        // $('li.sa_item._SECTION_HEADLINE').each((index, element) => {

        // 방법2. div 태그 중에서 class="section_article as_headline _TEMPLATE" 을 가진 요소를 모두 선택
        $('div.section_article.as_headline._TEMPLATE').each((index, element) => {

            // div 태그 중에서 class="sa_text" 를 가진 모든 요소 바로 아래의 a 태그
            $(element).find('div.sa_text > a').each((_, subElement) => {
                const title = $(subElement).text().trim();
                if (title.length > 0) {
                    headlines.push(title);
                }
            });
        });

        console.log('헤드라인 뉴스 타이틀:');
        console.log(headlines.slice(0, 10)); // 상위 10개 뉴스만 출력
    })
    .catch((error) => {
        console.error('요청 오류:', error.message);
    });
