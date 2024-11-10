// app/database/model.js
const sqlite3 = require('sqlite3').verbose();

const dbPath = 'app/database/user-sample.sqlite';

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) console.error("Could not connect to database", err);
            else console.log("Connected to database");
        });
    }

    close() {
        this.db.close((err) => {
            if (err) console.error("Error closing the database", err);
            else console.log("Database connection closed.");
        });
    }

    execute(query, params = []) {
        return new Promise((resolve, reject) => {
            const isSelect = query.trim().toLowerCase().startsWith("select");
            const isSingle = query.trim().toLowerCase().includes("limit 1");
            const callback = (err, result) => {
                if (err) reject(err);
                else resolve(result);
            };

            if (isSelect && isSingle) {
                this.db.get(query, params, callback);
            } else if (isSelect) {
                this.db.all(query, params, callback);
            } else {
                this.db.run(query, params, function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                });
            }
        });
    }
}

class Model {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = new Database();
    }

    executeQuery(query, params = []) {
        return this.db.execute(query, params);
    }

    close() {
        this.db.close();
    }
}

module.exports = { Database, Model };
