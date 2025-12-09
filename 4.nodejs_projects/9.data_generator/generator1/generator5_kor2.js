class NameGenerator {
    constructor() {
        this.lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
        this.firstNames = [
            '서준', '서연', '민준', '지우', '도윤',
            '지민', '하준', '예은', '시우', '지윤'
        ];
    }

    _pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generateName() {
        const lastName = this._pickRandom(this.lastNames);
        const firstName = this._pickRandom(this.firstNames);
        return `${lastName}${firstName}`;
    }

    // 여러 개 이름 생성
    generateNames(count) {
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(this.generateName());
        }
        return result;
    }
}

// 사용 예시
const generator = new NameGenerator();

// 10개 생성
const names10 = generator.generateNames(10);
console.log('10개:', names10);

// 100개 생성
const names100 = generator.generateNames(100);
console.log('100개:', names100);
