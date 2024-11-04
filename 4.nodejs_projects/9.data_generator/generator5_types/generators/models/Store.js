// generators/models/Store.js

class Store {
    constructor(name, storeType, address) {
        this.name = name;
        this.storeType = storeType;
        this.address = address;
    }

    toString() {
        return `Name: ${this.name}, Type: ${this.storeType}, Address: ${this.address}`;
    }
}

module.exports = Store;
