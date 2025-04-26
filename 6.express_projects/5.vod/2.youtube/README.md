# YouTube 클론 프로젝트

Express.js와 Vanilla JavaScript를 사용한 간단한 YouTube 클론 프로젝트입니다.

## 기능

- 비디오 업로드 및 스트리밍
- 비디오 시청 및 조회수 카운트
- 댓글 작성 및 조회
- 좋아요/싫어요 기능
- 간단한 사용자 인증

## 설치 및 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/yourusername/youtube-clone.git
cd youtube-clone
```

2. 의존성 설치
```bash
npm install
```

3. 서버 실행
```bash
npm start
```

개발 모드로 실행 (nodemon 사용)
```bash
npm run dev
```

4. 브라우저에서 확인
```
http://localhost:3000
```

## 프로젝트 구조

```
youtube-clone/
├── src/                # 서버 소스 코드
│   ├── server.js       # 메인 서버 파일
│   ├── controllers/    # 컨트롤러
│   ├── models/         # 데이터 모델
│   ├── routes/         # API 라우트
│   └── middleware/     # 미들웨어
├── public/             # 정적 파일
│   ├── css/            # 스타일시트
│   ├── js/             # 클라이언트 JavaScript
│   └── uploads/        # 업로드된 파일 저장소
├── views/              # HTML 파일
└── package.json
```

## 기술 스택

- 백엔드: Express.js
- 프론트엔드: HTML, CSS, Vanilla JavaScript
- 파일 업로드: Multer

## 참고 사항

이 프로젝트는 교육 목적으로 만들어졌으며, 실제 YouTube 서비스의 모든 기능을 구현하지는 않았습니다. 데이터는 서버 메모리에 임시로 저장되며, 서버를 재시작하면 모든 데이터가 초기화됩니다. 실제 프로덕션 환경에서는 MongoDB, MySQL 등의 데이터베이스를 연결하여 사용하는 것이 좋습니다.
