// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스를 자동으로 연결하는 함수
function connectDB() {
    const dbPath = process.env.DB_PATH || 'simple.db';
    return new sqlite3.Database(path.resolve(__dirname, dbPath));
}

// 프라미스로 변환하는 유틸리티 함수
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        const db = connectDB();
        db.run(query, params, function (err) {
            if (err) {
                db.close();
                return reject(err);
            }
            resolve(this); // `this`는 삽입된 데이터의 ID 등의 정보를 담고 있음
            db.close();
        });
    });
}

function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        const db = connectDB();
        db.get(query, params, (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }
            resolve(row);
            db.close();
        });
    });
}

function allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        const db = connectDB();
        db.all(query, params, (err, rows) => {
            if (err) {
                db.close();
                return reject(err);
            }
            resolve(rows);
            db.close();
        });
    });
}

// 모듈 내보내기
module.exports = {
    runQuery,
    getQuery,
    allQuery
};
