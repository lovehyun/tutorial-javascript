// generators/BirthdayGenerator.js
const Generator = require('./Generator');

class BirthdateGenerator extends Generator {
    generate() {
        const year = Math.floor(Math.random() * (2005 - 1970 + 1)) + 1970;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
}

module.exports = BirthdateGenerator;
