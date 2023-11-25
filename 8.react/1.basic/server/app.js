const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS 미들웨어 추가 - 모든 크로스 도메인 허용
app.use(cors());

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
