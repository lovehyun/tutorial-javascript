// generators/store/StorenameGenerator.js

const Generator = require('../common/Generator');

class StorenameGenerator extends Generator {
    constructor() {
        super();
        this.storeTypes = ["스타벅스", "투썸", "이디야", "커피빈"];
        this.dongs = ["강남", "강서", "서초", "잠실", "신촌", "홍대", "송파"];
    }

    generateType() {
        return this.getRandomElement(this.storeTypes);
    }

    generateDistrict() {
        return this.getRandomElement(this.dongs);
    }

    generateName(storeType) {
        const district = this.generateDistrict();
        const storeNumber = this.getRandomNumber(1, 10);
        return `${storeType} ${district}${storeNumber}호점`;
    }
}

module.exports = StorenameGenerator;
