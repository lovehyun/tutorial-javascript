class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(this.name + " makes a sound.");
    }
}

class Dog extends Animal {
    speak() {
        console.log(this.name + " barks.");
    }
}

const dog = new Dog("Rex");
dog.speak();  // Rex barks.
