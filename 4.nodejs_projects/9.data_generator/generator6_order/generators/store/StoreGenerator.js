// generators/store/StoreGenerator.js

const Generator = require('../common/Generator');
const AddressGenerator = require('../common/AddressGenerator');
const StoreNameGenerator = require('./StorenameGenerator');
const Store = require('../models/Store');
const uuid = require('uuid');

class StoreGenerator extends Generator {
    constructor() {
        super();
        this.addressGenerator = new AddressGenerator();
        this.storeNameGenerator = new StoreNameGenerator();
    }

    generate() {
        const storeId = uuid.v4();
        const storeType = this.storeNameGenerator.generateType();
        const name = this.storeNameGenerator.generateName(storeType);
        const address = this.addressGenerator.generate();

        return new Store(storeId, name, storeType, address);
    }

    generateStores(numRecords) {
        const stores = [];
    
        for (let i = 0; i < numRecords; i++) {
            const store = this.generate();
            stores.push(store);
        }
    
        return stores;
    }
    
}

module.exports = StoreGenerator;
