// 8. 객체
let person = {
    name: "Jane",
    age: 30,
    greet: function() {
        console.log("Hi, I'm " + this.name);
    }
};

console.log(person.name);
console.log(person["age"]);
person.greet();

// 속성 추가 / 삭제
person.job = "Developer";
console.log(person);

delete person.age;
console.log(person);

// 객체 반복
for (let key in person) {
    console.log(key + ":", person[key]);
}
