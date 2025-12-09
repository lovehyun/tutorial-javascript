// 클래스는 상속을 통해 다른 클래스의 특성을 확장할 수 있습니다.
class Animal {
    constructor(name) {
        this.name = name;
    }

    makeSound() {
        return 'Some generic sound';
    }
}

class Dog extends Animal {
    makeSound() {
        return 'Woof!';
    }
}

class Cat extends Animal {
    makeSound() {
        return 'Meow!';
    }
}

const myDog = new Dog('Buddy');
console.log(myDog.makeSound()); // 출력: "Woof!"
