// generators/models/OrderItem.js

class OrderItem {
    constructor(id, order_id, item_id) {
        this.id = id;
        this.order_id = order_id;
        this.item_id = item_id;
    }

    toString() {
        return `Id: ${this.id}, Order Id: ${this.order_id}, Item Id: ${this.item_id}`;
    }
}

module.exports = OrderItem;
