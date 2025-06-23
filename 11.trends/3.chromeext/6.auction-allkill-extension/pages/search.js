document.addEventListener('DOMContentLoaded', () => {
    let items = [];

    chrome.storage.local.get('allkillItems', (result) => {
        if (!result.allkillItems || !result.allkillItems.length) {
            document.getElementById('resultArea').innerText = '상품이 없습니다. 먼저 수집하세요.';
            return;
        }
        items = result.allkillItems;

        // 기본 전체 목록 출력
        renderItems(items);
    });

    document.getElementById('searchInput').addEventListener('input', () => {
        let keyword = document.getElementById('searchInput').value.toLowerCase();

        if (keyword.trim() === '') {
            // 검색어 없으면 전체 목록 보여주기
            renderItems(items);
            return;
        }

        let filtered = items.filter(item => item.title.toLowerCase().includes(keyword));
        renderItems(filtered);
    });

    function renderItems(displayItems) {
        if (!displayItems.length) {
            document.getElementById('resultArea').innerText = '검색 결과가 없습니다.';
            return;
        }

        let html = '<table><tr><th>상품명</th><th>판매가</th><th>링크</th></tr>';
        displayItems.forEach(item => {
            html += '<tr>' +
                '<td>' + item.title + '</td>' +
                '<td>' + item.sale_price.toLocaleString() + '원</td>' +
                '<td><a href="' + item.link + '" target="_blank">바로가기</a></td>' +
                '</tr>';
        });
        html += '</table>';

        document.getElementById('resultArea').innerHTML = html;
    }
});
