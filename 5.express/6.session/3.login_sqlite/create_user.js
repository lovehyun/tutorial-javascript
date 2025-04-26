// create_user.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// DB 연결
const db = new sqlite3.Database('users.db');

// 사용자 정보
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// 사용자 삽입
async function insertUsers() {
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        db.run(
            `INSERT INTO users (username, password) VALUES (?, ?)`,
            [user.username, hashedPassword],
            (err) => {
                if (err) {
                    console.error('사용자 삽입 오류:', err.message);
                } else {
                    console.log(`${user.username} 등록 완료`);
                }
            }
        );
    }
}

insertUsers();
