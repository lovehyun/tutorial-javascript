class Animal {
    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }

    speak() {
        console.log(`${this.name}(이/가) ${this.sound} 소리를 냅니다.`);
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

// 다형성 예제: 다양한 Animal 객체를 저장하고 speak() 호출
const animals = [
    new Dog('바둑이'),
    new Cat('나비'),
    new Bird('참새')
];

for (let animal of animals) {
    animal.speak();
}


/*
확장 문제 (선택 사항):
추가 기능 구현:
- move 메서드를 Animal 클래스에 추가하고, 각 동물마다 고유의 이동 방식을 출력하도록 메서드를 오버라이드하세요.
- 예: 강아지는 "뛰어다닌다", 고양이는 "살금살금 걸어다닌다", 새는 "날아다닌다".
초기화 오류 처리:
- 동물 이름이 없는 경우, 오류를 발생시키고 이름을 설정하도록 하세요.
*/
