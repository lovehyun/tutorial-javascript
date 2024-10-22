// suv.js
const Car = require('./Car');

class SUV extends Car {
    constructor(brand, model, color, groundClearance) {
        super(brand, model, color);
        this.groundClearance = groundClearance;
    }

    offRoad() {
        console.log(`${this.brand} ${this.model}가 오프로드를 주행합니다.`);
    }
}

module.exports = SUV;
