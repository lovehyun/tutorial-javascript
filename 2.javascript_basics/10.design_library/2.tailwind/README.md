# **Tailwind CSS 주요 유틸리티 클래스 정리**

---

## **1. 색상 관련 클래스**
### **배경색**
- `bg-{color}-{number}`: 배경 색상 지정 (e.g., `bg-blue-500`, `bg-gray-100`).
- `bg-transparent`: 투명 배경.
- `bg-white`, `bg-black`: 흰색 및 검정색 배경.

### **텍스트 색상**
- `text-{color}-{number}`: 텍스트 색상 지정 (e.g., `text-red-500`, `text-green-700`).
- `text-transparent`: 투명 텍스트.
- `text-white`, `text-black`: 흰색 및 검정색 텍스트.

### **테두리 색상**
- `border-{color}-{number}`: 테두리 색상 지정 (e.g., `border-blue-500`).

---

## **2. 여백 및 패딩**
### **마진 (Margin)**
- `m-{number}`: 모든 방향에 동일한 여백.
- `mt-{number}`, `mr-{number}`, `mb-{number}`, `ml-{number}`: 위, 오른쪽, 아래, 왼쪽 여백.
- `mx-{number}`, `my-{number}`: 수평, 수직 여백.

### **패딩 (Padding)**
- `p-{number}`: 모든 방향에 동일한 패딩.
- `pt-{number}`, `pr-{number}`, `pb-{number}`, `pl-{number}`: 위, 오른쪽, 아래, 왼쪽 패딩.
- `px-{number}`, `py-{number}`: 수평, 수직 패딩.

---

## **3. 레이아웃**
### **Flexbox**
- `flex`: Flexbox 컨테이너 생성.
- `flex-row`, `flex-col`: 방향 설정 (가로/세로).
- `justify-start`, `justify-center`, `justify-end`: 수평 정렬.
- `items-start`, `items-center`, `items-end`: 수직 정렬.

### **Grid**
- `grid`: Grid 컨테이너 생성.
- `grid-cols-{number}`: 열 개수 설정 (e.g., `grid-cols-3`).
- `gap-{number}`: 그리드 셀 간의 간격.

---

## **4. 테두리 및 그림자**
### **테두리**
- `border`: 기본 테두리.
- `border-0`, `border-t`, `border-b`, `border-l`, `border-r`: 특정 방향의 테두리만 적용.
- `rounded`, `rounded-lg`, `rounded-full`: 모서리 둥글게.

### **그림자**
- `shadow`, `shadow-md`, `shadow-lg`: 그림자 크기.
- `shadow-none`: 그림자 제거.

---

## **5. 텍스트**
### **정렬 및 크기**
- `text-left`, `text-center`, `text-right`: 텍스트 정렬.
- `text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`: 텍스트 크기.

### **스타일**
- `font-bold`, `font-medium`, `font-light`: 폰트 두께.
- `italic`: 기울임꼴.
- `uppercase`, `lowercase`, `capitalize`: 텍스트 변환.

---

## **6. 버튼**
### **기본 스타일**
- `bg-{color}-{number}`: 배경 색상.
- `text-white`, `text-black`: 텍스트 색상.
- `py-{number}`, `px-{number}`: 버튼 크기 설정.
- `rounded`: 둥근 모서리.

---

## **7. 크기**
- `w-{number}`: 너비 설정 (e.g., `w-1/2`, `w-full`).
- `h-{number}`: 높이 설정 (e.g., `h-32`, `h-screen`).

---

## **8. 반응형**
### **미디어 쿼리**
- `sm:{class}`, `md:{class}`, `lg:{class}`, `xl:{class}`: 화면 크기별 클래스 적용.
  - `sm`: 최소 640px.
  - `md`: 최소 768px.
  - `lg`: 최소 1024px.
  - `xl`: 최소 1280px.
- 예: `md:text-center`, `lg:py-4`.

---

## **9. 배경 관련**
### **배경 이미지**
- `bg-cover`: 배경 이미지 채우기.
- `bg-contain`: 배경 이미지 비율 유지.
- `bg-no-repeat`: 반복 제거.

### **위치**
- `bg-center`, `bg-top`, `bg-bottom`, `bg-left`, `bg-right`: 배경 위치 지정.

---

## **10. 디스플레이**
- `hidden`: 숨기기.
- `block`: 블록 요소.
- `inline`, `inline-block`: 인라인 요소.
- `flex`, `grid`: Flexbox 또는 Grid 컨테이너.
- `absolute`, `relative`, `fixed`, `sticky`: 위치 설정.

---

## **11. 반응형 유틸리티**
- `sm:`, `md:`, `lg:`, `xl:`: 화면 크기별 유틸리티 적용.
- `sm:w-1/2`, `md:py-4`, `lg:text-lg`: 예제.

---

이 가이드는 **Tailwind CSS**에서 자주 사용하는 클래스들을 체계적으로 정리한 자료입니다. 필요에 따라 조합하여 커스터마이징된 UI를 쉽게 구현할 수 있습니다.
