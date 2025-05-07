// utility.js
const Database = require('better-sqlite3');

// DB 초기화
const db = new Database('history.db');
db.exec(`
    CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS conversation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        role TEXT,
        content TEXT
    );
`);

// 현재 세션 가져오기
function getCurrentSession() {
    const session = db.prepare("SELECT id, start_time FROM session ORDER BY start_time DESC LIMIT 1").get();
    if (!session) {
        const insert = db.prepare("INSERT INTO session DEFAULT VALUES").run();
        return db.prepare("SELECT id, start_time FROM session WHERE id = ?").get(insert.lastInsertRowid);
    }
    return session;
}

// 특정 세션의 대화 가져오기
function getConversationBySession(sessionId) {
    const conversation = db.prepare("SELECT * FROM conversation WHERE session_id = ? ORDER BY id");
    return conversation.all(sessionId);
}

// 최근 대화 (10개)
function getRecentConversation(sessionId) {
    return db.prepare("SELECT * FROM conversation WHERE session_id = ? ORDER BY id DESC LIMIT 10").all(sessionId).reverse();
}

// 대화 저장
function saveMessage(sessionId, role, content) {
    db.prepare("INSERT INTO conversation (session_id, role, content) VALUES (?, ?, ?)").run(sessionId, role, content);
}

// 세션 생성
function newSession() {
    return db.prepare("INSERT INTO session DEFAULT VALUES").run();
}

// 전체 세션 목록
function getAllSessions() {
    return db.prepare("SELECT id, start_time FROM session ORDER BY start_time DESC").all();
}

// 특정 세션 대화 내역
function getSessionById(sessionId) {
    return db.prepare("SELECT id, start_time FROM session WHERE id = ?").get(sessionId);
}

// 전체 대화 (세션 구분 없음)
function getAllConversation() {
    return db.prepare("SELECT * FROM conversation ORDER BY id").all();
}

module.exports = {
    getCurrentSession,
    getConversationBySession,
    getRecentConversation,
    saveMessage,
    newSession,
    getAllSessions,
    getSessionById,
    getAllConversation,
};
