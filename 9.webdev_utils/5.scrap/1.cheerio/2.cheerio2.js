const cheerio = require('cheerio');

// 예제 HTML
const html = `
    <html>
        <head>
            <title>Cheerio 예제</title>
        </head>
        <body>
            <div><p>첫 번째 문단</p><p>두 번째 문단</p></div>
            <a href="https://www.example.com">링크</a>
            <p>원래 텍스트</p>
            <div class="box">내용</div>
        </body>
    </html>
`;

// 0. HTML 파싱 및 선택자 사용
const $ = cheerio.load(html);
// console.log($);
console.log($.html());

// DOM 파싱
// 1. 요소 가져오기
const paragraphs = $('p');
paragraphs.each((index, element) => {
    console.log(`첫 번째 예제: ${$(element).text()}`);
});

// 1-1. 특정 파라그래프 가져오기
console.log(`첫 번째 P: ${$('p').eq(0).text()}`);
console.log(`두 번째 P: ${$('p').eq(1).text()}`);

// 1-2. 특정 depth 요소 가져오기
const secondParagraph = $('body > div > p').eq(1).text();
console.log(`두 번째 p 태그 내용: ${secondParagraph}`);

// 2. 속성 값 가져오기
const link = $('a');
const linkUrl = $('a').attr('href');
console.log(`두 번째 예제: ${link.text()} ${linkUrl}`);

// DOM 수정
// 3. 텍스트 내용 변경 (모든 p태그 다 변경)
$('p').text('새로운 텍스트');
console.log(`세 번째 예제: ${$.html()}`);

// 3-1. 첫번째 p 태그만, 두번째 p 태그만
$('p').eq(0).text('첫 번째 p 태그가 변경되었습니다!');
$('p').eq(1).text('두 번째 p 태그가 변경되었습니다!');
$('p').first().text('첫 번째 p 태그만 변경되었습니다!');
$('p').last().text('마지막 p 태그만 변경되었습니다!');
$('p:nth-of-type(1)').text('첫 번째 p 태그 (CSS 선택자)!');

// 4. 클래스 추가 및 제거
$('div').addClass('highlight');
$('div').removeClass('box');
console.log(`네 번째 예제: ${$.html()}`);

// 5. 요소 생성 및 추가
const newElement = $('<p>새로운 요소</p>');
$('div').append(newElement);
console.log(`다섯 번째 예제: ${$.html()}`);
