const debug = require('debug');

const debugS = debug('myapp:server');
const debugU = debug('myapp:upload');
const debugR = debug('myapp:request');

module.exports = {
    debugS,
    debugU,
    debugR,
};

// 다른 메인 애플리케이션에서...
// app.js
// const { debugS, debugU, debugR } = require('./debug'); // 디버그 모듈 불러오기
