const obj = {
    // `_age`는 실제 값을 저장하는 변수가 아니라, setter와 getter에서 사용됩니다.
    _age: 0,
    
    // Getter 정의
    get age() {
        return this._age;
    },
    
    // Setter 정의
    set age(newAge) {
        if (newAge > 0) {
            this._age = newAge;
        } else {
            console.log("나이는 0보다 커야 합니다.");
        }
    }
};

// Getter 호출
console.log(obj.age); // 0

// Setter 호출
obj.age = 25;
console.log(obj.age); // 25

// Setter에 유효하지 않은 값을 할당하려고 하면
obj.age = -5; // 나이는 0보다 커야 합니다.
console.log(obj.age); // 25 (값이 변경되지 않음)
