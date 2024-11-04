// generators/user/UserGenerator.js

const Generator = require('../common/Generator');
const NameGenerator = require('./NameGenerator');
const GenderGenerator = require('./GenderGenerator');
const BirthdateGenerator = require('./BirthdateGenerator');
const AddressGenerator = require('../common/AddressGenerator');
const User = require('../models/User');
const uuid = require('uuid');

class UserGenerator extends Generator {
    constructor() {
        super();
        this.nameGenerator = new NameGenerator();
        this.genderGenerator = new GenderGenerator();
        this.birthdateGenerator = new BirthdateGenerator();
        this.addressGenerator = new AddressGenerator();
    }

    generate() {
        const userId = uuid.v4();
        const name = this.nameGenerator.generate();
        const gender = this.genderGenerator.generate();
        const birthdate = this.birthdateGenerator.generate();
        const address = this.addressGenerator.generate();

        return new User(userId, name, gender, birthdate, address);
    }

    generateUsers(numRecords) {
        const users = [];
    
        for (let i = 0; i < numRecords; i++) {
            const user = this.generate();
            users.push(user);
        }
    
        return users;
    }
}

module.exports = UserGenerator;
