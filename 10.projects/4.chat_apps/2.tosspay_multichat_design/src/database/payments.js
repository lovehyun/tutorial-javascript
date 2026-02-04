/**
 * 결제 테이블 접근: 저장, 조회, 취소 시 크레딧 차감
 */
const { getDb } = require('./index');
const users = require('./users');

/** 결제 완료 시 payments 저장 + 크레딧 적립 + credit_log */
function create(userId, paymentKey, orderId, amount, addedCredits, approvedAt) {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(
        `INSERT INTO payments (user_id, payment_key, order_id, amount, added_credits, approved_at, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)`
    ).run(userId, paymentKey, orderId, amount, addedCredits, approvedAt || now, now);
    users.addCredits(userId, addedCredits, 'payment', orderId);
    return findByPaymentKey(paymentKey);
}

function findByPaymentKey(paymentKey) {
    const db = getDb();
    return db.prepare('SELECT * FROM payments WHERE payment_key = ?').get(paymentKey) || null;
}

function findByUserId(userId) {
    const db = getDb();
    return db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

/** 결제 취소: status 변경 + 해당 크레딧 차감(마이너스 허용) */
function cancel(userId, paymentKey) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM payments WHERE payment_key = ? AND user_id = ?').get(paymentKey, userId);
    if (!row || row.status === 'cancelled') return null;
    db.prepare("UPDATE payments SET status = 'cancelled' WHERE id = ?").run(row.id);
    users.subtractCredits(userId, row.added_credits, 'payment_refund', row.order_id);
    return findById(row.id);
}

function findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM payments WHERE id = ?').get(id) || null;
}

module.exports = { create, findByPaymentKey, findByUserId, cancel, findById };
