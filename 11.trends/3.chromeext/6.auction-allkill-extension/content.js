// content.js

let windowItems = [];
let isCollecting = false;

// 메시지 수신 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'collect') {
        startCollecting();
    } else if (request.action === 'sortDiscount') {
        loadItems(sortByDiscount);
    } else if (request.action === 'sortPrice') {
        loadItems(sortByPrice);
    } else if (request.action === 'search') {
        loadItems(openSearchPage);
    }
});

// 상품 수집 함수
function startCollecting() {
    if (isCollecting) return;
    isCollecting = true;
    windowItems = [];

    let previousLength = 0;

    let intervalId = setInterval(() => {
        window.scrollBy(0, 1000);

        document.querySelectorAll('ul#allkill-list li.list-item__allkill').forEach(li => {
            let title = li.querySelector('p.text__title')?.innerText.trim();
            let discountText = li.querySelector('span.text__discount-rate')?.innerText.trim();
            let discount_rate = discountText ? parseInt(discountText.replace('%', '')) : 0;
            let originalPriceText = li.querySelector('span.text__price-origin > span.text__num')?.innerText.trim();
            let original_price = originalPriceText ? parseInt(originalPriceText.replace(/[^0-9]/g, '')) : 0;
            let salePriceText = li.querySelector('span.text__sales')?.innerText.trim();
            let sale_price = salePriceText ? parseInt(salePriceText.replace(/[^0-9]/g, '')) : 0;
            let link = li.querySelector('a.link__item')?.href;

            if (title && link && !windowItems.some(item => item.link === link)) {
                windowItems.push({ title, discount_rate, original_price, sale_price, link });
            }
        });

        console.log(`현재 수집 상품 수: ${windowItems.length}`);

        chrome.runtime.sendMessage({ status: 'collecting', collected: windowItems.length });

        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (windowItems.length === previousLength) {
                clearInterval(intervalId);
                chrome.storage.local.set({ allkillItems: windowItems });
                console.log('스크롤 완료 및 저장 완료');
                chrome.runtime.sendMessage({ status: 'done', collected: windowItems.length });
                isCollecting = false;
            } else {
                previousLength = windowItems.length;
            }
        }
    }, 500);
}

// 데이터 불러오기 후 콜백 실행
function loadItems(callback) {
    chrome.storage.local.get('allkillItems', (result) => {
        if (!result.allkillItems || !result.allkillItems.length) {
            chrome.runtime.sendMessage({ status: 'error', message: '상품이 없습니다. 먼저 수집하세요.' });
            return;
        }
        windowItems = result.allkillItems;
        callback(windowItems);
    });
}
