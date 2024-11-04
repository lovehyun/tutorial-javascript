// generators/models/User.js

class User {
    constructor(name, gender, birthdate, address) {
        this.name = name;
        this.gender = gender;
        this.birthdate = birthdate;
        this.address = address;
    }

    toString() {
        return `Name: ${this.name}, Gender: ${this.gender}, Birthdate: ${this.birthdate}, Address: ${this.address}`;
    }
}

module.exports = User;
