const sqlite3 = require('sqlite3');

class Database {
    constructor(dbName) {
        this.db = new sqlite3.Database(dbName);
    }

    createTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                email TEXT)`,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getUserById(userId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    insertUser(newUser) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO users (username, email) VALUES (?, ?)', [newUser.username, newUser.email], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    updateUser(updateUser) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE users SET username = ?, email = ? WHERE id = ?',
                [updateUser.username, updateUser.email, updateUser.id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    deleteUser(userId) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;
