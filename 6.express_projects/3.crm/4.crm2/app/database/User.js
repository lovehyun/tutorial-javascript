// app/database/User.js
const { Model } = require('./model');

class User extends Model {
    constructor() {
        super("users");
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            gender TEXT,
            age INTEGER,
            birthdate TEXT,
            address TEXT
        );
        `;
        return this.executeQuery(query);
    }
}

module.exports = User;
