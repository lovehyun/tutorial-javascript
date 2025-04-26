# CRM Menu 설명

## 코드 설명

### Head 부분
- `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`
  - Bootstrap CSS 파일을 포함하여, Bootstrap의 스타일을 사용할 수 있도록 합니다.

### Navbar 부분
- `<nav class="navbar navbar-expand-lg navbar-light bg-light">`
  - `navbar`: 네비게이션 바를 나타내는 기본 클래스입니다.
  - `navbar-expand-lg`: 화면 크기가 `lg` (large) 이상일 때 네비게이션 바를 확장합니다. 화면이 작을 때는 메뉴가 축소되어 버튼으로 전환됩니다.
  - `navbar-light`: 밝은 배경색에 어울리는 네비게이션 바 스타일을 적용합니다.
  - `bg-light`: 밝은 배경색을 적용합니다.

- `<div class="container-fluid">`
  - `container-fluid`: 부모 요소의 너비를 100%로 채우는 컨테이너입니다.

- `<a class="navbar-brand" href="#">MyLogo</a>`
  - `navbar-brand`: 네비게이션 바의 브랜드 이름이나 로고를 나타냅니다.

- `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">`
  - `navbar-toggler`: 화면이 작을 때 네비게이션 바를 토글(열기/닫기)하는 버튼을 나타냅니다.
  - `data-bs-toggle="collapse"`: 버튼을 클릭하면 지정된 요소를 열거나 닫습니다.
  - `data-bs-target="#navbarNav"`: 토글할 타겟 요소의 ID를 지정합니다.
  - `aria-controls="navbarNav"`: 이 버튼이 제어하는 요소의 ID를 지정합니다.
  - `aria-expanded="false"`: 네비게이션 바가 닫혀 있음을 나타냅니다.
  - `aria-label="Toggle navigation"`: 버튼의 용도를 설명하는 접근성 라벨입니다.

- `<div class="collapse navbar-collapse" id="navbarNav">`
  - `collapse`: 요소를 토글할 수 있게 합니다.
  - `navbar-collapse`: 네비게이션 바의 확장 가능한 부분을 나타냅니다.
  - `id="navbarNav"`: 위의 버튼이 제어하는 요소의 ID입니다.

- `<ul class="navbar-nav">`
  - `navbar-nav`: 네비게이션 바 내의 리스트를 나타냅니다.

- `<li class="nav-item">`
  - `nav-item`: 네비게이션 바 내의 각각의 항목을 나타냅니다.

- `<a class="nav-link" href="#">User</a>`
  - `nav-link`: 네비게이션 바 내의 링크를 나타냅니다.

### 본문 부분
- `<main class="container mt-4">`
  - `container`: 중앙에 정렬되고 고정된 너비를 가지는 컨테이너를 나타냅니다.
  - `mt-4`: 상단에 4단위의 여백을 추가합니다.

- `<table class="table table-striped">`
  - `table`: 기본 테이블 스타일을 적용합니다.
  - `table-striped`: 행마다 다른 배경색을 적용하여 줄무늬 스타일을 만듭니다.

- `<thead>`, `<tbody>`: 테이블의 헤더와 본문을 정의합니다.

### 페이지네이션 부분
- `<nav aria-label="Page navigation example">`
  - `aria-label="Page navigation example"`: 페이지 네비게이션을 설명하는 접근성 라벨입니다.

- `<ul class="pagination justify-content-center">`
  - `pagination`: 페이지네이션 스타일을 적용합니다.
  - `justify-content-center`: 페이지네이션을 중앙에 정렬합니다.

- `<li class="page-item">`
  - `page-item`: 페이지네이션 내의 각 항목을 나타냅니다.

- `<a class="page-link" href="#">`
  - `page-link`: 페이지네이션 내의 링크를 나타냅니다.

### 스크립트 부분
- `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`
  - Bootstrap의 JavaScript 파일을 포함하여, JavaScript 기반의 Bootstrap 컴포넌트를 사용할 수 있도록 합니다.
