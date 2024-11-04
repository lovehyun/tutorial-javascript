// generators/common/Generator.js

class Generator {
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = Generator;
