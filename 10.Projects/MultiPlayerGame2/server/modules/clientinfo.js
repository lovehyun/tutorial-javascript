// clientinfo.js

// 클라이언트 관리
const clients = new Map(); // 클라이언트 관리를 위해 Map 사용

const clientInfo = {
    ws: null, // WebSocket 연결 정보 (클라이언트 IP 등 관리)
    spaceshipPosition: { x: null, y: null }, // 우주선 위치
    score: 0, // 점수
    stage: 1, // 현재 스테이지
    gameover: false, // 게임 종료 상태
    isPaused: false, // 게임 중지 상태 (화면 visibility 에 따른)
};

// ========================================================
// 사용자 전달 메세지 관리
// ========================================================

// 사용자 공지 사항
const announcement = [];

// 클라이언트 공지사항 메세지 추가 및 삭제
function addAndDestroyAnnounce(message) {
    const default_remove_second = 5;
    announcement.push(message);
    setTimeout(() => {
        const index = announcement.indexOf(message);
        if (index !== -1) {
            announcement.splice(index, 1);
        }
    }, default_remove_second * 1000);
}

module.exports = { clients, clientInfo, announcement, addAndDestroyAnnounce }
