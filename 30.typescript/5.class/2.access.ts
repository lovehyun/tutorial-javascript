class Person {
    public name: string;      // 외부 접근 가능
    private age: number;      // 클래스 내부에서만 접근 가능
    protected address: string; // 클래스와 자식 클래스에서 접근 가능

    constructor(name: string, age: number, address: string) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    getAge() {
        return this.age; // private 속성은 내부 메서드를 통해 접근 가능
    }
}

const person = new Person("John", 30, "123 Street");
// person.age; // 오류 발생: private 속성에 접근 불가
console.log(`Name: ${person.name}, Age: ${person.getAge()}`);
