abstract class Shape {
    abstract getArea(): number; // 추상 메서드: 상속받은 클래스에서 반드시 구현

    printArea() {
        console.log(`Area: ${this.getArea()}`);
    }
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }

    // 추상 메서드 구현
    getArea(): number {
        return Math.PI * this.radius * this.radius;
    }
}

const circle = new Circle(10);
circle.printArea(); // Area: 314.159...
circle.radius = 20;
circle.printArea(); // Area: 1256.637...


class Square extends Shape {
    constructor(private sideLength: number) {
        super();
    }

    // 추상 메서드 구현
    getArea(): number {
        return this.sideLength * this.sideLength;
    }
}

const square = new Square(5);
square.printArea(); // Area: 25
// square.length = 10; // 변경 불가
