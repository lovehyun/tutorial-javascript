document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('allkillItems', (result) => {
        if (!result.allkillItems || !result.allkillItems.length) {
            document.getElementById('resultArea').innerText = '상품이 없습니다. 먼저 수집하세요.';
            return;
        }

        let sorted = [...result.allkillItems].sort((a, b) => a.sale_price - b.sale_price);

        let html = '<table><tr><th>판매가</th><th>상품명</th><th>링크</th></tr>';
        sorted.forEach(item => {
            html += '<tr>' +
                '<td>' + item.sale_price.toLocaleString() + '원</td>' +
                '<td>' + item.title + '</td>' +
                '<td><a href="' + item.link + '" target="_blank">바로가기</a></td>' +
                '</tr>';
        });
        html += '</table>';

        document.getElementById('resultArea').innerHTML = html;
    });
});
