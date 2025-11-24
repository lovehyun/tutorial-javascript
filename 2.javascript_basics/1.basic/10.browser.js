// 1. 인쇄창 열기 — window.print()
window.print();
// 실제 프린트 다이얼로그가 바로 뜹니다.


// 2. 현재 URL 바꾸기 — location.href
location.href = "https://google.com";
// 즉시 구글로 이동합니다.


// 3. 페이지 새로고침 — location.reload()
location.reload();


// 4. 히스토리 뒤로/앞으로 이동 — history.back(), history.forward()
history.back();     // 뒤로가기
history.forward();  // 앞으로가기
history.go(-2);     // 2페이지 뒤로


// 5. 새 창/새 탭 열기 — window.open()
window.open("https://naver.com", "_blank");
// 새 탭으로 네이버 열림


// 6. 북마크
// (중요) 북마크는 읽을 수 없음
// 브라우저 보안 정책 때문에 "북마크 목록을 JS에서 읽는 건 100% 불가능"
// Chrome, Firefox, Safari, Edge 모두 금지입니다.

// 다만 북마크 추가 팝업을 띄우는 기능은 있음

// 6. 북마크(즐겨찾기 추가) 팝업 띄우기 (브라우저마다 다름)
window.external.AddFavorite("https://example.com", "예제 사이트"); 

// IE 계열에서만 동작
// Chrome/Edge/Firefox는 보안 때문에 불가

// → 그래서 북마크 기능은 일반 웹사이트에서는 제어할 수 없음


// 7. 클립보드 복사 — navigator.clipboard.writeText()
navigator.clipboard.writeText("Hello!").then(() => {
  console.log("복사됨!");
});
// 실제 OS 클립보드에 문자열이 복사됨


// 8. 화면 전체화면 전환 — Fullscreen API
document.documentElement.requestFullscreen();

// 전체화면 해제:
document.exitFullscreen();


// 9. 진동 API (모바일에서만)
navigator.vibrate(200);  // 0.2초 진동


// 10. 배터리 잔량 가져오기 — Battery Status API
navigator.getBattery().then(b => {
    console.log("배터리:", b.level * 100 + "%");
    console.log("충전중:", b.charging);
});


// 11. 현재 브라우저 정보 — navigator.userAgent
navigator.userAgent;

// 보너스: 브라우저 창 크기 조작 (일부 브라우저에서만 허용)
window.resizeTo(800, 600);

// Chrome에서는 대부분 브라우저 정책상 차단됨
// Electron 앱이나 팝업 창에서는 가능.

