// insert_users_and_tweets_final.js

const sqlite3 = require('sqlite3').verbose();

// DB 연결
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('DB 연결 실패:', err.message);
    } else {
        console.log('DB 연결 성공');
        insertSampleUsers();
    }
});

// 5명 샘플 사용자 목록
const sampleUsers = [
    { username: 'user1', email: 'user1@example.com', password: 'password1' },
    { username: 'user2', email: 'user2@example.com', password: 'password2' },
    { username: 'user3', email: 'user3@example.com', password: 'password3' },
    { username: 'user4', email: 'user4@example.com', password: 'password4' },
    { username: 'user5', email: 'user5@example.com', password: 'password5' },
];

// 1. 사용자 삽입 함수
function insertSampleUsers() {
    db.serialize(() => {
        const checkQuery = 'SELECT id FROM user WHERE username = ?';
        const insertQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';

        let insertedUsers = []; // id 정보까지 저장
        let completed = 0; // 몇 명 처리했는지 카운트

        sampleUsers.forEach((user) => {
            db.get(checkQuery, [user.username], (err, row) => {
                if (err) {
                    console.error('사용자 조회 실패:', err.message);
                    return;
                }

                if (row) {
                    console.log(`🔵 ${user.username} 이미 존재 (id=${row.id})`);
                    insertedUsers.push({ ...user, id: row.id });
                    checkAllUsersProcessed();
                } else {
                    db.run(insertQuery, [user.username, user.email, user.password], function(err) {
                        if (err) {
                            console.error('사용자 삽입 실패:', err.message);
                        } else {
                            console.log(`🟢 ${user.username} 삽입 완료 (id=${this.lastID})`);
                            insertedUsers.push({ ...user, id: this.lastID });
                        }
                        checkAllUsersProcessed();
                    });
                }
            });
        });

        function checkAllUsersProcessed() {
            completed++;
            if (completed === sampleUsers.length) {
                console.log('✅ 사용자 준비 완료');
                insertSampleTweets(insertedUsers);
            }
        }
    });
}

// 2. 트윗 1000개 삽입 함수
function insertSampleTweets(users) {
    if (users.length === 0) {
        console.error('❌ 사용자 없음, 트윗 삽입 불가');
        db.close();
        return;
    }

    const totalTweets = 1000;
    const userIds = users.map(u => u.id);

    db.serialize(() => {
        const insertQuery = 'INSERT INTO tweet (content, user_id, likes_count) VALUES (?, ?, 0)';
        const stmt = db.prepare(insertQuery);

        for (let i = 1; i <= totalTweets; i++) {
            const userId = userIds[(i - 1) % userIds.length]; // 1~5번 사용자 순환
            const content = `안녕하세요 ${i}번째 트윗입니다!`;

            stmt.run(content, userId);
        }

        stmt.finalize((err) => {
            if (err) {
                console.error('❌ 트윗 삽입 실패:', err.message);
            } else {
                console.log(`✅ 샘플 트윗 ${totalTweets}개 삽입 완료`);
            }
            db.close();
        });
    });
}
