// 기본 자동차 클래스
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

// 특정 차량 클래스
class Sedan extends Car {
    constructor(brand, model, color, trunkSize) {
        super(brand, model, color);
        this.trunkSize = trunkSize;
    }

    openTrunk() {
        console.log(`${this.brand} ${this.model}의 트렁크를 엽니다. 크기: ${this.trunkSize}L`);
    }
}

class SUV extends Car {
    constructor(brand, model, color, groundClearance) {
        super(brand, model, color);
        this.groundClearance = groundClearance;
    }

    offRoad() {
        console.log(`${this.brand} ${this.model}가 오프로드를 주행합니다.`);
    }
}

// 사람 클래스
class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    greet() {
        console.log(`안녕하세요, 저는 ${this.name}입니다.`);
    }

    getInCar(car) {
        console.log(`${this.name}이(가) ${car.brand} ${car.model}에 탑승했습니다.`);
    }
}

// 부모 클래스
class Parent extends Person {
    constructor(name, age, gender, job) {
        super(name, age, gender);
        this.job = job;
    }

    driveCar(car) {
        console.log(`${this.name}이(가) ${car.brand} ${car.model}를 운전하고 있습니다.`);
    }
}

// 자녀 클래스
class Child extends Person {
    constructor(name, age, gender, schoolGrade) {
        super(name, age, gender);
        this.schoolGrade = schoolGrade;
    }

    playInCar() {
        console.log(`${this.name}이(가) 차 안에서 장난을 치고 있습니다.`);
    }
}

// 시나리오 구현
const dad = new Parent("철수", 45, "남성", "회사원");
const daughter = new Child("지연", 10, "여성", "초등학교 4학년");
const son = new Child("민수", 8, "남성", "초등학교 2학년");

const familyCar = new Sedan("현대", "그랜저", "검정", 500);

// 철수가 차를 운전하고 가족이 타고 이동하는 과정
familyCar.start();
dad.getInCar(familyCar);
dad.driveCar(familyCar);
daughter.getInCar(familyCar);
son.getInCar(familyCar);
daughter.playInCar();
son.playInCar();
familyCar.stop();
