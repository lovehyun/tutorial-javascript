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

// 이미지 변환 함수
async function variations(imageBase64) {
    try {
        const response = await axios.post(
            'https://api.kakaobrain.com/v2/inference/karlo/variations',
            {
                version: 'v2.1',
                image: imageBase64,
                height: 1024,
                width: 1024
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
        console.error(`Error calling variations API: ${error.response?.status || error.message}`);
        throw error;
    }
}

// 이미지 파일 읽기 및 변환
(async () => {
    const inputImagePath = 'original.png'; // 원본 이미지 파일 경로
    const outputImagePath = 'variations_image.png'; // 변환된 이미지 저장 경로

    try {
        // 이미지를 Base64로 인코딩
        console.log('Encoding image to Base64...');
        const imgBase64 = await imageToBase64(inputImagePath);

        // API 호출하여 변형 이미지 생성
        console.log('Calling variations API...');
        const response = await variations(imgBase64);

        // 응답에서 첫 번째 이미지 URL 가져오기
        const imageUrl = response.images[0].image;
        console.log(`Generated image URL: ${imageUrl}`);

        // 생성된 이미지 다운로드 및 저장
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        // 이미지를 파일로 저장
        console.log(`Saving generated image to ${outputImagePath}...`);
        fs.writeFileSync(outputImagePath, imageBuffer);

        console.log(`Generated image saved to ${outputImagePath}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
})();
