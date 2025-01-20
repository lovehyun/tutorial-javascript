class Animal {
    constructor(public name: string) {}

    makeSound() {
        console.log("Some generic animal sound");
    }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name); // 부모 클래스의 생성자 호출
    }

    // 메서드 오버라이딩
    makeSound() {
        console.log(`${this.name} barks`);
    }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(`Dog: ${dog.name}, Breed: ${dog.breed}`);
dog.makeSound();

// readonly, override 추가
class Animal2 {
    constructor(public readonly name: string) {} // name을 readonly로 선언

    makeSound() {
        console.log("Some generic animal sound");
    }
}

class Dog2 extends Animal2 {
    constructor(name: string, public readonly breed: string) { // breed도 readonly로 선언
        super(name); // 부모 클래스의 생성자 호출
    }

    // 메서드 오버라이딩 (override 키워드 사용)
    override makeSound() {
        console.log(`${this.name} barks`);
    }
}

const dog2 = new Dog2("Buddy", "Golden Retriever");
console.log(`Dog: ${dog2.name}, Breed: ${dog2.breed}`);

// readonly 속성은 값을 변경할 수 없음
// dog.name = "Charlie"; // 오류: Cannot assign to 'name' because it is a read-only property

dog2.makeSound();
