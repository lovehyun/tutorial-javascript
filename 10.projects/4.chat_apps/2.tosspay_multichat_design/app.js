/**
 * 앱 진입점
 * - .env 기반 설정 로드 후 Express 앱(채팅/결제) listen
 */
const config = require('./src/config');
if (!config.toss.secretKey || !config.toss.clientKey) {
    throw new Error('TOSS_SECRET_KEY, TOSS_CLIENT_KEY를 .env에 설정해주세요.');
}
const chat = require('./src/chat');

chat.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
});
