// 보안상의 이유로 앱 비밀번호를 사용하는 것을 권장하며, 
// Gmail 설정에서 "보안 수준이 낮은 앱의 액세스"를 허용해야 합니다.

const nodemailer = require('nodemailer');
require('dotenv').config(); // dotenv를 사용하여 환경 변수 로드

// 이메일 발송에 필요한 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // user: 'your_email@gmail.com',
        // pass: 'your_email_password',
        user: process.env.GMAIL_EMAIL, // dotenv로부터 이메일 가져오기
        pass: process.env.GMAIL_PASSWORD, // dotenv로부터 비밀번호 가져오기
    },
});

// 이메일 내용
const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: '수신자이메일주소',
    subject: '테스트 이메일',
    text: '안녕하세요, 이것은 Node.js로 보낸 테스트 이메일입니다.',
};

// 이메일 발송
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log('이메일 전송 성공: ' + info.response);
    }
});
