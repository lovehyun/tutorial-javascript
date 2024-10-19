class Animal {
    constructor(name, sound) {
        if (!name) {
            throw new Error('동물의 이름을 입력해야 합니다.');
        }
        this.name = name;
        this.sound = sound;
    }

    speak() {
        console.log(`${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }

    move() {
        console.log(`${this.name}(이/가) 이동 중입니다.`);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name, '멍멍');
    }

    speak() {
        console.log(`강아지 ${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }

    move() {
        console.log(`강아지 ${this.name}(이/가) 뛰어다닙니다.`);
    }
}

class Cat extends Animal {
    constructor(name) {
        super(name, '야옹');
    }

    speak() {
        console.log(`고양이 ${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }

    move() {
        console.log(`고양이 ${this.name}(이/가) 살금살금 걸어다닙니다.`);
    }
}

class Bird extends Animal {
    constructor(name) {
        super(name, '짹짹');
    }

    speak() {
        console.log(`새 ${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
    }

    move() {
        console.log(`새 ${this.name}(이/가) 날아다닙니다.`);
    }
}

// 다형성 예제: 다양한 Animal 객체를 저장하고 speak()와 move() 호출
const animals = [
    new Dog('바둑이'),
    new Cat('나비'),
    new Bird('참새')
];

for (let animal of animals) {
    animal.speak();
    animal.move();
}

// 예외 처리 예시: 이름이 없는 동물을 생성하려 할 때
try {
    const namelessDog = new Dog();
} catch (error) {
    console.log('오류:', error.message);
}
