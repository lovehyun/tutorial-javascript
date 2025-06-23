console.log('hello');

var a = 5;
console.log(a);

console.log(('b'+'a'+ +'a'+'a').toLowerCase())
// banana ?!?!?!

// 'b' + 'a' → 'ba'
// + 'a' → 문자열 앞에 + 연산자가 붙으면 자바스크립트는 숫자로 변환 시도

// 'b' + 'a' + NaN + 'a'
// → 'ba' + 'NaN' + 'a'
// → 'baNaNa'
