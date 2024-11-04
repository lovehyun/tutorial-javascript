// generators/user/GenderGenerator.js

const Generator = require('../common/Generator');

class GenderGenerator extends Generator {
    generate() {
        // 성별 생성 로직 구현
        const genders = ['Male', 'Female'];
        return this.getRandomElement(genders);
    }
}

module.exports = GenderGenerator;
