class Shape {
    constructor(type) {
        this.type = type;
    }

    getArea() {
        return 0;
    }

    toString() {
        return `${this.type} - Area: ${this.getArea()}`;
    }
}

class Square extends Shape {
    constructor(sideLength) {
        super('Square');
        this.sideLength = sideLength;
    }

    getArea() {
        return this.sideLength ** 2;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super('Triangle');
        this.base = base;
        this.height = height;
    }

    getArea() {
        return 0.5 * this.base * this.height;
    }
}

class Trapezium extends Shape {
    constructor(base1, base2, height) {
        super('Trapezium');
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
        super('Circle');
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

console.log(square.toString()); // 출력: Square - Area: 25
console.log(triangle.toString()); // 출력: Triangle - Area: 6
console.log(trapezium.toString()); // 출력: Trapezium - Area: 25
console.log(circle.toString()); // 출력: Circle - Area: 28.274333882308138
