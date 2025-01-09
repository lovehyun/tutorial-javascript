const itemsPerLoad = 20;
const maxItemsOnScreen = 100; // 화면에 최대로 표시될 아이템 개수

let start = 0;
let end = start + itemsPerLoad;
let pStart = 0;
let pEnd = 0;
let loading = false; // 데이터를 불러오는 중인지 여부

const container = document.getElementById('scroll-container');

fetchData(); // 페이지 로딩 시 초기 데이터 로딩

function fetchData() {
    loading = true; // 데이터를 불러오는 중임을 표시
    console.log(`다음 데이터 요청 ${start}..${end}`);

    fetch(`/get-items?start=${start}&end=${end}`)
        .then((response) => response.json())
        .then((items) => {
            items.forEach((item) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.textContent = item;
                container.appendChild(itemElement);
            });

            // 화면에 최대로 표시될 아이템 개수를 넘으면 이전 아이템 삭제
            let itemsToRemove = container.children.length - maxItemsOnScreen;
            if (itemsToRemove > 0) {
                console.log(`OLD 데이터 앞 삭제: ${itemsToRemove} 개`)
                // 방법1. old legacy
                // for (let i = 0; i < itemsToRemove; i++) {
                //     container.removeChild(container.firstElementChild); // 앞 데이터 삭제
                // }

                // 방법2. simple
                while (itemsToRemove-- > 0) {
                    container.removeChild(container.firstElementChild);
                }

                // 방법3. modern style
                // for (const _ of Array(itemsToRemove)) {
                //     container.removeChild(container.firstElementChild);
                // }
            }

            // 다음 데이터를 가져오기 위해 start 값 업데이트
            start += items.length; // 가져온 데이터의 개수만큼 start를 증가
            end = start + itemsPerLoad;
        })
        .finally(() => {
            loading = false; // 데이터 로딩이 완료되었음을 표시
        });
}

// 이전 데이터 로딩 함수
function fetchPreviousData() {
    loading = true; // 데이터를 불러오는 중임을 표시

    // 현재 화면에 표시된 첫번째 아이템의 start 값을 가져옴
    const firstItem = container.firstElementChild;
    const pEnd = firstItem ? parseInt(firstItem.textContent.replace('Item ', '')) - 1 : 0;
    pStart = Math.max(0, pEnd - itemsPerLoad);

    console.log(`이전 데이터 요청 ${pStart}..${pEnd}`);

    fetch(`/get-items?start=${pStart}&end=${pEnd}`)
        .then((response) => response.json())
        .then((items) => {
            items.forEach((item) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.textContent = item;
                container.insertBefore(itemElement, firstItem);
            });

            // 화면 스크롤을 새로 추가된 아이템에 맞춰 조정
            const firstItemHeight = firstItem.clientHeight;
            const scrollBeforePos = firstItemHeight * items.length;
            // window.scrollTo(0, window.scrollY + scrollBeforePos); // (x, y) 좌표로 이동
            window.scrollBy(0, scrollBeforePos); // (dx, dy) 상대 좌표로 이동

            // 화면에 최대로 표시될 아이템 개수를 넘으면 이전 아이템 삭제
            const itemsToRemove = container.children.length - maxItemsOnScreen;
            if (itemsToRemove > 0) {
                console.log(`OLD 데이터 뒤 삭제: ${itemsToRemove} 개`)
                for (let i = 0; i < itemsToRemove; i++) {
                    container.removeChild(container.lastElementChild); // 뒤 데이터 삭제
                }
            }
        })
        .finally(() => {
            loading = false;
        });
}


// 무한스크롤 이벤트 감지
window.addEventListener('scroll', () => {
    if (!loading) {
        // 스크롤이 페이지 맨 아래에 도달했는지 확인
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            fetchData();
        }
        // 스크롤이 페이지 맨 위에 도달했는지 확인
        else if (window.scrollY === 0) {
            fetchPreviousData();
        }
    }
});
