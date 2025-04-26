# TailwindCSS CheatSheet (우리 프로젝트 기준)

> 현재 적용한 Tailwind 클래스를 기준으로, 디자인을 빠르게 적용하는 방법과 기존 CSS 대비 변경 사항을 정리했습니다.

---

## Tailwind 기본 개념

- Tailwind는 "필요한 스타일"을 "미리 만들어진 클래스 이름"으로 조합하는 방식입니다.
- 스타일을 외우기보다는 필요한 클래스를 조합해서 빠르게 디자인합니다.
- CSS 파일을 별도로 작성할 필요 없이, HTML에 클래스만 추가하면 됩니다.

---

# 1. 주요 스타일 패턴

## 1) 플래시(회신) 메시지

**원하는 디자인:**
- 하얀색 바탕에 연한 초록색/빨간색 박스로 알림 표시
- 둥글게 처리하고, 약간 그림자 효과 추가

**기존 CSS:**
```css
background-color: #d1fae5; /* 초록색 배경 */
color: #065f46; /* 진한 초록 텍스트 */
padding: 1rem;
border-radius: 0.5rem;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
margin-bottom: 1rem;
```

**Tailwind 클래스:**
```html
<div class="p-4 rounded-lg shadow-md bg-green-100 text-green-800 mb-4">
    성공 메시지입니다.
</div>
```

### 플래시 메시지 클래스 상세 설명

| Tailwind 클래스 | 의미 | 기존 CSS 대응 |
|:---|:---|:---|
| `p-4` | 안쪽 여백 1rem | `padding: 1rem;` |
| `rounded-lg` | 모서리 둥글게 0.5rem | `border-radius: 0.5rem;` |
| `shadow-md` | 중간 크기 그림자 | `box-shadow: 0 2px 4px rgba(0,0,0,0.1);` |
| `bg-green-100` | 연한 초록색 배경 | `background-color: #d1fae5;` |
| `text-green-800` | 진한 초록색 텍스트 | `color: #065f46;` |
| `mb-4` | 아래쪽 여백 1rem | `margin-bottom: 1rem;` |

---

## 2) Navbar (메뉴바)

**원하는 디자인:**
- 화면 상단에 고정되고, 약간 반투명한 흰색 배경
- 메뉴 링크는 회색이고 hover하면 파란색으로 변함

**기존 CSS:**
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(8px);
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
position: fixed;
width: 100%;
z-index: 10;
```

**Tailwind 클래스:**
```html
<nav class="bg-white/80 backdrop-blur-md shadow-md fixed w-full z-10">
  <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
    <a href="#" class="text-lg font-bold text-blue-600">Home</a>
    <a href="#" class="text-gray-600 hover:text-blue-500">Login</a>
  </div>
</nav>
```

### Navbar 클래스 상세 설명

| Tailwind 클래스 | 의미 | 기존 CSS 대응 |
|:---|:---|:---|
| `bg-white/80` | 반투명 흰색 배경 | `background: rgba(255,255,255,0.8);` |
| `backdrop-blur-md` | 뒤에 흐림 효과 적용 | `backdrop-filter: blur(8px);` |
| `shadow-md` | 중간 크기 그림자 효과 | `box-shadow: 0 4px 6px rgba(0,0,0,0.1);` |
| `fixed` | 스크롤해도 항상 위에 고정 | `position: fixed;` |
| `w-full` | 너비 100% 채우기 | `width: 100%;` |
| `z-10` | z-index를 10으로 설정 | `z-index: 10;` |

**요약:**
- 하얀색 배경을 80% 투명도로 설정하고
- 뒤에 흐림 효과를 주고
- 그림자 효과를 넣어 부드럽게 띄우고
- 스크롤에도 항상 상단에 고정되게 하고
- 가로를 100% 채우며
- 다른 요소들보다 위에 보이게 설정합니다.

---

## 3) 버튼 (Button)

**원하는 디자인:**
- 파란 배경에 흰색 글자, 살짝 둥글고 hover하면 진한 파란색으로 변함

**기존 CSS:**
```css
background-color: #3b82f6;
color: white;
padding: 8px 16px;
border-radius: 0.5rem;
transition: background-color 0.3s;
```

**Tailwind 클래스:**
```html
<button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
    로그인
</button>
```

### 버튼 클래스 상세 설명

| Tailwind 클래스 | 의미 | 기존 CSS 대응 |
|:---|:---|:---|
| `bg-blue-500` | 파란 배경 | `background-color: #3b82f6;` |
| `hover:bg-blue-600` | hover 시 진한 파란색 배경 | `hover background-color` |
| `text-white` | 흰색 글자색 | `color: white;` |
| `py-2 px-4` | 세로 8px, 가로 16px 패딩 | `padding: 8px 16px;` |
| `rounded` | 둥근 모서리 | `border-radius: 0.5rem;` |
| `transition` | 부드러운 상태 변화 적용 | `transition: background-color 0.3s;` |

---

## 4) 입력폼 (Form Input)

**원하는 디자인:**
- 꽉 찬 너비, 테두리 있고, 약간 둥글고 패딩 추가

**기존 CSS:**
```css
width: 100%;
padding: 8px 16px;
border: 1px solid #ccc;
border-radius: 0.5rem;
margin-bottom: 1rem;
```

**Tailwind 클래스:**
```html
<input type="text" placeholder="입력" class="w-full px-4 py-2 border rounded-lg mb-4" />
```

### 입력폼 클래스 상세 설명

| Tailwind 클래스 | 의미 | 기존 CSS 대응 |
|:---|:---|:---|
| `w-full` | 전체 너비 사용 | `width: 100%;` |
| `px-4 py-2` | 좌우 16px, 상하 8px 패딩 | `padding: 8px 16px;` |
| `border` | 기본 테두리 추가 | `border: 1px solid #ccc;` |
| `rounded-lg` | 큰 둥근 모서리 | `border-radius: 0.5rem;` |
| `mb-4` | 아래쪽 여백 1rem | `margin-bottom: 1rem;` |

---

## 5) 트윗 카드 (Tweet Card)

**원하는 디자인:**
- 흰색 배경에 그림자, 둥글게 처리, hover하면 살짝 확대

**기존 CSS:**
```css
background: white;
padding: 1.5rem;
border-radius: 1rem;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
transition: transform 0.3s;
```

**Tailwind 클래스:**
```html
<div class="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
    트윗 내용
</div>
```

### 트윗 카드 클래스 상세 설명

| Tailwind 클래스 | 의미 | 기존 CSS 대응 |
|:---|:---|:---|
| `bg-white` | 흰색 배경 | `background: white;` |
| `p-6` | 안쪽 여백 1.5rem | `padding: 1.5rem;` |
| `rounded-xl` | 크게 둥근 모서리 | `border-radius: 1rem;` |
| `shadow-md` | 중간 크기 그림자 | `box-shadow: 0 4px 6px rgba(0,0,0,0.1);` |
| `hover:scale-105` | hover 시 살짝 확대 | `transform: scale(1.05);` |
| `transition-transform duration-300` | 변화를 0.3초간 부드럽게 적용 | `transition: transform 0.3s;` |

---

# 2. 기존 CSS 스타일과 Tailwind 변환 비교

| 기존 스타일 | Tailwind 스타일 변환 |
|:------|:------|
| `background-color: blue; color: white; padding: 8px 16px; border-radius: 8px;` | `bg-blue-500 text-white py-2 px-4 rounded` |
| `border: 1px solid #ccc; padding: 12px; border-radius: 8px;` | `border p-3 rounded-lg` |
| `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);` | `shadow-md` |
| `transition: all 0.3s ease; transform: scale(1.05);` | `transition-transform duration-300 hover:scale-105` |

> 즉, **CSS 속성 하나하나가 Tailwind의 "짧은 클래스"로 변환**되었습니다.

---

# 3. Tailwind 디자인 쉽게 적용하는 방법

✅ Tailwind CheatSheet를 열어두고 필요한 클래스만 빠르게 조합합니다.

✅ 초반에는 복잡한 디자인을 만들지 말고, 기본 요소(버튼, 폼, 카드)부터 연습합니다.

✅ "원하는 스타일"을 먼저 생각하고, Tailwind 클래스 이름을 찾아서 조합합니다.

✅ 복잡해 보이더라도, 한 줄 한 줄이 다 의미가 있으니 차근차근 추가합니다.

✅ 이미 자주 쓰는 패턴(버튼, 폼, 카드 등)은 미리 템플릿처럼 저장해놓으면 재사용할 수 있습니다.

---

# 4. 결론

- Tailwind는 스타일을 조립하는 방식이다.
- 기존 CSS보다 훨씬 빠르게 반응형, hover, transition 등을 적용할 수 있다.
- 처음에 클래스가 많아 보일 수 있지만, 패턴을 익히면 복붙 수준으로 빠르게 작업 가능하다.
- 우리 프로젝트는 이 패턴을 기반으로 통일감 있게 디자인하고 있다.

---

# 추천 링크
- [Tailwind CheatSheet 빠른 검색](https://nerdcave.com/tailwind-cheat-sheet)
- [TailwindCSS 공식 사이트](https://tailwindcss.com/)

