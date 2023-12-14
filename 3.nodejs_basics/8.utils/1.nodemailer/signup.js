const express = require('express');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const morgan = require('morgan');
require('dotenv').config(); // dotenv를 사용하여 환경 변수 로드

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// 이메일 보내기를 위한 nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 465,
    auth: {
        // user: 'your_naver_email@naver.com',
        // pass: 'your_naver_password',
        user: process.env.NAVER_EMAIL, // dotenv로부터 이메일 가져오기
        pass: process.env.NAVER_PASSWORD, // dotenv로부터 비밀번호 가져오기
    },
});

// 실제 프로덕션 환경에서는 데이터베이스를 사용해야 합니다.
const database = {
    users: [] // 실제 데이터베이스로 대체되어야 합니다.
};

// 인증 코드 생성 함수
const generateVerificationCode = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};

// 회원 가입 폼 렌더링
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

// 회원 가입 요청 처리
app.post('/signup', (req, res) => {
    const userEmail = req.body.email;
    const verificationCode = generateVerificationCode();

    // 데이터베이스에 사용자 정보 저장
    database.users.push({ email: userEmail, verificationCode: verificationCode });
    console.log(database.users);

    // 이메일로 인증 코드 발송
    const mailOptions = {
        from: process.env.NAVER_EMAIL,
        to: userEmail,
        subject: '회원 가입 인증 코드',
        text: `인증 코드: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: '이메일 발송 중 오류가 발생했습니다.' });
        } else {
            console.log('인증 이메일 전송 성공: ' + info.response);
            res.json({ message: '이메일로 인증 코드가 발송되었습니다.' });
        }
    });

});

// 회원 가입 완료 처리
app.post('/verify', (req, res) => {
    const userEmail = req.body.email;
    const userCode = req.body.code;

    // 데이터베이스에서 저장된 인증 코드를 가져와서 확인
    const user = database.users.find(user => user.email === userEmail);
    console.log(`입력값: ${userEmail}, ${userCode}`);
    console.log(user, userCode === user.verificationCode);

    if (user && userCode === user.verificationCode) {
        // 인증 코드가 일치하면 회원 가입 완료 처리
        // 여기에서는 실제로 데이터베이스에 사용자 정보를 저장하거나 필요한 작업을 수행합니다.
        res.json({ message: '회원 가입이 완료되었습니다.' });
    } else {
        res.status(400).json({ message: '인증 코드가 일치하지 않습니다.' });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
