// generators/models/User.js

class User {
    constructor(id, name, gender, birthdate, address) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.birthdate = birthdate;
        this.address = address;
    }

    toString() {
        return `Id: ${this.id}, Name: ${this.name}, Gender: ${this.gender}, Birthdate: ${this.birthdate}, Address: ${this.address}`;
    }
}

module.exports = User;
