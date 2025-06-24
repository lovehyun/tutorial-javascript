// 상품 검색 페이지 스크립트
document.addEventListener('DOMContentLoaded', () => {
    // 전체 상품 데이터를 저장할 변수
    let items = [];

    // 저장소에서 수집된 상품 데이터 불러오기
    chrome.storage.local.get('allkillItems', (result) => {
        // 저장된 상품이 없는 경우 처리
        if (!result.allkillItems || !result.allkillItems.length) {
            document.getElementById('resultArea').innerText = '상품이 없습니다. 먼저 수집하세요.';
            return;
        }
        
        // 전역 변수에 상품 데이터 저장
        items = result.allkillItems;

        // 페이지 로드 시 전체 상품 목록 표시
        renderItems(items);
    });

    // 검색 입력창에 실시간 검색 이벤트 연결
    document.getElementById('searchInput').addEventListener('input', () => {
        // 입력된 검색어를 소문자로 변환 (대소문자 구분 없이 검색)
        let keyword = document.getElementById('searchInput').value.toLowerCase();

        // 검색어가 비어있으면 전체 목록 표시
        if (keyword.trim() === '') {
            renderItems(items);
            return;
        }

        // 상품명에 검색어가 포함된 상품들만 필터링
        let filtered = items.filter(item => item.title.toLowerCase().includes(keyword));
        
        // 필터링된 결과 표시
        renderItems(filtered);
    });

    // 상품 목록을 테이블로 렌더링하는 함수
    function renderItems(displayItems) {
        // 표시할 상품이 없는 경우 처리
        if (!displayItems.length) {
            document.getElementById('resultArea').innerText = '검색 결과가 없습니다.';
            return;
        }

        // 테이블 HTML 생성 시작 (헤더 추가)
        let html = '<table><tr><th>상품명</th><th>판매가</th><th>링크</th></tr>';
        
        // 각 상품을 테이블 행으로 변환
        displayItems.forEach(item => {
            html += '<tr>' +
                '<td>' + item.title + '</td>' +                                       // 상품명 표시
                '<td>' + item.sale_price.toLocaleString() + '원</td>' +              // 판매가 (천단위 콤마)
                '<td><a href="' + item.link + '" target="_blank">바로가기</a></td>' + // 새창에서 링크 열기
                '</tr>';
        });
        
        // 테이블 HTML 완성
        html += '</table>';

        // 완성된 테이블을 화면에 표시
        document.getElementById('resultArea').innerHTML = html;
    }
});
