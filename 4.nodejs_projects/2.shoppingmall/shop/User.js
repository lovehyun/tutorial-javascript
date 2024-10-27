// User.js
class User {
    constructor(name, email, address) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.orderHistory = [];
    }

    addOrder(order) {
        this.orderHistory.push(order);
    }

    getOrderHistory() {
        return this.orderHistory.map(order => order.getOrderSummary());
    }
}

module.exports = User;
