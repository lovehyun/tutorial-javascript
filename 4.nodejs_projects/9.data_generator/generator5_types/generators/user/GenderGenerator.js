// generators/user/GenderGenerator.js

const Generator = require('../common/Generator');

class GenderGenerator extends Generator {
    generate() {
        const genders = ['Male', 'Female'];
        return this.getRandomElement(genders);
    }
}

module.exports = GenderGenerator;
