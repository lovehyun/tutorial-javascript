// npm install better-sqlite3
const BetterSqlite3 = require('better-sqlite3');

class Database {
    constructor() {
        this.db = new BetterSqlite3('board.sqlite');
    }

    execute(query, params = []) {
        try {
            const statement = this.db.prepare(query);
            const result = statement.run(params);
            return { lastID: result.lastInsertRowid, changes: result.changes };
        } catch (error) {
            throw error;
        }
    }

    executeFetch(query, params = []) {
        try {
            const statement = this.db.prepare(query);
            const rows = statement.all(params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // 트랜잭션 관련 메서드 (better-sqlite3에서 자동으로 처리되므로 빈 껍데기 함수로 구현)
    beginTransaction() {
        // 트랜잭션 시작 (better-sqlite3에서는 자동으로 처리)
    }

    commit() {
        // 트랜잭션 커밋 (better-sqlite3에서는 자동으로 처리)
    }

    rollback() {
        // 롤백 (better-sqlite3에서는 자동으로 처리)
    }

    close() {
        try {
            this.db.close();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Database;

// 예제 사용
function example() {
    const db = new Database();

    try {
        // 데이터 추가
        const insertResult = db.execute("INSERT INTO board(title, message) VALUES (?, ?)", ['title1', 'message1']);
        console.log("Insert Result:", insertResult);

        // 데이터 조회
        const selectResult = db.executeFetch("SELECT * FROM board");
        console.log("Select Result:", selectResult);

        // 데이터 삭제
        db.execute("DELETE FROM board");
        console.log("Data deleted");

        // SQLite 연결 종료
        console.log("Connection closed");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        // SQLite 연결 종료
        db.close();
    }
}

// 위 예제 사용 부분을 주석 해제하고 실행하면 예제가 동작합니다.
// example();
