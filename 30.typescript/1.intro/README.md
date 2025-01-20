# TypeScript 기본 튜토리얼

이 튜토리얼에서는 TypeScript의 설치 및 기본 설정과 간단한 예제를 통해 TypeScript를 시작하는 방법을 배웁니다.

---

## 1. TypeScript 설치

먼저 TypeScript를 설치합니다. 터미널에서 다음 명령어를 실행하여 TypeScript를 전역으로 설치합니다.

```bash
npm install -g typescript
npm list -g
npm root -g
```

이 명령어는 TypeScript를 전역으로 설치합니다. 만약 프로젝트 내에만 설치하고 싶다면, 아래 명령어를 사용합니다.

```bash
npm install --save-dev typescript
```

## 2. TypeScript 프로젝트 초기화
TypeScript 설정 파일을 생성하기 위해 프로젝트 디렉토리에서 다음 명령어를 실행하세요.

```bash
tsc --init
```

이 명령어는 tsconfig.json 파일을 생성하며, TypeScript 컴파일러 옵션을 설정할 수 있는 파일입니다.

```json
{
  "compilerOptions": {
    "target": "es5",                         // 컴파일 결과를 ES5 표준으로 설정
    "module": "commonjs",                     // 모듈 시스템을 CommonJS로 설정
    "strict": true,                           // 모든 엄격한 타입 검사 옵션 활성화
    "esModuleInterop": true,                  // ES6 모듈과의 상호 운용성을 활성화
    "skipLibCheck": true,                     // 타입 선언 파일 검사 건너뛰기
    "forceConsistentCasingInFileNames": true  // 파일명 대소문자 일관성 검사
  },
  "include": ["src/**/*"],                   // 컴파일할 파일 경로 설정
  "exclude": ["node_modules", "**/*.spec.ts"] // 제외할 파일 경로 설정
}
```

## 3. 기본 TypeScript 코드 작성
프로젝트 디렉토리에서 index.ts라는 파일을 만들고, 아래와 같은 기본 코드를 작성해 보겠습니다.

```typescript
// index.ts

// 숫자 두 개를 더하는 함수
function add(a: number, b: number): number {
    return a + b;
}

// 결과 출력
const result = add(5, 10);
console.log(`결과: ${result}`);
```

위 코드에서는 add라는 함수를 정의하며, a와 b라는 매개변수는 number 타입으로 지정했습니다. 함수의 반환 타입도 number로 설정하여 숫자 두 개를 더하는 기본적인 예제를 작성했습니다.

## 4. TypeScript 코드 컴파일
TypeScript 파일(.ts)을 JavaScript 파일(.js)로 변환하려면 tsc 명령어를 사용하여 컴파일합니다.

```bash
tsc index.ts
```

이 명령을 실행하면 index.js 파일이 생성되며, JavaScript 코드로 컴파일됩니다.

```bash
tsc  # tsconfig.json 설정에 따라 컴파일
node dist/index.js  # 컴파일된 파일 실행 (컴파일 결과물 위치에 따라 경로가 달라질 수 있음)
```

tsc 실행 시 옵션을 직접 지정하여 컴파일 할 수도 있습니다.
```bash
tsc index.ts --target ES6 --outDir dist
```

## 5. 컴파일된 JavaScript 실행
컴파일된 index.js 파일을 Node.js로 실행합니다.

```bash
node index.js
```

출력 결과는 다음과 같습니다.

```bash
결과: 15
```

## 6. TypeScript 타입 예제
추가적으로 TypeScript의 주요 타입들을 몇 가지 예제와 함께 살펴보겠습니다.

```typescript
// 문자열 타입
let message: string = "Hello, TypeScript";

// 숫자 타입
let age: number = 25;

// 배열 타입
let numbers: number[] = [1, 2, 3, 4, 5];

// 튜플 타입
let user: [string, number] = ["Alice", 30];

// 객체 타입
interface Person {
    name: string;
    age: number;
}

let person: Person = {
    name: "John",
    age: 22
};

// 열거형 타입
enum Color {
    Red,
    Green,
    Blue
}

let favoriteColor: Color = Color.Green;
```

## 7. TypeScript 컴파일과 실행 자동화 (선택 사항)
개발 중에 매번 컴파일하기 귀찮다면 tsc --watch 명령을 통해 파일이 변경될 때마다 자동으로 컴파일되도록 설정할 수 있습니다.

```bash
tsc --watch
```

기본적으로 tsconfig.json 내의 파일들을 보고 동작합니다.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"], // 예: src 폴더에 있는 모든 .ts 파일 포함
  "exclude": ["node_modules"] // node_modules 폴더는 제외
}
```
