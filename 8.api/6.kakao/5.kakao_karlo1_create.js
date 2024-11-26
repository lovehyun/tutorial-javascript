require('dotenv').config(); // .env 파일 로드
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');

// REST API Key
const REST_API_KEY = process.env.KAKAO_RESTAPI_KEY;

// T2I 요청 함수
async function t2i(prompt, negativePrompt) {
    try {
        const response = await axios.post(
            'https://api.kakaobrain.com/v2/inference/karlo/t2i',
            {
                version: "v2.1",
                prompt: prompt,
                negative_prompt: negativePrompt,
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
        console.error(`Error: ${error.response?.status || error.message}`);
        return null;
    }
}

// 프롬프트에 사용할 제시어
const prompt = "A photo of a cute tiny monster on the beach, daylight.";
const negativePrompt = "";

// 이미지 생성 함수 호출
(async () => {
    console.log("Generating image...");
    const response = await t2i(prompt, negativePrompt);

    if (!response || !response.images || response.images.length === 0) {
        console.error("Failed to generate image.");
        return;
    }

    // 응답에서 첫 번째 이미지 URL 가져오기
    const imageUrl = response.images[0].image;

    // 이미지 다운로드 및 저장
    try {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        // 이미지 저장 (PNG 포맷)
        const outputPath = "generated_image.png";
        await sharp(imageBuffer).toFile(outputPath);

        console.log(`Image saved as ${outputPath}`);
    } catch (error) {
        console.error(`Failed to download or save the image: ${error.message}`);
    }
})();
