// Order.js
const { Product } = require('./Product');

class Order {
    constructor(user) {
        this.user = user;
        this.products = [];
        this.totalAmount = 0;
    }

    addProduct(product, quantity) {
        if (product.checkAvailability(quantity)) {
            this.products.push({ product, quantity });
            this.totalAmount += product.price * quantity;
            product.updateStock(-quantity);
        } else {
            console.log(`Sorry, ${product.name} is out of stock or insufficient quantity.`);
        }
    }

    getOrderSummary() {
        return {
            user: this.user.name,
            totalAmount: this.totalAmount,
            items: this.products.map(({ product, quantity }) => ({
                name: product.name,
                quantity: quantity,
                price: product.price
            }))
        };
    }
}

module.exports = Order;
