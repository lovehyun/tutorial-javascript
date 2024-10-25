class Shape {
    constructor(type, dimensions) {
        this.type = type;
        this.dimensions = dimensions; // 개별 도형의 속성 정보를 저장
    }

    getArea() {
        return 0;
    }

    toString() {
        // 각 도형의 속성을 이용해 출력 문자열을 구성
        const dimensionsInfo = Object.entries(this.dimensions)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        
        // return `${this.type} - Area: ${this.getArea()}`;
        return `${this.type}, ${dimensionsInfo} - Area: ${this.getArea().toFixed(2)} m²`;
    }
}

class Square extends Shape {
    constructor(sideLength) {
        // super('Square');
        super('Square', { sideLength }); // sideLength 속성을 부모에게 전달
        this.sideLength = sideLength;
    }

    getArea() {
        return this.sideLength ** 2;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        // super('Triangle');
        super('Triangle', { base, height }); // base, height 속성을 부모에게 전달

        this.base = base;
        this.height = height;
    }

    getArea() {
        return 0.5 * this.base * this.height;
    }
}

class Trapezium extends Shape {
    constructor(base1, base2, height) {
        // super('Trapezium');
        super('Trapezium', { base1, base2, height }); // base1, base2, height 속성을 부모에게 전달
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
        // super('Circle');
        super('Circle', { radius }); // radius 속성을 부모에게 전달
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

// toFixed(2) 추가 이전
console.log(square.toString()); // 출력: Square - Area: 25
console.log(triangle.toString()); // 출력: Triangle - Area: 6
console.log(trapezium.toString()); // 출력: Trapezium - Area: 25
console.log(circle.toString()); // 출력: Circle - Area: 28.274333882308138

// toFixed(2) 추가 이후
console.log(`${square}`); // 출력: Square - Area: 25.00 m²
console.log(`${triangle}`); // 출력: Triangle - Area: 6.00 m²
console.log(`${trapezium}`); // 출력: Trapezium - Area: 25.00 m²
console.log(`${circle}`); // 출력: Circle - Area: 28.27 m²
