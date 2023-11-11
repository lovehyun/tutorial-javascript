// generators/models/Store.js

class Store {
    constructor(id, name, storeType, address) {
        this.id = id;
        this.name = name;
        this.storeType = storeType;
        this.address = address;
    }

    toString() {
        return `Id: ${this.id}, Name: ${this.name}, Type: ${this.storeType}, Address: ${this.address}`;
    }
}

module.exports = Store;
