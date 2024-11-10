const { connectToDatabase } = require('./queryTime');

const db = connectToDatabase();

// 인덱스 삭제
console.log('기존 인덱스를 삭제 중...');
db.run('DROP INDEX IF EXISTS idx_name', (err) => {
    if (err) {
        return console.error('idx_name 인덱스 삭제 오류:', err.message);
    }
    console.log('idx_name 인덱스가 삭제되었습니다.');

    db.run('DROP INDEX IF EXISTS idx_department_salary', (err) => {
        if (err) {
            return console.error('idx_department_salary 인덱스 삭제 오류:', err.message);
        }
        console.log('idx_department_salary 인덱스가 삭제되었습니다.');

        // 모든 작업 후 데이터베이스 닫기
        db.close();
    });
});
