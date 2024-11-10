const { connectToDatabase } = require('./queryTime');

const db = connectToDatabase();

// 인덱스 추가
console.log('인덱스를 추가 중...');
db.run('CREATE INDEX IF NOT EXISTS idx_name ON employees(name)', (err) => {
    if (err) {
        return console.error('idx_name 인덱스 생성 오류:', err.message);
    }
    console.log('idx_name 인덱스가 생성되었습니다.');

    db.run('CREATE INDEX IF NOT EXISTS idx_department_salary ON employees(department, salary)', (err) => {
        if (err) {
            return console.error('idx_department_salary 인덱스 생성 오류:', err.message);
        }
        console.log('idx_department_salary 인덱스가 생성되었습니다.');

        // 모든 작업 후 데이터베이스 닫기
        db.close();
    });
});
