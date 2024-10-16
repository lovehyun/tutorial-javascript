// 1. 기본 출력
const greeting = 'Hello, World!';
console.log(greeting); // 문자열 출력


// 2. 여러 값 출력
const a = 10;
const b = 20;
console.log('The numbers are:', a, b); // 여러 값 출력


// 3. 문자열 보간(Interpolation)
const name = 'Alice';
console.log(`Hello, ${name}!`); // 문자열 내 변수 값 출력


// 4. 객체 출력
const person = { name: 'John', age: 30 };
console.log('Person:', person); // 객체 출력


// 5. 배열 출력
const fruits = ['Apple', 'Banana', 'Orange'];
console.log('Fruits:', fruits); // 배열 출력


// 6. 디버깅용 출력
const x = 5;
const y = 8;
console.log({ x, y }); // 변수나 객체의 값을 확인하는 디버깅용 출력


// 7. 시간 측정
console.time('test');
// 시간 측정을 위한 코드
console.timeEnd('test'); // 코드 실행 시간 측정


// 8. 스타일 적용
console.log('%c Styled Text', 'color: blue; font-weight: bold'); // 텍스트 스타일 적용


// 9. 특수 기호 출력
console.log('\u2713', '\u2717'); // 유니코드를 이용한 특수 기호 출력


// 10. 템플릿 리터럴을 사용한 console.log() 출력
const name2 = 'Alice';
const age2 = 30;

// 템플릿 리터럴을 사용하여 변수 값을 문자열에 포함하여 출력
console.log(`Name: ${name2}, Age: ${age2}`);
