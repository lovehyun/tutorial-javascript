const express = require('express');
const cors = require('cors');

const app = express();

// 모든 출처의 요청을 허용
app.use(cors());

// 특정 출처만 허용
// app.use(cors({
//     origin: 'http://allowed-origin.com',
// }));
  
// 또는 여러 출처를 허용하고자 할 때
// app.use(cors({
    // origin: ['http://allowed-origin1.com', 'http://allowed-origin2.com'],
// }));

// 라우트 예시
app.get('/', (req, res) => {
    res.send('Hello CORS!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
