const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors()); // React와의 CORS 문제 방지
app.use(express.json());

// Multer 설정 (이미지 업로드용, 랜덤 파일명으로 저장)
// const upload = multer({ dest: 'uploads/' });

// Multer 설정 (파일명을 랜덤 문자열 + 원본 파일명 형식으로 변경)
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const randomString = crypto.randomBytes(6).toString('hex'); // 12자리 랜덤 문자열 생성
        const originalName = file.originalname.replace(/ /g, '_');  // 파일명 공백을 _로 변경
        const newFilename = `${randomString}_${originalName}`;
        cb(null, newFilename);
    },
});
const upload = multer({ storage });

// 정적 파일 제공 (index.html과 result.html 서빙)
app.use(express.static(path.join(__dirname, 'public')));

// 정적 파일 제공 (업로드된 이미지를 React에서 접근 가능하게)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 이미지 업로드 및 OCR 처리 REST API
app.post('/upload', upload.single('image'), async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const filePath = path.join(__dirname, file.path);

    try {
        // Tesseract.js를 사용한 OCR 처리
        const {
            data: { text },
        } = await Tesseract.recognize(filePath, 'kor+eng', {
            logger: (info) => console.log(info), // OCR 진행 상황 로깅
        });

        // OCR 결과와 업로드된 이미지 URL을 JSON으로 반환
        res.json({
            imageUrl: `/uploads/${file.filename}`,
            extractedText: text,
        });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ error: 'Failed to process the image.' });
    } finally {
        // 임시 파일 삭제
        // fs.unlink(filePath, (err) => {
        //     if (err) console.error('Failed to delete temporary file:', err);
        // });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 종료 시 uploads 폴더 정리 함수
async function clearUploadsFolder() {
    const uploadsDir = path.join(__dirname, 'uploads');
    try {
        const files = await fs.promises.readdir(uploadsDir); // 비동기적으로 파일 목록 읽기
        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            await fs.promises.unlink(filePath); // 파일 삭제를 비동기적으로 처리
            console.log(`Deleted: ${filePath}`);
        }
    } catch (err) {
        console.error('Error clearing uploads folder:', err);
    }
}

// 종료 이벤트 핸들링 (서버 종료 시 호출)
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    await clearUploadsFolder(); // 삭제가 완료될 때까지 대기
    process.exit(0);  // 강제 종료
});
process.on('SIGTERM', async () => {
    console.log('Process terminated.');
    clearUploadsFolder();
    process.exit(0);
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
