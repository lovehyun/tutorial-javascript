const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('uploads'));
app.use(express.static(__dirname));

// 빈값 체크 및 기본값 설정 함수
const validateInput = (value, defaultValue = null) => {
    if (value === '' || value === undefined) {
        return defaultValue;
    }
    return value;
};

// 이미지 처리 API (RESTful 방식)
app.post('/api/process', upload.single('image'), async (req, res) => {
    console.log('이미지 업로드 및 처리 요청 수신');
    console.log('req.body:', req.body);

    const { file } = req;
    const { resize, rotate, blur, quality } = req.body;

    if (!file) {
        return res.status(400).json({ error: '이미지가 업로드되지 않았습니다.' });
    }

    const inputPath = path.join(__dirname, file.path);
    const outputPath = path.join(__dirname, `uploads/processed_${file.filename}.jpg`);

    const resizeValues = validateInput(resize) ? resize.split('x').map(Number) : [null, null];
    const resizeWidth = resizeValues[0];
    const resizeHeight = resizeValues[1];
    const rotateAngle = validateInput(rotate) ? parseInt(rotate) : null;
    const blurAmount = validateInput(blur) ? parseFloat(blur) : null;
    const qualityValue = validateInput(quality, 80);

    try {
        let image = sharp(inputPath);

        // 크기 조정
        if (resizeWidth && resizeHeight) {
            image = image.resize(resizeWidth, resizeHeight);
        }

        // 회전
        if (rotateAngle) {
            image = image.rotate(rotateAngle);
        }

        // 블러
        if (blurAmount) {
            image = image.blur(blurAmount);
        }

        // 품질 조정
        image = image.jpeg({ quality: qualityValue });

        await image.toFile(outputPath);

        // JSON 응답 전송
        res.json({
            originalImageUrl: `/uploads/${file.filename}`,
            processedImageUrl: `/uploads/processed_${file.filename}.jpg`
        });

    } catch (error) {
        console.error('이미지 처리 중 오류:', error);
        res.status(500).json({ error: '이미지 처리에 실패했습니다.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`RESTful 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
