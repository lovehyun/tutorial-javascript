// generators/order/OrderGenerator.js

const Generator = require('../common/Generator');
const Order = require('../models/Order');
const readUUIDs = require('./readUuidFromCsv');
const uuid = require('uuid');

class OrderGenerator extends Generator {
    constructor() {
        super();
        this.start = new Date(2023, 0, 1);  // 범위의 시작 날짜
        this.end = new Date(2023, 11, 31);  // 범위의 끝 날짜
    }

    async init() {
        const { userUUIDs, storeUUIDs } = await readUUIDs();
        this.userUUIDs = userUUIDs;
        this.storeUUIDs = storeUUIDs;
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 포맷
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    generate() {
        // 범위 내에서 랜덤한 날짜 생성
        const timeDifference = this.end - this.start;
        const randomMilliseconds = Math.floor(Math.random() * timeDifference);
        const orderAt = new Date(this.start.getTime() + randomMilliseconds);

        const orderAtFormatted = this.formatDate(orderAt);

        const userId = this.getRandomElement(this.userUUIDs);
        const storeId = this.getRandomElement(this.storeUUIDs);
 
        const orderId = uuid.v4();
        const order = new Order(orderId, orderAtFormatted, storeId, userId);

        return order;
    }

    generateOrders(numRecords) {
        const orders = [];
    
        for (let i = 0; i < numRecords; i++) {
            const order = this.generate();
            orders.push(order);
        }
    
        return orders;
    }
}

module.exports = OrderGenerator;
