class NameGenerator {
    constructor() {
        // 한국 성 리스트
        this.lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];

        // 한국 이름 리스트
        this.firstNames = [
            '서준', '서연', '민준', '지우', '도윤',
            '지민', '하준', '예은', '시우', '지윤'
        ];
    }

    // 배열에서 랜덤으로 하나 뽑는 헬퍼 함수
    _pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generateName() {
        const lastName = this._pickRandom(this.lastNames);
        const firstName = this._pickRandom(this.firstNames);

        // 필요에 따라 공백을 넣거나 빼세요
        // return `${lastName} ${firstName}`;  // "김 서준" 같이
        return `${lastName}${firstName}`;      // "김서준" 같이
    }
}

// 사용 예시
const generator = new NameGenerator();

console.log(generator.generateName());
