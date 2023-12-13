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

// 1. HTML 파싱 및 선택자 사용
const $ = cheerio.load(html);
const paragraphs = $('p');
paragraphs.each((index, element) => {
    console.log(`첫 번째 예제: ${$(element).text()}`);
});

// 2. 속성 값 가져오기
const linkHref = $('a').attr('href');
console.log(`두 번째 예제: ${linkHref}`);

// 3. 텍스트 내용 변경
$('p').text('새로운 텍스트');
console.log(`세 번째 예제: ${$.html()}`);

// 4. 클래스 추가 및 제거
$('div').addClass('highlight');
$('div').removeClass('box');
console.log(`네 번째 예제: ${$.html()}`);

// 5. 요소 생성 및 추가
const newElement = $('<p>새로운 요소</p>');
$('div').append(newElement);
console.log(`다섯 번째 예제: ${$.html()}`);
