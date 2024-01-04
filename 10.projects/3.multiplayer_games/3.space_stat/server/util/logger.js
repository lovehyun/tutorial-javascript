// logger.js

const { createLogger, format, transports } = require('winston');
const moment = require('moment-timezone');

// ========================================================
// 로깅 등 기본 서버 관리
// ========================================================

// 로그 레벨 설정
let logLevel = process.env.LOG_LEVEL;
if (!logLevel) {
    if (process.env.NODE_ENV === 'PRODUCTION') {
        logLevel = 'info';
    } else {
        logLevel = 'debug';
    }
}

// 로그 포맷팅 설정
const logger = createLogger({
    level: logLevel, // 로그 레벨 설정
    format: format.combine(
        format.timestamp({ // 타임스탬프 타임존 추가
            format: () => moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss.SSS')
        }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console() // 콘솔 출력 설정
    ]
});

module.exports = { logger };
