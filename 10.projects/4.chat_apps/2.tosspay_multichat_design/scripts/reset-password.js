/**
 * 비밀번호 초기화 스크립트
 * 사용법: node scripts/reset-password.js <아이디> <새비밀번호>
 * 예: node scripts/reset-password.js myuser 1234
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { getDb } = require('../src/database/index');
const [username, newPassword] = process.argv.slice(2);
if (!username || !newPassword) {
    console.error('사용법: node scripts/reset-password.js <아이디> <새비밀번호>');
    console.error('예: node scripts/reset-password.js myuser 1234');
    process.exit(1);
}

const db = getDb();
const user = db.prepare('SELECT id, username FROM users WHERE username = ?').get(username);
if (!user) {
    console.error('해당 사용자가 없습니다:', username);
    process.exit(1);
}

// bcrypt로 해시 후 DB 비밀번호 갱신
const hash = bcrypt.hashSync(newPassword, 10);
db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, user.id);
console.log('비밀번호가 변경되었습니다:', user.username);
process.exit(0);
