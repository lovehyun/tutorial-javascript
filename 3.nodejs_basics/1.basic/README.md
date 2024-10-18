# 호이스팅
JavaScript 호이스팅은 인터프리터가 코드를 실행하기 전에 함수, 변수, 클래스 또는 임포트(import)의 선언문을 해당 범위의 맨 위로 끌어올리는 것처럼 보이는 현상을 뜻합니다.

https://developer.mozilla.org/ko/docs/Glossary/Hoisting

JavaScript에서 호이스팅(hoisting)이란, 인터프리터가 변수와 함수의 메모리 공간을 선언 전에 미리 할당하는 것을 의미합니다. var로 선언한 변수의 경우 호이스팅 시 undefined로 변수를 초기화합니다. 반면 let과 const로 선언한 변수의 경우 호이스팅 시 변수를 초기화하지 않습니다.


## 1. 함수 호이스팅 (Function Hoisting)

**함수 선언식 (Function Declaration)**은 코드 어디에서든 호출할 수 있습니다. 왜냐하면 함수 선언 자체가 코드 실행 이전에 메모리에 올라가기 때문입니다.

```javascript
console.log(multiply(4, 2)); // 8

function multiply(x, y) {
  return x * y;
}
```

or

```javascript
functionA();

function functionA() {
  functionB();
}

function functionB() {
  console.log('Function B is called');
}
```

이 코드에서 함수 선언은 실제로 코드 상단에 위치하지 않았지만, console.log(multiply(4, 2))는 정상적으로 실행됩니다. 이는 함수 선언이 코드의 실행 전에 메모리에 먼저 할당되었기 때문입니다.

**주의:** 함수 표현식 (Function Expression)은 호이스팅되지 않습니다. 함수 표현식은 해당 변수에 할당되는 시점 이후에만 호출할 수 있습니다.

```javascript
console.log(multiply(4, 2)); // ReferenceError: Cannot access 'multiply' before initialization

let multiply = function (x, y) {
  return x * y;
};
```

## 2. 변수 호이스팅 (Variable Hoisting)

변수 선언 또한 호이스팅됩니다. 즉, 변수가 선언된 위치에 상관없이 코드의 상단에서 선언된 것처럼 동작하지만, 초기화는 실제 선언된 위치에서 일어납니다. 이 때문에 선언된 변수를 초기화하기 전에 접근하면 undefined 값을 반환합니다.

```javascript
console.log(a); // undefined
var a = 5;
console.log(a); // 5
```

위의 코드는 다음과 같이 해석됩니다:

```javascript
var a;
console.log(a); // undefined
a = 5;
console.log(a); // 5
```

### let과 const의 호이스팅

var와 달리 let과 const로 선언된 변수도 호이스팅되지만, 선언 전에 접근하려 하면 에러가 발생합니다. 이는 "임시적 사각지대(TDZ: Temporal Dead Zone)" 때문입니다.

```javascript
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

let과 const는 선언은 호이스팅되지만 초기화는 실제로 코드에 도달했을 때 이루어집니다. 그 전까지 해당 변수에 접근하면 참조 오류가 발생합니다.


## 3. 클래스 호이스팅 (Class Hoisting)
class 선언은 let과 유사하게 호이스팅됩니다. 그러나 class는 선언 전에 참조할 수 없으며, 선언 전에 접근하면 참조 오류가 발생합니다.

```javascript
let obj = new MyClass(); // ReferenceError: Cannot access 'MyClass' before initialization

class MyClass {
  constructor() {
    this.name = "Test";
  }
}
```

이것은 let이나 const의 임시적 사각지대(TDZ)와 유사하게 작동합니다. class 선언은 코드 상단으로 호이스팅되지만 초기화는 실제 코드에 도달했을 때 이루어집니다.


## 4. 변수 호이스팅 vs 초기화

호이스팅은 선언 부분에만 적용되며, 값의 초기화는 해당 위치에서 실행됩니다. 따라서 아래와 같은 코드에서는 변수 선언은 호이스팅되지만, 초기화가 뒤따라오지 않기 때문에 undefined 값을 반환하게 됩니다.

```javascript
console.log(x); // undefined
var x = 10;
```

하지만 let이나 const를 사용할 때는 임시적 사각지대(TDZ)가 발생하여 참조 오류가 발생하게 됩니다.

```javascript
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

## 결론

호이스팅은 주로 함수, 변수, 그리고 클래스 선언에서 발생하는 현상입니다. var로 선언된 변수는 선언만 호이스팅되며 값은 할당된 위치에서 초기화되고, let과 const는 임시적 사각지대(TDZ)로 인해 선언 전에 접근할 수 없습니다. 이 외에도 함수와 클래스 선언도 비슷한 호이스팅 특성을 보입니다.
