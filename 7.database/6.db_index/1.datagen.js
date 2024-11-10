const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

const numData = 1_000_000;
// 1%에 해당하는 데이터 개수
const progressStep = Math.floor(numData / 100);

// 테이블 생성
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY,
            name TEXT,
            department TEXT,
            salary INTEGER
        )
    `);
});

// 한글 이름을 랜덤으로 생성하는 함수
function getRandomName() {
    const lastNames = ['김', '이', '박', '최', '정']; // 성씨
    const firstName1 = ['가', '나', '다', '라', '마']; // 이름1
    const firstName2 = ['바', '사', '아', '자', '차']; // 이름2

    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomFirstName1 = firstName1[Math.floor(Math.random() * firstName1.length)];
    const randomFirstName2 = firstName2[Math.floor(Math.random() * firstName2.length)];

    return {
        name: randomLastName + randomFirstName1 + randomFirstName2
    };
}

// 랜덤 부서를 생성하는 함수
function getRandomDepartment() {
    const departments = ['IT', 'HR', 'Engineering', 'Marketing'];
    return departments[Math.floor(Math.random() * departments.length)];
}

// 랜덤 급여를 생성하는 함수
function getRandomSalary() {
    return Math.floor(Math.random() * 90) * 1000 + 10000; // 10,000에서 100,000 사이의 랜덤 급여
}

// numData명의 레코드를 추가
db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const insertStmt = db.prepare('INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)');
    for (let i = 0; i < numData; i++) {
        const { name } = getRandomName();
        const department = getRandomDepartment();
        const salary = getRandomSalary();
        // console.log(name, department, salary);

        // insertStmt.run(name, department, salary);
        insertStmt.run(name, department, salary, function(err) {
            if (err) {
                console.error(err.message);
            }
        });

        // 1%마다 진행 상황을 콘솔에 표시
        if ((i + 1) % progressStep === 0) {
            const progress = ((i + 1) / numData) * 100;
            console.log(`진행률: ${progress.toFixed(2)}% (${i + 1}/${numData})`);
        }
    }

    insertStmt.finalize();
    db.run('COMMIT');
});

// 데이터베이스 연결 종료
db.close();
