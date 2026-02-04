/**
 * 사용자 조회 스크립트
 * 사용법:
 *   node scripts/list-users.js              → 전체 사용자 목록
 *   node scripts/list-users.js <아이디>     → 해당 사용자만 조회
 * 예: node scripts/list-users.js
 *     node scripts/list-users.js myuser
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { getDb } = require('../src/database/index');

const [username] = process.argv.slice(2);
const db = getDb();

// 인자로 아이디를 주면 해당 사용자만, 없으면 전체 목록
if (username) {
    const user = db.prepare('SELECT id, username, credits, created_at FROM users WHERE username = ?').get(username);
    if (!user) {
        console.error('해당 사용자가 없습니다:', username);
        process.exit(1);
    }
    console.log(JSON.stringify(user, null, 2));
} else {
    const rows = db.prepare('SELECT id, username, credits, created_at FROM users ORDER BY id').all();
    if (rows.length === 0) {
        console.log('등록된 사용자가 없습니다.');
        process.exit(0);
    }
    console.table(rows);
}
process.exit(0);
