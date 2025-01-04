// npm install tesseract.js
const Tesseract = require('tesseract.js');

Tesseract.recognize(
    'image.png', // 이미지 경로 또는 URL
    'eng', // 언어 설정
    {
        logger: (info) => console.log(info), // 진행 상황 로그
    }
)
    .then(({ data: { text } }) => {
        console.log('Extracted Text:', text);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
