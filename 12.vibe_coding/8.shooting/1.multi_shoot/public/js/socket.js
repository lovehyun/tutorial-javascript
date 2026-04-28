// 역프록시 prefix 자동 감지 + Socket.IO 연결 헬퍼
(function (global) {
    // 현재 페이지 경로의 디렉토리 부분이 곧 prefix.
    //  /index.html       → '/'
    //  /room.html        → '/'
    //  /myapp/           → '/myapp/'
    //  /myapp/index.html → '/myapp/'
    //  /myapp/room.html  → '/myapp/'
    function basePath() {
        return window.location.pathname.replace(/[^\/]*$/, '');
    }

    function connect() {
        // ws:// vs wss:// 는 io() 가 자동으로 결정 (페이지 프로토콜 따라감)
        return io({
            path: basePath() + 'socket.io/',
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
        });
    }

    global.MultiShoot = global.MultiShoot || {};
    global.MultiShoot.connect  = connect;
    global.MultiShoot.basePath = basePath;
})(window);
