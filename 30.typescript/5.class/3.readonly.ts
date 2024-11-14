class Car {
    readonly brand: string;
    readonly model: string;
    readonly year: number;

    constructor(brand: string, model: string, year: number) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
}

const car = new Car("Toyota", "Camry", 2020);
console.log(`Car: ${car.brand}, Model: ${car.model}, Year: ${car.year}`);
// car.year = 2021; // 오류 발생: readonly 속성은 수정할 수 없음
