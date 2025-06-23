document.addEventListener('DOMContentLoaded', () => {
    // 상태 표시 함수
    function updateStatus(message, color = 'blue') {
        const statusEl = document.getElementById('status');
        statusEl.innerText = message;
        statusEl.style.color = color;
    }

    // 시작하자마자 저장소에 데이터가 있는지 확인
    chrome.storage.local.get('allkillItems', (result) => {
        if (result.allkillItems && result.allkillItems.length > 0) {
            updateStatus(`✅ 저장된 상품: ${result.allkillItems.length}개`);
        } else {
            updateStatus('저장된 상품이 없습니다.');
        }
    });

    // 상품 수집
    document.getElementById('collectBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let currentTab = tabs[0];

            if (!currentTab.url.includes('https://www.auction.co.kr/n/allkill')) {
                updateStatus('❌ 올킬 페이지가 아닙니다.', 'red');
                return;
            }

            // 수집 시작 전에 저장소 초기화
            chrome.storage.local.remove('allkillItems', () => {
                updateStatus('이전 데이터 초기화 완료. 상품 수집 시작...');

                // 수집 시작 요청
                chrome.tabs.sendMessage(currentTab.id, { action: 'collect' });
            });
        });
    });

    // 데이터 초기화 버튼
    document.getElementById('clearBtn').addEventListener('click', () => {
        chrome.storage.local.remove('allkillItems', () => {
            updateStatus('✅ 저장된 데이터 초기화 완료!');
        });
    });

    // 상태 메시지 수신
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.status === 'collecting') {
            updateStatus(`상품 수집중... 현재 ${message.collected}개 수집`);
        } else if (message.status === 'done') {
            updateStatus(`✅ 상품 수집 완료! 총 ${message.collected}개 수집`);
        } else if (message.status === 'error') {
            updateStatus(`❌ ${message.message}`, 'red');
        }
    });

    // 페이지 열기 공통 함수
    function openPage(fileName) {
        let url = chrome.runtime.getURL(`pages/${fileName}`);
        window.open(url);
    }


    // 할인율순 새탭 열기
    document.getElementById('sortDiscountBtn').addEventListener('click', () => {
        chrome.storage.local.get('allkillItems', (result) => {
            if (!result.allkillItems || !result.allkillItems.length) {
                updateStatus('❌ 저장된 상품이 없습니다. 먼저 수집하세요.', 'red');
                return;
            }
            openPage('discount.html');
        });
    });

    // 최저가순 새탭 열기
    document.getElementById('sortPriceBtn').addEventListener('click', () => {
        chrome.storage.local.get('allkillItems', (result) => {
            if (!result.allkillItems || !result.allkillItems.length) {
                updateStatus('❌ 저장된 상품이 없습니다. 먼저 수집하세요.', 'red');
                return;
            }
            openPage('price.html');
        });
    });

    // 검색 탭 열기
    document.getElementById('searchBtn').addEventListener('click', () => {
        chrome.storage.local.get('allkillItems', (result) => {
            if (!result.allkillItems || !result.allkillItems.length) {
                updateStatus('❌ 저장된 상품이 없습니다. 먼저 수집하세요.', 'red');
                return;
            }
            openPage('search.html');
        });
    });
});
