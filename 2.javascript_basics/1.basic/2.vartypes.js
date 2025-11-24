// 1️. 변수와 상수 선언

// let: 변경 가능한 변수
let name = "Alice";
console.log(name);

// const: 변경 불가능한 상수
const age = 20;
console.log(age);

// var: (옛날 문법, 사용 비추천)
var city = "Seoul";
console.log(city);


// 2. 데이터 타입
let number = 10;         // 숫자
let text = "Hello";      // 문자열
let isStudent = true;    // 불리언
let emptyValue = null;   // null
let notDefined;          // undefined

console.log(typeof number);     // number
console.log(typeof text);       // string
console.log(typeof isStudent);  // boolean
console.log(typeof emptyValue); // object (자바스크립트 특징)
console.log(typeof notDefined); // undefined


/*
구분	                     Strong Typing (강타입)	                    Weak Typing (약타입)
Static Typing (정적 타입)	 C#, Java, Rust, Go, Kotlin, Swift          C, C++
                            컴파일 시 타입 검사 + 엄격함                 컴파일 시 타입 검사 + 느슨함
                            안정성 최고	                                자동 형변환 많아 버그 가능성 존재

Dynamic Typing (동적 타입)	Python, Ruby, TypeScript(런타임은 JS이지만   JavaScript, PHP, Perl
                            TS 자체는 강타입 구조), Lua                 실행 중에 타입 결정 + 느슨함
                            실행 중에 타입 결정 + 엄격함	             자동 형변환(implicit coercion) 많음

✔️ Strong typing
→ 타입이 다르면 절대 섞지 말라는 언어 (엄격함)

✔️ Weak typing
→ 일단 타입을 알아서 맞춰보려는 언어 (느슨함, 자동 형변환)

✔️ Static typing
→ 코드 작성/컴파일 시점에 타입을 검사

✔️ Dynamic typing
→ 실행 중 타입을 검사하고 결정
*/
