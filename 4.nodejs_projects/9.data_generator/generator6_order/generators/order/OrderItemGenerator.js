// generators/order/OrderItemGenerator.js

const Generator = require('../common/Generator');
const OrderItem = require('../models/OrderItem');
const readUUIDs = require('./readUuidFromCsv');
const uuid = require('uuid');

class OrderItemGenerator extends Generator {
    constructor() {
        super();

    }

    async init() {
        const { itemUUIDs, orderUUIDs } = await readUUIDs();
        this.orderUUIDs = orderUUIDs;
        this.itemUUIDs = itemUUIDs;
    }

    generate() {
        const orderUUID = this.getRandomElement(this.orderUUIDs);
        const itemUUID = this.getRandomElement(this.itemUUIDs);
        
        const orderItemID = uuid.v4();
        
        return new OrderItem(orderItemID, orderUUID, itemUUID);
    }

    generateOrderItems(numRecords) {
        const orderitems = [];
    
        for (let i = 0; i < numRecords; i++) {
            const orderitem = this.generate();
            orderitems.push(orderitem);
        }
    
        return orderitems;
    }
}

module.exports = OrderItemGenerator;
