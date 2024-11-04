// generators/user/BirthdateGenerator.js

const Generator = require('../common/Generator');

class BirthdateGenerator extends Generator {
    generate() {
        const year = this.getRandomNumber(1970, 2005);
        const month = this.getRandomNumber(1, 12);
        const day = this.getRandomNumber(1, 28);
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
}

module.exports = BirthdateGenerator;
