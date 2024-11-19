const debug = require('debug');

const debugS = new debug('myapp:server');
const debugU = new debug('myapp:upload');
const debugR = new debug('myapp:request');

module.exports = {
    debugS,
    debugU,
    debugR,
};

// 다른 메인 애플리케이션에서...
// app.js
// const { debugS, debugU, debugR } = require('./debug_static'); // 디버그 모듈 불러오기
