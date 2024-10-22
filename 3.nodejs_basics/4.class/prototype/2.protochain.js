// 생성자 함수 정의
function Animal(name) {
    this.name = name;
}

// Animal의 프로토타입에 메서드 추가
Animal.prototype.speak = function() {
    console.log(this.name + " makes a sound.");
};

// Dog 생성자 함수 정의
function Dog(name, breed) {
    Animal.call(this, name);  // Animal의 생성자를 호출하여 name 상속
    this.breed = breed;
}

// Dog의 프로토타입을 Animal로 설정
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Dog의 프로토타입에 새로운 메서드 추가
Dog.prototype.speak = function() {
    console.log(this.name + " barks.");
};

const myDog = new Dog("Rex", "Labrador");

myDog.speak();  // Rex barks.

console.log(myDog instanceof Dog);    // true
console.log(myDog instanceof Animal); // true

console.log(myDog.__proto__);  // Dog.prototype
console.log(myDog.__proto__.__proto__);  // Animal.prototype
console.log(myDog.__proto__.__proto__.__proto__);  // Object.prototype
console.log(myDog.__proto__.__proto__.__proto__.__proto__);  // null (프로토타입 체인의 끝)
