
# Express API 테스트 가이드

이 문서는 Express 서버 API 엔드포인트를 테스트하기 위한 `curl` 명령어를 제공합니다.

---

## 1. 게시물 목록 조회 (`GET /api/posts`)

### 리눅스 명령어
```bash
curl -X GET http://localhost:3000/api/posts
```

### 윈도우 CMD 명령어
```cmd
curl -X GET http://localhost:3000/api/posts
```

- **설명**: 저장된 모든 게시물을 조회합니다.
- **결과**: 게시물 리스트(JSON 형식)

---

## 2. 게시물 생성 (`POST /api/posts`)

### 텍스트 게시물 생성
#### 리눅스 명령어
```bash
curl -X POST http://localhost:3000/api/posts \
    -H "Content-Type: application/json" \
    -d '{
        "title": "테스트 제목",
        "content": "테스트 내용"
    }'
```

#### 윈도우 CMD 명령어
```cmd
curl -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"title\": \"테스트 제목\", \"content\": \"테스트 내용\"}"
```

- **설명**: 제목과 내용으로 새로운 게시물을 생성합니다(이미지 없이).

---

### 이미지 포함 게시물 생성
#### 리눅스 명령어
```bash
curl -X POST http://localhost:3000/api/posts \
    -H "Content-Type: multipart/form-data" \
    -F "title=테스트 제목" \
    -F "content=테스트 내용" \
    -F "photo=@/path/to/image.jpg"
```

#### 윈도우 CMD 명령어
```cmd
curl -X POST http://localhost:3000/api/posts -H "Content-Type: multipart/form-data" -F "title=테스트 제목" -F "content=테스트 내용" -F "photo=@C:\path\to\image.jpg"
```

- **설명**: 제목, 내용, 이미지를 포함한 새로운 게시물을 생성합니다.
- **참고**: `/path/to/image.jpg` (리눅스) 또는 `C:\path\to\image.jpg` (윈도우)로 실제 파일 경로를 변경해야 합니다.

---

## 3. 특정 이미지 보기 (`GET /api/images/:filename`)

### 리눅스 명령어
```bash
curl -X GET http://localhost:3000/api/images/<filename> --output output.jpg
```

### 윈도우 CMD 명령어
```cmd
curl -X GET http://localhost:3000/api/images/<filename> --output output.jpg
```

- **설명**: 특정 이미지를 다운로드합니다.
- **참고**: `<filename>`을 실제 이미지 파일 이름으로 변경해야 합니다(예: `photo_1691234567890.jpg`).
- **결과**: 이미지가 `output.jpg`로 저장됩니다.

---

## 4. 게시물 삭제 (`DELETE /api/posts/:index`)

### 리눅스 명령어
```bash
curl -X DELETE http://localhost:3000/api/posts/1
```

### 윈도우 CMD 명령어
```cmd
curl -X DELETE http://localhost:3000/api/posts/1
```

- **설명**: 지정한 번호의 게시물을 삭제합니다(예: 첫 번째 게시물).

---

## 테스트 흐름 예시

1. 게시물 목록 확인 (초기 상태):
   - 리눅스: `curl -X GET http://localhost:3000/api/posts`
   - 윈도우: `curl -X GET http://localhost:3000/api/posts`

2. 새 게시물 생성 (이미지 포함):
   - 리눅스:
     ```bash
     curl -X POST http://localhost:3000/api/posts \
         -H "Content-Type: multipart/form-data" \
         -F "title=테스트 제목" \
         -F "content=테스트 내용" \
         -F "photo=@/path/to/image.jpg"
     ```
   - 윈도우:
     ```cmd
     curl -X POST http://localhost:3000/api/posts -H "Content-Type: multipart/form-data" -F "title=테스트 제목" -F "content=테스트 내용" -F "photo=@C:\path\to\image.jpg"
     ```

3. 생성된 게시물 목록 확인:
   - 리눅스: `curl -X GET http://localhost:3000/api/posts`
   - 윈도우: `curl -X GET http://localhost:3000/api/posts`

4. 첫 번째 게시물 삭제:
   - 리눅스: `curl -X DELETE http://localhost:3000/api/posts/1`
   - 윈도우: `curl -X DELETE http://localhost:3000/api/posts/1`

---

경로와 파일 이름을 적절히 변경하여 환경에 맞게 명령어를 실행하세요. 위 명령어를 통해 API 기능을 검증할 수 있습니다.
