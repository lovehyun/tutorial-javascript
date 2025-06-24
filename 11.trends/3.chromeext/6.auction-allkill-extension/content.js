// content.js

// 메시지 송수신의 전체 흐름
// popup.js (팝업 창) ↔ content.js (웹페이지)
//
// 1. 수집 시작
// popup.js: chrome.tabs.sendMessage(currentTab.id, { action: 'collect' })
//     ↓
// content.js: chrome.runtime.onMessage.addListener() 에서 수신
//     ↓
// content.js: startCollecting() 실행
//
// 2. 진행상황 업데이트
// content.js: chrome.runtime.sendMessage({ status: 'collecting', collected: 10 })
//     ↓
// popup.js: chrome.runtime.onMessage.addListener() 에서 수신
//     ↓
// popup.js: updateStatus() 호출하여 UI 업데이트

let windowItems = [];
let isCollecting = false;

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
