// generators/common/AddressGenerator.js

const Generator = require('../common/Generator');

class AddressGenerator extends Generator {
    constructor() {
        super();
        this.cities = ['서울', '부산', '대구', '인천', '광주'];
        this.gus = ['강남구', '강서구', '중구', '남구', '서구'];
        this.streets = ['길', '로'];
    }

    generate() {
        const city = this.getRandomElement(this.cities);
        const gu = this.getRandomElement(this.gus);
        const street = this.getRandomElement(this.streets);
        const roadNumber = this.getRandomNumber(1, 100);
        const roadNumber2 = this.getRandomNumber(1, 100);
        return `${city} ${gu} ${roadNumber}${street} ${roadNumber2}`;
    }
}

module.exports = AddressGenerator;
