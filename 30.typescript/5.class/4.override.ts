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
