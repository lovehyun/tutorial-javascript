// generators/models/Item.js

class Item {
    constructor(id, name, type, unitPrice) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.unitPrice = unitPrice;
    }

    toString() {
        return `Id: ${this.id}, Name: ${this.name}, Type: ${this.type}, Unit Price: ${this.unitPrice}`;
    }
}

module.exports = Item;
