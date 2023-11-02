// generators/NameGenerator.js
const Generator = require('./Generator');

class NameGenerator extends Generator {
    generate() {
        const names = ['John', 'Jane', 'Michael', 'Emily', 'William', 'Olivia'];
        return names[Math.floor(Math.random() * names.length)];
    }
}

module.exports = NameGenerator;
