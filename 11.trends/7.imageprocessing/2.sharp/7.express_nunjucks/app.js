const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const app = express();

app.use(express.urlencoded({ extended: true }));

// Nunjucks 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true,
});
app.set('view engine', 'html');

// Multer 설정
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 메인 페이지
app.get('/', (req, res) => {
    console.log('메인 페이지 렌더링');
    res.render('index');
});

// 빈 값 체크 및 기본값 설정 함수
const validateInput = (value, defaultValue = null) => {
    if (value === '' || value === undefined) {
        return defaultValue;
    }
    return value;
};

// 이미지 처리 라우트
app.post('/process', upload.single('image'), async (req, res) => {
    console.log('이미지 업로드 및 처리 요청 수신');
    console.log('req.body:', req.body);

    const { file } = req;
    const { resize, rotate, blur, format, quality } = req.body;

    if (!file) {
        console.log('이미지가 업로드되지 않았습니다.');
        return res.status(400).send('이미지가 업로드되지 않았습니다.');
    }

    const inputPath = path.join(__dirname, file.path);
    const outputPath = path.join(__dirname, `uploads/processed_${file.filename}.jpg`);

    // 빈값 체크 및 기본값 할당
    const resizeValues = validateInput(resize) ? resize.split('x').map(Number) : [null, null];
    const resizeWidth = resizeValues[0];
    const resizeHeight = resizeValues[1];
    const rotateAngle = validateInput(rotate) ? parseInt(rotate) : null;
    const blurAmount = validateInput(blur) ? parseFloat(blur) : null;
    const qualityValue = validateInput(quality, 80); // 기본값 80

    console.log('사용자 입력 옵션:', { resizeWidth, resizeHeight, rotateAngle, blurAmount, qualityValue });

    try {
        let image = sharp(inputPath);

        // 크기 조정
        if (resizeWidth && resizeHeight) {
            console.log(`이미지 크기 조정: ${resizeWidth}x${resizeHeight}`);
            image = image.resize(resizeWidth, resizeHeight);
        }

        // 회전
        if (rotateAngle) {
            console.log(`이미지 회전: ${rotateAngle}도`);
            image = image.rotate(rotateAngle);
        }

        // 블러 처리
        if (blurAmount) {
            console.log(`이미지 블러 적용: ${blurAmount}`);
            image = image.blur(blurAmount);
        }

        // 품질 조정
        if (quality) {
            console.log(`이미지 품질 조정: ${quality}`);
            image = image.jpeg({ quality });
        }

        await image.toFile(outputPath);
        console.log(`이미지 변환 완료: ${outputPath}`);

        res.render('result', {
            originalImageUrl: `/uploads/${file.filename}`,
            processedImageUrl: `/uploads/processed_${file.filename}.jpg`
        });
    } catch (error) {
        console.error('이미지 처리 중 오류 발생:', error);
        res.status(500).send('이미지 처리에 실패했습니다.');
    }
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
