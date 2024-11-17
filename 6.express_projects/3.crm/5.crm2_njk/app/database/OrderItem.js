// app/database/OrderItem.js
const { Model } = require('./model');

class OrderItem extends Model {
    constructor() {
        super("order_items");
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS order_items (
            id TEXT PRIMARY KEY,
            orderid TEXT,
            itemid TEXT,
            FOREIGN KEY (orderid) REFERENCES orders (id),
            FOREIGN KEY (itemid) REFERENCES items (id)
        );
        `;
        return this.executeQuery(query);
    }
}

module.exports = OrderItem;
