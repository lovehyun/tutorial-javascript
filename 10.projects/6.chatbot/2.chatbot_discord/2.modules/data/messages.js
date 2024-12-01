const messages = []; // 공통 메시지 저장소

// 메시지 추가
function addMessage(message) {
    messages.push({
        ...message,
        id: messages.length + 1, // ID는 자동 증가
    });
}

// 모든 메시지 조회
function getAllMessages() {
    return messages;
}

// 특정 사용자 메시지 조회
function getMessagesByUserId(userId) {
    return messages.filter((msg) => msg.userId == userId); // 타입을 보지 않고 비교
}

module.exports = {
    addMessage,
    getAllMessages,
    getMessagesByUserId,
};
