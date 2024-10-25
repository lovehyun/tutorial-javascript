class Shape {
    getArea() {
        // return 0;
        throw new Error('getArea() must be implemented by a subclass');
    }

    getInfo() {
        return 'This is a shape.';
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

    getInfo() {
        return `Square with side length ${this.sideLength}.`;
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

    getInfo() {
        return `Triangle with base ${this.base} and height ${this.height}.`;
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

    getInfo() {
        return `Trapezium with base1 ${this.base1}, base2 ${this.base2}, and height ${this.height}.`;
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

    getInfo() {
        return `Circle with radius ${this.radius}.`;
    }
}

// 사용 예시
const square = new Square(5);
const triangle = new Triangle(4, 3);
const trapezium = new Trapezium(4, 6, 5);
const circle = new Circle(3);

console.log(square.getInfo(), 'Area:', square.getArea()); // 출력: Square with side length 5. Area: 25
console.log(triangle.getInfo(), 'Area:', triangle.getArea()); // 출력: Triangle with base 4 and height 3. Area: 6
console.log(trapezium.getInfo(), 'Area:', trapezium.getArea()); // 출력: Trapezium with base1 4, base2 6, and height 5. Area: 25
console.log(circle.getInfo(), 'Area:', circle.getArea().toFixed(2)); // 출력: Circle with radius 3. Area: 28.27
