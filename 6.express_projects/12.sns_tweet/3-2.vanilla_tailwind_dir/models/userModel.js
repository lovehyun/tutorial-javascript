const { db } = require('./db');

// 새로운 사용자 생성
function createUser(username, email, password, callback) {
    const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
    db.run(query, [username, email, password], callback);
}

// 이메일로 사용자 조회
function findUserByEmail(email, callback) {
    const query = 'SELECT * FROM user WHERE email = ?';
    db.get(query, [email], callback);
}

// 사용자 프로필 수정 (아이디로)
function updateUserProfile(id, username, email, callback) {
    const query = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
    db.run(query, [username, email, id], callback);
}

// 사용자 ID로 사용자 조회
function findUserById(id, callback) {
    const query = 'SELECT * FROM user WHERE id = ?';
    db.get(query, [id], callback);
}

// 비밀번호 변경 (아이디로)
function updatePassword(id, newPassword, callback) {
    const query = 'UPDATE user SET password = ? WHERE id = ?';
    db.run(query, [newPassword, id], callback);
}

module.exports = { 
    createUser, 
    findUserByEmail, 
    updateUserProfile, 
    findUserById, 
    updatePassword 
};
