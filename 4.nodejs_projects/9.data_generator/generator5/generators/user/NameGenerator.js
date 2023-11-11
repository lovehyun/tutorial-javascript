// generators/user/NameGenerator.js

const Generator = require('../common/Generator');

class NameGenerator extends Generator {
    constructor() {
        super();
        this.lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
        this.firstNames = ['유진', '민지', '수빈', '지원', '지현', '지은', '현지', '은지', '예진', '예지', 
                            '동현', '지훈', '성민', '현우', '준호', '민석', '민수', '준혁', '준영', '승현',
                            '서아', '이서', '하윤', '지아', '지안', '서윤', '아린', '아윤', '하은', '하린',
                            '서준', '도윤', '하준', '은우', '시우', '지호', '예준', '수호', '유준', '이안'];
    }

    generate() {
        const lastName = this.getRandomElement(this.lastNames);
        const firstName = this.getRandomElement(this.firstNames);
        return lastName + firstName;
    }
}

module.exports = NameGenerator;
