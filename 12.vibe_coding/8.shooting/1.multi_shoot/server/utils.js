// Express 의 trust proxy 가 ON 이면 req.ip 가 X-Forwarded-For 체인을 반영함
function getClientIP(req) {
    return req.ip || req.socket?.remoteAddress || null;
}

// Socket.IO 핸드셰이크에서 IP 추출 (역프록시 X-Forwarded-For 지원)
function getSocketIP(socket) {
    const fwd = socket.handshake.headers['x-forwarded-for'];
    if (fwd) {
        // X-Forwarded-For: client, proxy1, proxy2 → 맨 앞이 원본
        return fwd.split(',')[0].trim();
    }
    return socket.handshake.address || null;
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

module.exports = { getClientIP, getSocketIP, clamp };
