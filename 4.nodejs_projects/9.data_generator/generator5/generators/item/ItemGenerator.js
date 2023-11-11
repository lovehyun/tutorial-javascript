// generators/store/StoreGenerator.js

const Generator = require('../common/Generator');
const Item = require('../models/Item');

class ItemGenerator extends Generator {
    constructor() {
        super();
        this.itemTypes = {
            "Coffee": {
                "Americano": 3000,
                "Latte": 4000,
                "Espresso": 2500,
                "Cappuccino": 4500,
                "Mocha": 5000
            },
            "Juice": {
                "Orange": 2000,
                "Apple": 2500,
                "Grape": 3000,
                "Pineapple": 3500,
                "Watermelon": 4000
            },
            "Cake": {
                "Chocolate": 6000,
                "Strawberry": 5500,
                "Vanilla": 5000,
                "Red Velvet": 6500,
                "Carrot": 6000
            }
        };
    }

    generate(itemType) {
        if (!itemType) {
            itemType = this.getRandomElement(Object.keys(this.itemTypes));
        }


        const itemSubtype = this.getRandomElement(Object.keys(this.itemTypes[itemType]));
        const unitPrice = this.itemTypes[itemType][itemSubtype];
        const itemName = `${itemSubtype} ${itemType}`;

        return new Item(itemName, itemType, unitPrice);
    }

    generateItems(numRecords) {
        const items = [];
    
        for (let i = 0; i < numRecords; i++) {
            const item = this.generate();
            items.push(item);
        }
    
        return items;
    }

    generateCoffee() {
        return this.generate("Coffee");
    }

    generateJuice() {
        return this.generate("Juice");
    }

    generateCake() {
        return this.generate("Cake");
    }
}

module.exports = ItemGenerator;
