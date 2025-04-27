const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// 순서 보장 X: SELECT가 INSERT보다 먼저 실행될 수도 있어서, rows가 비어 있을 수 있음.
/*
db.run('CREATE TABLE user (id INT, name TEXT)');
db.run('INSERT INTO user VALUES (?, ?)', [1, 'Alice']);
db.all('SELECT * FROM user', (err, rows) => {
    console.log(rows);
});
*/

// 순서 보장 O: 항상 CREATE → INSERT → SELECT 순서대로 실행됨.
db.serialize(() => {
    db.run('CREATE TABLE user (id INT, name TEXT)');
    db.run('INSERT INTO user VALUES (?, ?)', [1, 'Alice']);
    db.all('SELECT * FROM user', (err, rows) => {
        console.log(rows); // 이제 무조건 [ { id: 1, name: 'Alice' } ]
    });
});
