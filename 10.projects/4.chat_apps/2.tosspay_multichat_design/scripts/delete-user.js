/**
 * 사용자 계정 삭제 스크립트
 * 사용법: node scripts/delete-user.js <아이디>
 * 예: node scripts/delete-user.js myuser
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { getDb } = require('../src/database/index');

const [username] = process.argv.slice(2);
if (!username) {
    console.error('사용법: node scripts/delete-user.js <아이디>');
    console.error('예: node scripts/delete-user.js myuser');
    process.exit(1);
}

const db = getDb();
const user = db.prepare('SELECT id, username FROM users WHERE username = ?').get(username);
if (!user) {
    console.error('해당 사용자가 없습니다:', username);
    process.exit(1);
}

// FK 순서: 사용자 관련 credit_log, payments 먼저 삭제 후 users 삭제
db.prepare('DELETE FROM credit_log WHERE user_id = ?').run(user.id);
db.prepare('DELETE FROM payments WHERE user_id = ?').run(user.id);
db.prepare('DELETE FROM users WHERE id = ?').run(user.id);

console.log('계정이 삭제되었습니다:', user.username);
process.exit(0);
