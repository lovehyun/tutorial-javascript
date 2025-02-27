const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

async function extractTextFromImage(imagePath) {
    // 이미지 경로를 절대 경로로 변환
    const absolutePath = path.resolve(imagePath);

    // 파일이 존재하는지 확인
    if (!fs.existsSync(absolutePath)) {
        console.error('Error: Image file not found.');
        return;
    }

    console.log(`Processing image: ${absolutePath}`);

    // Tesseract.js OCR 작업 수행
    try {
        const {
            data: { text },
        } = await Tesseract.recognize(
            absolutePath, // 이미지 파일 경로
            'eng', // 언어 설정
            {
                logger: (info) => console.log(info), // 로그 출력 (옵션)
            }
        );

        console.log('Extracted Text:');
        console.log(text);
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

// 실행 예제
const imagePath = './sample_image.png'; // 이미지 파일 경로
extractTextFromImage(imagePath);
