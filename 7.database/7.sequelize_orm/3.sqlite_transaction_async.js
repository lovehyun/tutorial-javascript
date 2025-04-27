const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

// 1. 데이터베이스 연결
const db = new sqlite3.Database('./transaction_async_example.sqlite');

// 2. sqlite3 기본 함수들을 Promise로 변환
const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

// 3. 트랜잭션 처리 함수
async function transferMoney(sender, receiver, amount) {
    try {
        await run('BEGIN TRANSACTION');

        // 보내는 사람 잔액 차감
        await run('UPDATE accounts SET balance = balance - ? WHERE name = ?', [amount, sender]);

        // 여기서 강제 에러 발생시키고 롤백되는지 테스트할 수도 있어요
        // throw new Error('강제 에러 발생!');

        // 받는 사람 잔액 증가
        await run('UPDATE accounts SET balance = balance + ? WHERE name = ?', [amount, receiver]);

        await run('COMMIT');
        console.log('트랜잭션 커밋 완료: 송금 성공');
    } catch (error) {
        console.error('에러 발생:', error.message);
        await run('ROLLBACK');
        console.log('트랜잭션 롤백 완료: 송금 취소');
    }
}

// 4. 초기화 및 송금 시나리오
async function main() {
    try {
        // 테이블 생성 및 초기 데이터 삽입
        await run('DROP TABLE IF EXISTS accounts');
        await run(`
            CREATE TABLE accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                balance INTEGER NOT NULL
            )
        `);
        await run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Alice', 1000]);
        await run('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Bob', 1000]);
        console.log('초기 계좌 생성 완료');

        // 송금 실행
        await transferMoney('Alice', 'Bob', 200);

        // 결과 조회
        const accounts = await all('SELECT * FROM accounts');
        console.log('현재 계좌 현황:', accounts);
    } catch (err) {
        console.error('메인 함수 에러:', err.message);
    } finally {
        db.close();
    }
}

main();
