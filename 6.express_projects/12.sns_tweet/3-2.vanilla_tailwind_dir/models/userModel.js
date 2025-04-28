const { db } = require('./db');

function createUser(username, email, password, callback) {
    const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
    db.run(query, [username, email, password], callback);
}

function findUserByEmail(email, callback) {
    const query = 'SELECT * FROM user WHERE email = ?';
    db.get(query, [email], callback);
}

function updateUserProfile(id, username, email, callback) {
    const query = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
    db.run(query, [username, email, id], callback);
}

function findUserById(id, callback) {
    const query = 'SELECT * FROM user WHERE id = ?';
    db.get(query, [id], callback);
}

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
