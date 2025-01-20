class Animal {
    constructor(public name: string) {}
}

const animal = new Animal("Buddy");
console.log(animal.name); // "Buddy"


class Animal2 {
    constructor(private name: string) {}
}

const animal2 = new Animal2("Buddy");
// console.log(animal.name); // 오류: 'name'은 private 속성


class Animal3 {
    constructor(protected name: string) {}
}

class Dog extends Animal3 {
    constructor(name: string) {
        super(name);
    }

    printName() {
        console.log(this.name); // 상속받은 클래스에서는 접근 가능
    }
}

const dog3 = new Dog("Buddy");
dog.printName(); // "Buddy"
// console.log(dog.name); // 오류: 'name'은 protected 속성
