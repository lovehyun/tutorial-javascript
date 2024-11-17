// app/database/Item.js
const { Model } = require('./model');

class Item extends Model {
    constructor() {
        super("items");
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            unitprice TEXT
        );
        `;
        return this.executeQuery(query);
    }
}

module.exports = Item;
