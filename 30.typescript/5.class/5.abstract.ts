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
