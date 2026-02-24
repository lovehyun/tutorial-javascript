// 클래스가 따라야 할 "설계도"를 명확히 만들고 싶을 때
interface Person {
    name: string;
    age: number;
    isEmployed: boolean;
}

class User implements Person {
    name: string;
    age: number;
    isEmployed: boolean;

    constructor(name: string, age: number, isEmployed: boolean) {
        this.name = name;
        this.age = age;
        this.isEmployed = isEmployed;
    }

    introduce() {
        console.log(`Hi, I'm ${this.name}`);
    }
}
