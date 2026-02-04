/**
 * SQLite 연결 및 스키마 초기화
 * - users: 회원, payments: 결제 내역, credit_log: 크레딧 증감 이력
 */
const Database = require('better-sqlite3');
const config = require('../config');

let db = null;

/** DB 인스턴스 반환 (최초 1회 연결 후 재사용) */
function getDb() {
    if (!db) {
        db = new Database(config.dbPath);
        initSchema(db);
    }
    return db;
}

/** 테이블 생성 (없을 때만) */
function initSchema(database) {
    database.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            credits INTEGER NOT NULL DEFAULT 10,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            payment_key TEXT NOT NULL UNIQUE,
            order_id TEXT NOT NULL,
            amount INTEGER NOT NULL,
            added_credits INTEGER NOT NULL,
            approved_at TEXT,
            status TEXT NOT NULL DEFAULT 'approved',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS credit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            amount INTEGER NOT NULL,
            reason TEXT NOT NULL,
            ref_id TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
        CREATE INDEX IF NOT EXISTS idx_credit_log_user ON credit_log(user_id);
    `);
}

module.exports = { getDb, initSchema };
