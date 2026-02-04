const { getDb } = require('./index');
const bcrypt = require('bcryptjs');

/** 회원가입: 비밀번호 해시 저장, 가입 보너스 10 크레딧 + credit_log 기록 */
function createUser(username, password) {
    const db = getDb();
    const hash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();
    const id = db.prepare(
        'INSERT INTO users (username, password_hash, credits, created_at) VALUES (?, ?, 10, ?)'
    ).run(username, hash, now).lastInsertRowid;
    db.prepare(
        'INSERT INTO credit_log (user_id, amount, reason, ref_id, created_at) VALUES (?, 10, ?, NULL, ?)'
    ).run(id, 'signup_bonus', now);
    return findById(id);
}

/** 아이디로 회원 조회 (로그인 시 사용, password_hash 포함) */
function findByUsername(username) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) || null;
}

/** id로 회원 조회 (비밀번호 제외, API용) */
function findById(id) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row ? { id: row.id, username: row.username, credits: row.credits, created_at: row.created_at } : null;
}

/** 크레딧 증가 + credit_log 기록 (reason: payment, coupon 등) */
function addCredits(userId, amount, reason, refId = null) {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare('UPDATE users SET credits = credits + ? WHERE id = ?').run(amount, userId);
    db.prepare('INSERT INTO credit_log (user_id, amount, reason, ref_id, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(userId, amount, reason, refId, now);
    return findById(userId);
}

/** 크레딧 차감 (음수로 addCredits 호출) */
function subtractCredits(userId, amount, reason, refId = null) {
    return addCredits(userId, -amount, reason, refId);
}

module.exports = {
    createUser,
    findByUsername,
    findById,
    addCredits,
    subtractCredits,
};
