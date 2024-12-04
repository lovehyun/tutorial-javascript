const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const fsp = require('fs').promises; // 비동기 작업용
const path = require('path');
const debug = require('debug');

const debugS = new debug('myapp:server');
const debugU = new debug('myapp:upload');
const debugR = new debug('myapp:request');

const app = express();
const port = 3000;

// Ensure directories exist
const ensureDirectoryExistence = async (dirPath) => {
    try {
        await fsp.mkdir(dirPath, { recursive: true });
        console.log(`Directory ensured: ${dirPath}`);
    } catch (error) {
        console.error(`Error ensuring directory: ${dirPath}`, error);
    }
};

// Initialize directories
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const thumbnailsDir = path.join(__dirname, 'public', 'thumbnails');
ensureDirectoryExistence(uploadsDir);
ensureDirectoryExistence(thumbnailsDir);

// CORS 설정
app.use(
    cors({
        origin: "http://localhost:3001", // React 개발 서버 주소
        methods: ["GET", "POST", "DELETE"], // 허용할 HTTP 메서드
        allowedHeaders: ["Content-Type"], // 허용할 헤더
    })
);

// Initialize express app
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    debugR(req.method, req.originalUrl);
    next();
});

let posts = [];

// File upload configuration
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '_' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// Fetch all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Create a new post
app.post('/api/posts', upload.single('photo'), async (req, res) => {
    const { title, content } = req.body;
    const date = new Date();
    const filePath = req.file ? req.file.path : null;
    const filename = filePath ? `${req.file.filename}` : null;
    const thumbnailPath = filePath ? path.join('thumbnails', `thumb_${req.file.filename}`) : null;

    const newPost = { title, content, date, filePath, filename, thumbnailPath };
    posts.push(newPost);
    debugU(posts);

    if (filePath) {
        try {
            await sharp(filePath)
                .resize(100)
                .toFile(path.join(__dirname, 'public', thumbnailPath));
        } catch (err) {
            console.error('Error creating thumbnail:', err);
        }
    }
    res.status(201).json(newPost);
});

// Delete a post
app.delete('/api/posts/:index', async (req, res) => {
    const index = parseInt(req.params.index, 10);
    const post = posts[index - 1];

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    try {
        if (post.filePath) {
            await fsp.unlink(path.join(__dirname, post.filePath));
        }
        if (post.thumbnailPath) {
            await fsp.unlink(path.join(__dirname, 'public', post.thumbnailPath));
        }
        posts.splice(index - 1, 1);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting files:', err);
        res.status(500).json({ message: 'Error deleting files' });
    }

    // // 응답을 먼저 반환
    // res.status(200).json({ message: 'Post deletion initiated' });
    // 
    // // 비동기 작업을 백그라운드에서 수행
    // Promise.all([
    //     post.filePath ? fsp.unlink(path.join(__dirname, post.filePath)) : Promise.resolve(),
    //     post.thumbnailPath ? fsp.unlink(path.join(__dirname, 'public', post.thumbnailPath)) : Promise.resolve(),
    // ])
    //     .then(() => {
    //         posts.splice(index - 1, 1);
    //         console.log(`Post ${index} deleted successfully`);
    //     })
    //     .catch(err => {
    //         console.error(`Error deleting post ${index}:`, err);
    //     });
});

// View an image
app.get('/images/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'public', 'uploads', filename);

    // 파일 존재 여부 확인
    try {
        // 파일 접근 가능 여부 확인
        await fsp.access(filepath);

        // 적절한 Content-Type 설정
        const mimeType = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
        }[path.extname(filename).toLowerCase()] || 'application/octet-stream';

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`); // 브라우저에서 바로 보기

        res.sendFile(filepath);
    } catch (err) {
        console.error(`File not found: ${filepath}`, err);
        return res.status(404).json({ message: 'File not found' });
    }

});

// Serve thumbnails statically
app.use('/thumbnails', express.static(path.join(__dirname, 'public', 'thumbnails')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    debugS('Server is ready...');
});
