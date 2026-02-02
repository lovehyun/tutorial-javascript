// npm install ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// import { WebSocketServer } from "ws";
// const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("클라이언트 연결됨!");

    ws.send("서버에 연결되었습니다!");

    ws.on("message", (message) => {
        console.log("클라이언트 메시지:", message.toString());

        // 받은 메시지를 다시 클라이언트에 돌려보냄
        ws.send(`서버가 받은 메시지: ${message}`);
    });

    ws.on("close", () => {
        console.log("클라이언트 연결 종료");
    });
});

console.log("WebSocket 서버 실행 중 (ws://localhost:8080)");
