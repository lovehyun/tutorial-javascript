/**
 * 크레딧 사용 내역(credit_log) 조회
 */
const { getDb } = require('./index');

/** 해당 사용자의 크레딧 증감 이력 (최신순, limit건) */
function getByUserId(userId, limit = 50) {
    const db = getDb();
    return db.prepare(
        'SELECT * FROM credit_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
    ).all(userId, limit);
}

module.exports = { getByUserId };
