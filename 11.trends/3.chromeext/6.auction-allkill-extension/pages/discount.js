// 할인율 정렬 페이지 스크립트
document.addEventListener('DOMContentLoaded', () => {
    // 저장소에서 수집된 상품 데이터 불러오기
    chrome.storage.local.get('allkillItems', (result) => {
        // 저장된 상품이 없는 경우 처리
        if (!result.allkillItems || !result.allkillItems.length) {
            document.getElementById('resultArea').innerText = '상품이 없습니다.';
            return;
        }

        // 할인율 높은 순으로 정렬 (깊은 복사 후 정렬)
        let sorted = [...result.allkillItems].sort((a, b) => b.discount_rate - a.discount_rate);

        // 테이블 HTML 생성 시작 (헤더 추가)
        let html = '<table><tr><th>할인율</th><th>상품명</th><th>판매가</th><th>링크</th></tr>';
        
        // 각 상품을 테이블 행으로 변환
        sorted.forEach(item => {
            html += '<tr>' +
                '<td>' + item.discount_rate + '%</td>' +                              // 할인율 표시
                '<td>' + item.title + '</td>' +                                       // 상품명 표시
                '<td>' + item.sale_price.toLocaleString() + '원</td>' +              // 판매가 (천단위 콤마)
                '<td><a href="' + item.link + '" target="_blank">바로가기</a></td>' + // 새창에서 링크 열기
                '</tr>';
        });
        
        // 테이블 HTML 완성
        html += '</table>';

        // 완성된 테이블을 화면에 표시
        document.getElementById('resultArea').innerHTML = html;
    });
});
