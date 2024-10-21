// 상속받은 함수를 구현하지 않으면 오류를 발생시키려면, 
// 추상 클래스처럼 동작하도록 기본 클래스를 설계할 수 있습니다. 
// 자바스크립트에는 추상 클래스 개념이 명시적으로 존재하지 않지만, 
// 에러를 던져서 이를 구현할 수 있습니다.

class Animal {
    constructor(name, sound) {
        if (!name) {
            throw new Error("동물의 이름이 필요합니다.");
        }
        this.name = name;
        this.sound = sound;
    }

    // 추상 메서드처럼 동작하도록 기본적으로 에러를 던지도록 설정
    speak() {
        throw new Error(`${this.constructor.name} 클래스는 speak() 메서드를 구현해야 합니다.`);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name, '멍멍');
    }

    speak() {
        console.log(`강아지 ${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }
}

class Cat extends Animal {
    constructor(name) {
        super(name, '야옹');
    }

    speak() {
        console.log(`고양이 ${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }
}

class Bird extends Animal {
    constructor(name) {
        super(name, '짹짹');
    }

    speak() {
        console.log(`새 ${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }
}

class Fish extends Animal {
    // Fish 클래스에서 speak()를 구현하지 않으면 에러가 발생함
}

// 다형성 예제: 다양한 Animal 객체를 저장하고 speak() 호출
const animals = [
    new Dog('바둑이'),
    new Cat('나비'),
    new Bird('참새'),
    // new Fish('금붕어'), // 이 줄을 활성화하면 speak() 메서드가 구현되지 않아 에러 발생
];

for (let animal of animals) {
    animal.speak();
}
