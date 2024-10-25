// sedan.js
const Car = require('./Car');

class Sedan extends Car {
    constructor(brand, model, color, trunkSize) {
        super(brand, model, color);
        this.trunkSize = trunkSize;
    }

    openTrunk() {
        console.log(`${this.brand} ${this.model}의 트렁크를 엽니다. 크기: ${this.trunkSize}L`);
    }
}

module.exports = Sedan;
