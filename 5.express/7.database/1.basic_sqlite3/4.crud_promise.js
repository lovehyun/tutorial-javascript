const sqlite3 = require('sqlite3');

function createTable() {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
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

function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function insertUser(newUser) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, email) VALUES (?, ?)', [newUser.username, newUser.email], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function updateUser(updateUser) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET username = ?, email = ? WHERE id = ?',
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

function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function main() {
    try {
        await createTable();
        const allUsers = await getAllUsers();
        console.log('All Users:', allUsers);

        const userId = 1;
        const userById = await getUserById(userId);
        console.log('User with ID', userId, ':', userById);

        const newUser = {
            username: 'john_doe',
            email: 'john.doe@example.com',
        };
        const newUserId = await insertUser(newUser);
        console.log('User added with ID:', newUserId);

        const updateUserDetails = {
            id: 1,
            username: 'updated_user',
            email: 'updated.user@example.com',
        };
        await updateUser(updateUserDetails);
        console.log('User updated successfully');

        const deleteUserDetails = {
            id: 2,
        };
        await deleteUser(deleteUserDetails.id);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        db.close();
    }
}

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('mydatabase.db');
main();
