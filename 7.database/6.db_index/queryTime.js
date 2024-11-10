// queryTime.js

const sqlite3 = require('sqlite3').verbose();

function connectToDatabase() {
    return new sqlite3.Database('mydatabase.db');
}

function queryName(db, searchName) {
    const selectQuery = 'SELECT * FROM employees WHERE name = ?';

    // 쿼리 실행 시간 측정
    const startTime = process.hrtime();

    db.get(selectQuery, [searchName], (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Result:', row);
        }

        // 쿼리 실행 시간 측정 종료
        const endTime = process.hrtime(startTime);
        console.log(`Query execution time: ${endTime[0]}s ${endTime[1] / 1e6}ms`);
    });
}

function queryAll(db, searchOptions) {
    let selectQuery = 'SELECT * FROM employees WHERE 1=1';
    const queryParams = [];

    if (searchOptions.name) {
        selectQuery += ' AND name = ?';
        queryParams.push(searchOptions.name);
    }
    if (searchOptions.department) {
        selectQuery += ' AND department = ?';
        queryParams.push(searchOptions.department);
    }
    if (searchOptions.salary) {
        selectQuery += ' AND salary = ?';
        queryParams.push(searchOptions.salary);
    }

    // 쿼리 실행 시간 측정 시작
    const startTime = process.hrtime();

    db.all(selectQuery, queryParams, (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Results:', rows);
        }

        // 쿼리 실행 시간 측정 종료
        const endTime = process.hrtime(startTime);
        console.log(`Query execution time: ${endTime[0]}s ${endTime[1] / 1e6}ms`);
    });
}

module.exports = { connectToDatabase, queryName, queryAll };
