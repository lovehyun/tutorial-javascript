// generators/models/Item.js

class Item {
    constructor(name, type, unitPrice) {
        this.name = name;
        this.type = type;
        this.unitPrice = unitPrice;
    }

    toString() {
        return `Name: ${this.name}, Type: ${this.type}, Unit Price: ${this.unitPrice}`;
    }
}

module.exports = Item;
