const sqlite3 = require('sqlite3').verbose();

// 1. 데이터베이스 연결
const db = new sqlite3.Database('./transaction_example.sqlite');

db.serialize(() => {
    // 2. 테이블 생성
    db.run('DROP TABLE IF EXISTS accounts');
    db.run(`
        CREATE TABLE accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            balance INTEGER NOT NULL
        )
    `, (err) => {
        if (err) throw err;

        // 3. 초기 데이터 삽입
        db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Alice', 1000]);
        db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Bob', 1000]);
        console.log('초기 계좌 데이터 삽입 완료');

        // 4. 트랜잭션 시작
        db.run('BEGIN TRANSACTION', (err) => {
            if (err) {
                console.error('트랜잭션 시작 실패:', err);
                return;
            }

            console.log('트랜잭션 시작');

            // 예: Alice → Bob에게 200 송금
            db.run('UPDATE accounts SET balance = balance - 200 WHERE name = ?', ['Alice'], (err) => {
                if (err) {
                    console.error('Alice 차감 실패:', err);
                    db.run('ROLLBACK');
                    return;
                }

                // 인위적으로 에러를 발생시켜볼 수도 있음 (예: undefined 변수 접근)
                // throw new Error('강제 에러 발생');

                db.run('UPDATE accounts SET balance = balance + 200 WHERE name = ?', ['Bob'], (err) => {
                    if (err) {
                        console.error('Bob 추가 실패:', err);
                        db.run('ROLLBACK');
                        return;
                    }

                    // 둘 다 성공했으면
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('커밋 실패:', err);
                            db.run('ROLLBACK');
                        } else {
                            console.log('트랜잭션 커밋 완료');
                        }
                    });
                });
            });
        });
    });
});
