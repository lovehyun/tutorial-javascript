# 1. Nginx 기반 이미지를 사용
FROM nginx:alpine

# 2. 빌드된 React 앱을 Nginx의 기본 경로로 복사
COPY build/ /usr/share/nginx/html

# 3. Nginx 기본 설정 복사 (필요 시)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4. 컨테이너가 실행될 때 Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
