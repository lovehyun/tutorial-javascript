const axios = require('axios');
const cheerio = require('cheerio');

// 웹 페이지에 GET 요청 보내기
const url = 'http://www.cine21.com/rank/boxoffice/domestic';

axios.get(url)
    .then(response => {
        const $ = cheerio.load(response.data);

        // boxoffice_list_content ID를 가진 div 찾기
        const boxofficeListContent = $('#boxoffice_list_content');
        console.log(boxofficeListContent.html());

        // boxoffice_list_content 내의 모든 boxoffice_li 클래스를 가진 li 요소들 찾기
        const boxofficeLiList = boxofficeListContent.find('li.boxoffice_li');
        console.log(boxofficeLiList.length); // li 요소 개수 출력 (디버깅용)

        // 각 boxoffice_li에 대해 mov_name, people_num 클래스를 가진 div의 텍스트 출력
        boxofficeLiList.each((_, element) => {
            const movieName = $(element).find('div.mov_name').text().trim();
            const peopleNum = $(element).find('div.people_num').text().trim();
            
            if (movieName && peopleNum) {
                console.log(`영화 제목: ${movieName}, 관객 수: ${peopleNum}`);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the URL:', error);
    });
