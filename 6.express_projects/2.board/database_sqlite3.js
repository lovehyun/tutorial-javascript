// npm install sqlite3
const sqlite3 = require('sqlite3');

class Database {
    constructor() {
        this.db = new sqlite3.Database('board.sqlite');
    }

    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.db.run('BEGIN TRANSACTION', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    execute(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    executeFetch(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    commit() {
        return new Promise((resolve, reject) => {
            this.db.run('COMMIT', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    rollback() {
        return new Promise((resolve, reject) => {
            this.db.run('ROLLBACK', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Database;

// 예제 사용
async function example() {
    const db = new Database();

    try {
        // 트랜잭션 시작
        await db.beginTransaction();

        // 데이터 추가
        const insertResult = await db.execute("INSERT INTO board(title, message) VALUES (?, ?)", ['title1', 'message1']);
        console.log("Insert Result:", insertResult);

        // 데이터 조회
        const selectResult = await db.executeFetch("SELECT * FROM board");
        console.log("Select Result:", selectResult);

        // 데이터 삭제
        await db.execute("DELETE FROM board");
        console.log("Data deleted");

        // 커밋
        await db.commit();
        console.log("Changes committed");
    } catch (error) {
        // 오류 발생 시 롤백
        await db.rollback();
        console.error("Error:", error);
    } finally {
        // SQLite 연결 종료
        db.db.close();
    }
}

// 위 예제 사용 부분을 주석 해제하고 실행하면 예제가 동작합니다.
// example();
