# 기반 이미지 선택
FROM nginx:latest

# 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 정적 파일 복사
COPY index.html .
COPY images/ ./images
COPY *.js ./

# NGINX 설정 파일 복사
# COPY nginx.conf /etc/nginx/conf.d/default.conf
