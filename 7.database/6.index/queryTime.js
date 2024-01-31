// queryTime.js

const sqlite3 = require('sqlite3').verbose();

function connectToDatabase() {
    const db = new sqlite3.Database('mydatabase.db');
    return db;
}

function queryName(db, searchName) {
    const selectQuery = 'SELECT * FROM employees WHERE name = ?';

    // 쿼리 실행 시간 측정 시작
    const startTime = process.hrtime();

    db.each('EXPLAIN QUERY PLAN ' + selectQuery, [searchName], (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Query Plan:', row.detail);
        }
    });

    db.each(selectQuery, [searchName], (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Result:', row);
        }
    }, () => {
        // 쿼리 실행 시간 측정 종료
        const endTime = process.hrtime(startTime);
        console.log(`Query execution time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
        db.close();
    });
}

function queryAll(db, searchOptions) {
    // 검색 조건에 따라 동적으로 SQL 쿼리 생성
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

    db.each('EXPLAIN QUERY PLAN ' + selectQuery, queryParams, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Query Plan:', row.detail);
        }
    });

    db.each(selectQuery, queryParams, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Result:', row);
        }
    }, () => {
        // 쿼리 실행 시간 측정 종료
        const endTime = process.hrtime(startTime);
        console.log(`Query execution time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
        db.close();
    });
}

module.exports = { connectToDatabase, queryName, queryAll };
