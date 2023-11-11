// generators/models/Order.js

class Order {
    constructor(id, order_at, store_id, user_id) {
        this.id = id;
        this.order_at = order_at;
        this.store_id = store_id;
        this.user_id = user_id;
    }

    toString() {
        return `Id: ${this.id}, Order At: ${this.order_at}, Store Id: ${this.store_id}, User Id: ${this.user_id}`;
    }
}

module.exports = Order;
