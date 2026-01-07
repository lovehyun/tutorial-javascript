# React Todo 앱 구성 설명 (Theme + Bootstrap)

이 문서는 **React + Bootstrap 테마 전환 Todo 앱**이  
어떻게 구성되어 있는지를 **컴포넌트 구조, 상태 흐름 중심**으로 설명합니다.

---

## 1. 전체 디렉토리 구조

```text
src/
├─ main.jsx
├─ App.jsx
└─ components/
   ├─ ThemeToggle.jsx
   └─ TodoApp.jsx
```

> 이 예제는 **학습용 최소 구조**로, 불필요한 파일은 포함하지 않습니다.

---

## 2. 컴포넌트 트리 구조

```text
<App>
 ├─ <ThemeToggle />
 └─ <TodoApp />
```

- `App`이 최상위 컴포넌트
- 모든 상태는 `App` 또는 각 기능 컴포넌트 내부에 존재

---

## 3. 상태(State)와 데이터 흐름

```text
App.jsx
 ├─ theme (state)
 │
 ├─ ThemeToggle
 │    └─ setTheme() 호출
 │
 └─ TodoApp
      └─ theme 값 사용
```

### 핵심 원칙
- 상태는 **위에 두고**
- 아래로 **props 전달**
- 변경은 **부모에게 요청**

---

## 4. 파일별 역할 정리

### main.jsx
- React 앱 시작점
- Bootstrap CSS 로딩
- `<App />` 렌더링

---

### App.jsx (컨트롤 타워)

```jsx
function App() {
  const [theme, setTheme] = useState('light')

  return (
    <>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <TodoApp theme={theme} />
    </>
  )
}
```

**역할**
- 전역 상태(theme) 관리
- 레이아웃 구성
- 자식 컴포넌트에 데이터 전달

---

### ThemeToggle.jsx

```text
ThemeToggle
 └─ 버튼 클릭
     └─ setTheme('dark' | 'light')
```

**역할**
- UI 전용 컴포넌트
- 상태를 직접 소유하지 않음
- 부모에게 변경 요청만 수행

---

### TodoApp.jsx

```text
TodoApp
 ├─ todos (state)
 ├─ input (state)
 ├─ addTodo()
 └─ removeTodo()
```

**역할**
- Todo 추가 / 삭제 기능 담당
- 내부 상태 관리
- 테마 정보는 props로만 수신

---

## 5. 화면 구성 기준 구조

```text
[ 전체 화면 ]
 ┌───────────────────────────────┐
 │   🌙 / ☀️ 테마 전환 버튼        │  ← ThemeToggle
 │                               │
 │  ┌─────────────────────────┐  │
 │  │ 📝 Todo List             │  │
 │  │ [ 입력창 ][ 추가 ]       │  │
 │  │ ▢ 공부하기     [삭제]   │  │
 │  │ ▢ 운동하기     [삭제]   │  │
 │  └─────────────────────────┘  │  ← TodoApp
 └───────────────────────────────┘
```

---

## 6. 왜 이렇게 구성했는가?

| 구성 | 이유 |
|----|----|
| App에서 theme 관리 | 상태 중앙 집중 |
| ThemeToggle 분리 | 재사용성 |
| TodoApp 분리 | 기능 응집 |
| props 전달 | React 기본 패턴 학습 |

---

## 7. 한 문장 요약

> 이 Todo 앱은  
> **App이 상태를 소유하고,  
> ThemeToggle은 상태 변경을 요청하며,  
> TodoApp은 상태를 사용한다**  
> 라는 구조로 구성되어 있습니다.
