// app/database/Store.js
const { Model } = require('./model');

class Store extends Model {
    constructor() {
        super("stores");
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS stores (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            address TEXT
        );
        `;
        return this.executeQuery(query);
    }
}

module.exports = Store;
