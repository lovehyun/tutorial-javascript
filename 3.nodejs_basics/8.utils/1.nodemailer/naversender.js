// 성공메시지: 250 2.0.0 OK QpR4FTMmRGuSP+YmoX-+3Q - nsmtp

const nodemailer = require('nodemailer');
require('dotenv').config(); // dotenv를 사용하여 환경 변수 로드

// 네이버 메일 SMTP 설정
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

// 이메일 내용
const mailOptions = {
    // from: 'your_naver_email@naver.com',
    // to: 'recipient_email@example.com',
    from: process.env.NAVER_EMAIL,
    to: '수신자이메일주소',
    subject: '테스트 이메일',
    text: '안녕하세요, 이것은 네이버 메일로 보낸 테스트 이메일입니다.',
};

// 이메일 발송
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log('이메일 전송 성공: ' + info.response);
    }
});
