require('dotenv').config(); // .env 파일 로드
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');

// REST API 키
const REST_API_KEY = process.env.KAKAO_RESTAPI_KEY;

// Base64 인코딩 함수
async function imageToBase64(imagePath) {
    try {
        const imageBuffer = await sharp(imagePath).toBuffer();
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error(`Failed to encode image to Base64: ${error.message}`);
        throw error;
    }
}

// 이미지 편집 함수
async function inpainting(imageBase64, maskBase64) {
    try {
        const response = await axios.post(
            'https://api.kakaobrain.com/v2/inference/karlo/inpainting',
            {
                version: 'v2.0',
                image: imageBase64,
                mask: maskBase64
            },
            {
                headers: {
                    Authorization: `KakaoAK ${REST_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error calling inpainting API: ${error.response?.status || error.message}`);
        throw error;
    }
}

// 이미지 파일 읽기 및 편집 작업
(async () => {
    const inputImagePath = 'image.png'; // 원본 이미지 파일 경로
    const maskImagePath = 'mask.png'; // 마스크 이미지 파일 경로
    const outputImagePath = 'inpainting_image.png'; // 편집된 이미지 저장 경로

    try {
        // 이미지를 Base64로 인코딩
        console.log('Encoding images to Base64...');
        const imgBase64 = await imageToBase64(inputImagePath);
        const maskBase64 = await imageToBase64(maskImagePath);

        // API 호출하여 이미지 편집
        console.log('Calling inpainting API...');
        const response = await inpainting(imgBase64, maskBase64);

        // 응답에서 첫 번째 이미지 URL 가져오기
        const imageUrl = response.images[0].image;
        console.log(`Edited image URL: ${imageUrl}`);

        // 생성된 이미지 다운로드 및 저장
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        // 이미지를 파일로 저장
        console.log(`Saving edited image to ${outputImagePath}...`);
        fs.writeFileSync(outputImagePath, imageBuffer);

        console.log(`Edited image saved to ${outputImagePath}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
})();
