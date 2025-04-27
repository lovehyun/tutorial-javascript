// npm install sqlite3
const sqlite3 = require('sqlite3').verbose();

// 1. 데이터베이스 연결
const db = new sqlite3.Database('./database2.sqlite');

db.serialize(() => {
    // 2. 테이블 초기화
    db.run('DROP TABLE IF EXISTS Post');
    db.run('DROP TABLE IF EXISTS User');

    db.run(`
        CREATE TABLE User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            age INTEGER
        )
    `);

    db.run(`
        CREATE TABLE Post (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            userId INTEGER,
            FOREIGN KEY (userId) REFERENCES User(id)
        )
    `);

    console.log('User와 Post 테이블이 생성되었습니다.');

    // 3. 트랜잭션 시작
    db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
            console.error('트랜잭션 시작 실패:', err);
            return;
        }

        // 3-1. User 삽입
        db.run(
            'INSERT INTO User (name, email, age) VALUES (?, ?, ?)',
            ['Alice', 'alice@example.com', 25],
            function (err) {
                if (err) {
                    console.error('User 삽입 실패:', err.message);
                    db.run('ROLLBACK');
                    return;
                }
                const userId = this.lastID; // 삽입된 User의 ID

                // 3-2. Post 1 삽입
                db.run(
                    'INSERT INTO Post (title, content, userId) VALUES (?, ?, ?)',
                    ['Alice의 첫 게시글', 'Hello world!', userId],
                    (err) => {
                        if (err) {
                            console.error('Post 1 삽입 실패:', err.message);
                            db.run('ROLLBACK');
                            return;
                        }

                        // 3-3. Post 2 삽입
                        db.run(
                            'INSERT INTO Post (title, content, userId) VALUES (?, ?, ?)',
                            ['Alice의 두 번째 게시글', 'Sequelize ORM이 정말 편리해요!', userId],
                            (err) => {
                                if (err) {
                                    console.error('Post 2 삽입 실패:', err.message);
                                    db.run('ROLLBACK');
                                    return;
                                }

                                // 3-4. 트랜잭션 커밋
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        console.error('커밋 실패:', err.message);
                                        db.run('ROLLBACK');
                                    } else {
                                        console.log('트랜잭션 커밋 완료');
                                        이어서조회(userId); // 이후 작업
                                    }
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});

// 4. 이어서 조회 및 유효성 검사
function 이어서조회(userId) {
    // 4-1. User + Post 조인 조회
    db.all(`
        SELECT User.id AS userId, User.name, User.email, User.age, Post.id AS postId, Post.title, Post.content
        FROM User
        LEFT JOIN Post ON User.id = Post.userId
        WHERE User.id = ?
    `, [userId], (err, rows) => {
        if (err) throw err;
        console.log('Alice의 모든 게시글:', rows);

        // 4-2. 유효성 검사 실패 예제 (이름 2글자 미만)
        const invalidName = 'B';
        if (invalidName.length < 2) {
            console.error('유효성 검사 실패: 이름은 2글자 이상이어야 합니다.');
        } else {
            db.run(
                'INSERT INTO User (name, email, age) VALUES (?, ?, ?)',
                [invalidName, 'bob@example.com', 16],
                (err) => {
                    if (err) console.error('User 삽입 실패:', err.message);
                }
            );
        }

        // 4-3. 가상 속성 (디스플레이 이름)
        db.get('SELECT name, age FROM User WHERE id = ?', [userId], (err, user) => {
            if (err) throw err;
            if (user) {
                const displayName = `${user.name} (${user.age} years old)`;
                console.log('Alice의 디스플레이 이름:', displayName);
            }

            // 4-4. 집계 쿼리: 게시글 수, 최신 작성일
            db.get(`
                SELECT COUNT(id) AS totalPosts, MAX(createdAt) AS latestPostDate
                FROM Post
                WHERE userId = ?
            `, [userId], (err, stats) => {
                if (err) throw err;
                console.log('Alice의 게시글 수 및 최신 게시글 날짜:', stats);

                // DB 종료
                db.close();
            });
        });
    });
}
