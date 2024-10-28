# ES6 모듈 방식 vs CommonJS 모듈 방식

## 1. ES6 모듈 방식 특징

- **`import`와 `export` 사용**: ES6 모듈 방식은 `import`와 `export` 키워드를 사용해 모듈을 불러오고 내보냅니다.
- **비동기적 로딩**: 모듈을 비동기적으로 로드할 수 있으며, 웹 환경에서 스크립트 로딩 중에도 다른 작업을 처리할 수 있습니다.
- **정적 구조**: ES6 모듈은 파일을 해석하는 시점에 모듈 구조가 고정되어 있어, 런타임 중에 변경되지 않습니다.
- **`export default` 지원**: 모듈에서 단 하나의 기본 내보내기를 정의할 수 있으며, 이를 사용해 더 간결하게 모듈을 가져올 수 있습니다.
- **브라우저 및 최신 Node.js 지원**: 브라우저에서 기본적으로 지원되며, Node.js에서는 `.mjs` 확장자를 사용하거나 `package.json`에 `"type": "module"`을 추가해야 합니다.
  
## 2. CommonJS 모듈 방식 특징

- **`require`와 `module.exports` 사용**: CommonJS 모듈 방식은 `require()` 함수로 모듈을 불러오고, `module.exports`를 사용해 모듈을 내보냅니다.
- **동기적 로딩**: 모듈이 동기적으로 로드되므로, 요청된 모듈을 완전히 로드한 후 다음 작업이 진행됩니다. 이는 서버 측 환경에서 일반적입니다.
- **동적 구조**: 모듈을 런타임 중에 동적으로 결정하고 변경할 수 있습니다.
- **서버 측(Node.js) 환경에서 사용**: Node.js에서 기본적으로 사용되는 모듈 방식입니다. 브라우저 환경에서는 Webpack, Browserify와 같은 번들러가 필요합니다.
  
## 3. 비교

| 특징                        | ES6 모듈 방식                         | CommonJS 모듈 방식              |
|-----------------------------|---------------------------------------|---------------------------------|
| 사용 키워드                  | `import`, `export`                    | `require`, `module.exports`     |
| 로딩 방식                    | 비동기적 로딩                         | 동기적 로딩                     |
| 구조                         | 정적 구조                             | 동적 구조                       |
| `export default` 지원 여부   | 지원                                  | 지원하지 않음                   |
| 브라우저 지원                | 최신 브라우저에서 기본 지원            | 번들러 필요 (Webpack 등)        |
| Node.js 지원                 | `.mjs` 확장자 또는 `"type": "module"` 설정 필요 | 기본적으로 지원                 |
| 내보내기 방식                | Named export, Default export          | Named export (default 없음)     |
| 스크립트 실행 순서           | 비동기적으로 스크립트 로딩 가능        | 동기적으로 스크립트 실행        |
| 사용 범위                    | 브라우저 및 서버 모두 지원            | 주로 서버 측 (Node.js)에서 사용 |

## 4. 결론

- **ES6 모듈** 방식은 최신 자바스크립트 표준으로 브라우저와 서버(Node.js)에서 모두 사용 가능하며, 비동기적 로딩과 정적 구조 덕분에 모던 웹 개발에 적합합니다. 최신 Node.js 버전에서 `.mjs` 파일 확장자를 사용하거나 `package.json`에 `"type": "module"` 설정을 추가해야 사용할 수 있습니다.
  
- **CommonJS 모듈** 방식은 **Node.js**에서 기본적으로 사용되는 모듈 시스템으로, 동기적 로딩과 동적 구조를 제공하여 서버 측 개발에 적합합니다. 브라우저 환경에서는 Webpack이나 Browserify와 같은 번들러를 통해 사용할 수 있습니다.

두 모듈 시스템은 각기 다른 환경에 최적화되어 있으며, **ES6 모듈 방식**은 앞으로의 웹 표준에 더 적합한 방식으로 점차 널리 사용되고 있습니다. Node.js에서도 ES6 모듈을 지원하기 시작하면서 ES6 모듈 방식이 점차 서버와 브라우저 양쪽에서 통일된 방식으로 자리잡고 있습니다.