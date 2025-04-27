const express = require('express');
const app = express();
const db = require('./models');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

// 라우트 연결
app.use('/api', userRoutes);

// DB 연결 및 서버 시작
db.sequelize.sync({ force: true }).then(() => {
    console.log('데이터베이스가 초기화되었습니다.');
    app.listen(3000, () => {
        console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
    });
});
