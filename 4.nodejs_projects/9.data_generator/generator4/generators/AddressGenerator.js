// generators/AddressGenerator.js
const Generator = require('./Generator');

class AddressGenerator extends Generator {
    constructor() {
        super();
        this.cities = ['서울', '부산', '대구', '인천', '광주'];
        this.gus = ['강남구', '강서구', '중구', '남구', '서구'];
        this.streets = ['길', '로'];
    }

    generate() {
        const city = this.cities[Math.floor(Math.random() * this.cities.length)];
        const gu = this.gus[Math.floor(Math.random() * this.gus.length)];
        const street = this.streets[Math.floor(Math.random() * this.streets.length)];
        const roadNumber = Math.floor(Math.random() * 100) + 1;
        const roadNumber2 = Math.floor(Math.random() * 100) + 1;
        const address = `${city} ${gu} ${roadNumber}${street} ${roadNumber2}`;
        return address;
    }
}

module.exports = AddressGenerator;
