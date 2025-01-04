const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const { Worker } = require('worker_threads');

const app = express();
app.use(cors()); 
app.use(express.json());

// Multer 설정 (랜덤 파일명 + 원본 파일명 유지)
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const randomString = crypto.randomBytes(6).toString('hex');
        const originalName = file.originalname.replace(/ /g, '_');
        const newFilename = `${randomString}_${originalName}`;
        cb(null, newFilename);
    },
});
const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// OCR 진행률 상태 변수
let currentProgress = 0;
let ocrResultText = "";
let isProcessing = false;

// SSE를 통한 진행률 전송 엔드포인트
app.get('/progress', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendProgress = setInterval(() => {
        res.write(`data: ${JSON.stringify({ progress: currentProgress, text: ocrResultText })}\n\n`);
        if (currentProgress === 1 && !isProcessing) {
            clearInterval(sendProgress);
            res.end();  // 스트리밍 종료
        }
    }, 200); // 200ms마다 업데이트
});

// 이미지 업로드 및 OCR 처리
app.post('/upload', upload.single('image'), async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const filePath = path.join(__dirname, file.path);
    currentProgress = 0;
    ocrResultText = "";
    isProcessing = true;

    // try {
    //     await Tesseract.recognize(filePath, 'kor+eng', {
    //         logger: (info) => {
    //             if (info.status === 'recognizing text') {
    //                 currentProgress = info.progress;
    //             }
    //         },
    //     }).then(({ data: { text } }) => {
    //         ocrResultText = text;
    //         currentProgress = 1;
    //         isProcessing = false;
    //     });

    //     res.json({
    //         imageUrl: `/uploads/${file.filename}`,
    //         extractedText: ocrResultText,
    //     });
    // } catch (error) {
    //     console.error('OCR Error:', error);
    //     ocrResultText = "Error processing image.";
    //     currentProgress = 1;
    // } finally {
    //     fs.unlink(filePath, (err) => {
    //         if (err) console.error('Failed to delete temporary file:', err);
    //     });
    //     isProcessing = false;
    // }

    const worker = new Worker('./ocrWorker.js', {
        workerData: { filePath: filePath }
    });

    // 워커로부터 진행률과 결과 수신
    worker.on('message', (message) => {
        if (message.progress !== undefined) {
            currentProgress = message.progress;
        }
        if (message.text) {
            ocrResultText = message.text;
            currentProgress = 1;
            isProcessing = false;
        }
    });

    worker.on('error', (error) => {
        console.error('Worker error:', error);
        currentProgress = 1;
        ocrResultText = 'Error during OCR processing.';
        isProcessing = false;
    });

    worker.on('exit', () => {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temporary file:', err);
        });
    });

    res.json({ message: "OCR processing started" });
});

// 루트 경로 (index.html 서빙)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

// 정적 파일 제공 (index.html, result.html)
app.use(express.static(path.join(__dirname, 'public')));

// 서버 종료 시 uploads 폴더 정리
async function clearUploadsFolder() {
    const uploadsDir = path.join(__dirname, 'uploads');
    try {
        const files = await fs.promises.readdir(uploadsDir);
        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            await fs.promises.unlink(filePath);
            console.log(`Deleted: ${filePath}`);
        }
    } catch (err) {
        console.error('Error clearing uploads folder:', err);
    }
}

// 종료 이벤트 핸들링
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    await clearUploadsFolder();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Process terminated.');
    await clearUploadsFolder();
    process.exit(0);
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
