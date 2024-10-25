// car.js
class Car {
    constructor(brand, model, color) {
        this.brand = brand;
        this.model = model;
        this.color = color;
    }

    start() {
        console.log(`${this.brand} ${this.model}가 시동을 걸었습니다.`);
    }

    drive() {
        console.log(`${this.brand} ${this.model}가 운전 중입니다.`);
    }

    stop() {
        console.log(`${this.brand} ${this.model}가 멈췄습니다.`);
    }
}

module.exports = Car;
