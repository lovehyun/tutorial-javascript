// app/database/Order.js
const { Model } = require('./model');

class Order extends Model {
    constructor() {
        super("orders");
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            orderat TEXT,
            storeid TEXT,
            userid TEXT,
            FOREIGN KEY (storeid) REFERENCES stores (id),
            FOREIGN KEY (userid) REFERENCES users (id)
        );
        `;
        return this.executeQuery(query);
    }
}

module.exports = Order;
