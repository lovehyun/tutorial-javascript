const debug = require('debug');

const debugS = new debug('myapp:server');
const debugU = new debug('myapp:upload');
const debugR = new debug('myapp:request');

function enableDebug(debugInstance, condition) {
    if (condition !== undefined) {
        if (condition === '1') {
            debugInstance.enabled = true;
        } else if (condition === '0') {
            debugInstance.enabled = false;
        }
    }
}

function setupDebugMiddleware(app) {
    // 미들웨어를 통해 우선순위가 높게 설정
    app.use('/debug', (req, res, next) => {
        const { server, upload, request } = req.query;

        // 파라미터를 통해 디버그 상태를 동적으로 변경
        enableDebug(debugS, server);
        enableDebug(debugU, upload);
        enableDebug(debugR, request);
        
        res.json({
            server: debugS.enabled ? 1 : 0,
            upload: debugU.enabled ? 1 : 0,
            request: debugR.enabled ? 1 : 0,
        });
    });
}

module.exports = {
    debugS,
    debugU,
    debugR,
    setupDebugMiddleware,
};

// 이 모듈을 사용하는곳에서...
// app.js
// const { debugS, debugU, debugR, setupDebugMiddleware } = require('./debug_dynamic');

// 디버그 미들웨어 설정
// setupDebugMiddleware(app);
