// npm install sharp
const sharp = require('sharp');

// 입력 및 출력 파일 경로
const inputImagePath = 'input.jpg';
const outputImagePath = 'output.jpg';

// Sharp를 사용하여 이미지 변환
sharp(inputImagePath)
    .resize(300, 300)  // 이미지 크기 조정 (300x300 픽셀)
    .grayscale()       // 흑백 이미지로 변환
    .toFormat('png')   // PNG 포맷으로 변환
    .toFile(outputImagePath)  // 변환된 이미지를 파일로 저장
    .then(() => {
        console.log('이미지 변환 완료!');
    })
    .catch(err => {
        console.error('이미지 변환 중 오류 발생:', err);
    });
