my-react-app/
├── public/               # 정적 파일 (index.html 포함)
├── src/                  # 소스 코드
│   ├── components/       # 재사용 가능한 컴포넌트 모음
│   │   ├── Header.js     # 헤더 컴포넌트
│   │   ├── PostForm.js   # 글 작성 폼 컴포넌트
│   │   ├── PostList.js   # 게시물 목록 컴포넌트
│   │   └── Thumbnail.js  # 썸네일 표시 컴포넌트
│   ├── api/              # API 관련 설정
│   │   └── api.js        # axios 인스턴스
│   ├── styles/           # 스타일(CSS) 관련 파일
│   │   └── App.css       # 메인 CSS
│   ├── App.js            # 메인 App 컴포넌트
│   ├── index.js          # 진입점 파일
│   └── utils/            # 유틸리티 함수 모음 (옵션)
│       └── formatDate.js # 날짜 포맷 함수
├── .env                  # 환경 변수 파일 (API URL 등)
├── package.json          # 프로젝트 설정 및 의존성
└── README.md             # 프로젝트 설명
