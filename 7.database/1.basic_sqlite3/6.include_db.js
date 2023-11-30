const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('mydatabase.db');

function createTable() {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT
        )`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function insertUser() {
    return new Promise((resolve, reject) => {
        const newUser = { username: 'user1', email: 'user1@example.com' };

        db.run('INSERT INTO users (username, email) VALUES (?, ?)',
            [newUser.username, newUser.email], function(err) {
                if (err) {
                    console.error('데이터 삽입 실패');
                    reject(err);
                } else {
                    console.log('데이터 삽입 성공:', this.lastID);
                    resolve();
                }
            }
        );
    });
}

function updateUser() {
    return new Promise((resolve, reject) => {
        const updateUser = {
            id: 1,
            username: 'user1',
            email: 'user111@example.com'
        };

        db.run('UPDATE users SET username=?, email=? WHERE id=?',
            [updateUser.username, updateUser.email, updateUser.id],
            (err) => {
                if (err) {
                    console.error('수정 실패', err);
                    reject(err);
                } else {
                    console.log('수정 성공');
                    resolve();
                }
            }
        );
    });
}

function deleteUser() {
    return new Promise((resolve, reject) => {
        const delUser = {
            id: 1
        };

        db.run('DELETE FROM users WHERE id=?', [delUser.id], (err) => {
            if (err) {
                console.error('삭제 실패');
                reject(err);
            } else {
                console.log('삭제 성공');
                resolve();
            }
        });
    });
}

function readUser() {
    return new Promise((resolve, reject) => {
        db.each('SELECT * FROM users', (err, row) => {
            if (err) {
                console.error('쿼리실패');
                reject(err);
            } else {
                console.log('All Users: ', row);
                resolve();
            }
        });
    });
}

module.exports = {
    createTable,
    insertUser,
    updateUser,
    deleteUser,
    readUser,
    closeDatabase: () => db.close()
};
