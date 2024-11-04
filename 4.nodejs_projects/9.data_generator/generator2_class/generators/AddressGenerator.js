// generators/AddressGenerator.js
const Generator = require('./Generator');

class AddressGenerator extends Generator {
    generate() {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'];
        const street = Math.floor(Math.random() * 100) + 1;
        const city = cities[Math.floor(Math.random() * cities.length)];
        return `${street} ${city}`;
    }
}

module.exports = AddressGenerator;
