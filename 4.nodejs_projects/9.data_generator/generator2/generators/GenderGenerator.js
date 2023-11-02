// generators/GenderGenerator.js
const Generator = require('./Generator');

class GenderGenerator extends Generator {
    generate() {
        const genders = ['Male', 'Female'];
        return genders[Math.floor(Math.random() * genders.length)];
    }
}

module.exports = GenderGenerator;
