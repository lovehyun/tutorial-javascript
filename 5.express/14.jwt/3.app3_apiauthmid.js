// curl 127.0.0.1:3000/ -c cookie.txt --cookie cookie.txt
// curl 127.0.0.1:3000/api/data -c cookie.txt --cookie cookie.txt

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const app = express();
const port = 3000;

const secretKey = 'yourSecretKey'; // JWT 서명을 위한 시크릿 키

app.use(cookieParser());
app.use(morgan('dev'));

app.use((req, res, next) => {
    // 클라이언트에게 JWT 생성 및 전송
    const clientId = 'uniqueClientId'; // 클라이언트의 고유 식별자
    const token = jwt.sign({ clientId }, secretKey, { expiresIn: '1h' });

    // 클라이언트에게 JWT를 쿠키에 저장하거나 응답 헤더에 넣어 전달
    res.cookie('jwt', token, { httpOnly: true });

    // 다음 미들웨어로 이동
    next();
});

// JWT 검증 미들웨어
app.use((req, res, next) => {
    // 클라이언트로부터 JWT를 가져옴 (쿠키에서 추출하는 등의 방법)
    const token = req.cookies.jwt;

    // JWT 검증
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            // JWT가 유효하지 않으면 에러 처리
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // 클라이언트의 고유 식별자를 추출할 수 있음
        const clientId = decoded.clientId;

        // 특정 클라이언트에 대한 처리 수행
        if (clientId === 'uniqueClientId') {
            // 클라이언트에 대한 처리 수행

            // 클라이언트가 허용된 경우 다음 미들웨어로 이동
            next();
        } else {
            // 클라이언트가 허용되지 않은 경우 에러 처리
            res.status(403).json({ message: 'Forbidden' });
        }
    });
});

// 예제 API 엔드포인트
app.get('/api/data', (req, res) => {
    const responseData = { message: 'This is data from the API endpoint!' };
    res.json(responseData);
});

app.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
