class Shape {
    getArea() {
        return 0;
    }
}

class Square extends Shape {
    constructor(sideLength) {
        super();
        this.sideLength = sideLength;
    }

    getArea() {
        return this.sideLength ** 2;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super();
        this.base = base;
        this.height = height;
    }

    getArea() {
        return 0.5 * this.base * this.height;
    }
}

class Trapezium extends Shape {
    constructor(base1, base2, height) {
        super();
        this.base1 = base1;
        this.base2 = base2;
        this.height = height;
    }

    getArea() {
        return 0.5 * (this.base1 + this.base2) * this.height;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

// 사용 예시
const square = new Square(5);
const triangle = new Triangle(4, 3);
const trapezium = new Trapezium(4, 6, 5);
const circle = new Circle(3);

console.log('Square Area:', square.getArea()); // 출력: 25
console.log('Triangle Area:', triangle.getArea()); // 출력: 6
console.log('Trapezium Area:', trapezium.getArea()); // 출력: 25
console.log('Circle Area:', circle.getArea().toFixed(2)); // 출력: 28.27
