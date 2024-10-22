class Car {
    constructor(make, model) {
        this.make = make;
        this.model = model;
    }

    drive() {
        return `${this.make} ${this.model} is driving.`;
    }
}

// 클래스를 사용하여 객체 생성
const myCar = new Car('Hyundai', 'K5');
console.log(myCar.drive()); // 출력: "Hyundai K5 is driving."

