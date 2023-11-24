const sqlite3 = require('sqlite3');

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('mydatabase.db');

// 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT)`,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }

        // 모든 사용자 조회
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                console.error('Error querying database:', err);
                return;
            }
            console.log('All Users:', rows);
        });

        // 특정 사용자 조회
        const userId = 1;

        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error querying database:', err);
                return;
            }
            console.log('User with ID', userId, ':', row);
        });

        // 새로운 사용자 생성
        const newUser = {
            username: 'john_doe',
            email: 'john.doe@example.com',
        };

        db.run('INSERT INTO users (username, email) VALUES (?, ?)', [newUser.username, newUser.email], function (err) {
            if (err) {
                console.error('Error inserting into database:', err);
                return;
            }
            console.log('User added with ID:', this.lastID);

            // 사용자 정보 업데이트
            const updateUser = {
                id: 1,
                username: 'updated_user',
                email: 'updated.user@example.com',
            };

            db.run('UPDATE users SET username = ?, email = ? WHERE id = ?',
                [updateUser.username, updateUser.email, updateUser.id],
                (err) => {
                    if (err) {
                        console.error('Error updating database:', err);
                        return;
                    }
                    console.log('User updated successfully');

                    // 사용자 삭제
                    const deleteUser = {
                        id: 2,
                    };
                    db.run('DELETE FROM users WHERE id = ?', [deleteUser.id], (err) => {
                        if (err) {
                            console.error('Error deleting from database:', err);
                            return;
                        }
                        console.log('User deleted successfully');

                        // 데이터베이스 연결 종료
                        db.close();
                    });
                }
            );
        });
});
