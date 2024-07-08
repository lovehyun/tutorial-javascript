# 카카오 지도 API 연동하기

## 1. 카카오 디벨로퍼스 회원가입 및 로그인
- 먼저 [카카오 디벨로퍼스](https://developers.kakao.com/) 웹사이트에 회원가입을 합니다.
- 가입 후, 로그인합니다.

## 2. 애플리케이션 생성
- 로그인 후, 상단의 '내 애플리케이션' 메뉴를 클릭합니다.
- '애플리케이션 추가하기' 버튼을 클릭하여 새로운 애플리케이션을 생성합니다.
  - 애플리케이션 이름과 사업자 정보 등을 입력합니다.
  
## 3. 앱 키 발급
- 애플리케이션을 생성하면 '앱 키'를 발급받을 수 있습니다.
- '내 애플리케이션'에서 생성한 애플리케이션을 클릭하면 '앱 키' 탭에서 네 가지 키(네이티브 앱 키, REST API 키, JavaScript 키, Admin 키)를 확인할 수 있습니다.
  - 카카오 지도 API를 사용할 때는 주로 JavaScript 키를 사용합니다.

## 4. 도메인 등록
- 카카오 지도 API는 보안상의 이유로 사용할 도메인을 등록해야 합니다.
- '내 애플리케이션'의 '설정' > '일반' 메뉴에서 '플랫폼' 섹션으로 이동합니다.
- '웹' 플랫폼을 추가하고, 사용할 도메인을 입력합니다. (예: http://localhost:3000, http://www.yourdomain.com)

## 5. API 호출 설정
- 이제 JavaScript 키를 사용하여 카카오 지도 API를 호출할 수 있습니다.
- HTML 파일에 카카오 지도 API 스크립트를 추가합니다.

    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>카카오 지도 API 연동</title>
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_JAVASCRIPT_KEY"></script>
    </head>
    <body>
        <div id="map" style="width:500px;height:400px;"></div>
        <script>
            var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                mapOption = { 
                    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                };

            var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        </script>
    </body>
    </html>
    ```

    위의 예시에서 `YOUR_JAVASCRIPT_KEY` 부분을 발급받은 JavaScript 키로 대체합니다.

## 6. 테스트 및 배포
- 로컬 환경에서 테스트하여 지도 API가 정상적으로 작동하는지 확인합니다.
- 모든 설정이 완료되면 실제 서비스 도메인에서도 동일한 방식으로 연동합니다.
