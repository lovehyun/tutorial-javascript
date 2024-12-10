const itemsPerLoad = 20;
const maxItemsOnScreen = 100; // 화면에 최대로 표시될 아이템 개수

let loading = false; // 데이터를 불러오는 중인지 여부

const container = document.getElementById('scroll-container');

loadInitialData(); // 페이지 로딩 시 초기 데이터 로딩

// 초기 데이터 로딩
function loadInitialData() {
    console.log(`초기 데이터 로딩 시작...`)
    fetchData(0, itemsPerLoad);
}

function fetchData(start, end) {
    loading = true; // 데이터를 불러오는 중임을 표시
    console.log(`다음 데이터 요청 ${start}..${end}`);

    fetch(`/get-items?start=${start}&end=${end}`)
        .then((response) => response.json())
        .then((items) => {
            items.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.textContent = item;
                itemElement.id = start + index + 1; // 인덱스 번호 1부터 시작
                container.appendChild(itemElement);
            });

            // 화면에 최대로 표시될 아이템 개수를 넘으면 이전 아이템 삭제
            const itemsToRemove = container.children.length - maxItemsOnScreen;
            if (itemsToRemove > 0) {
                console.log(`OLD 데이터 앞 삭제: ${itemsToRemove} 개`)
                for (let i = 0; i < itemsToRemove; i++) {
                    container.removeChild(container.firstElementChild); // 앞 데이터 삭제
                }
            }
        })
        .finally(() => {
            loading = false; // 데이터 로딩이 완료되었음을 표시
        });
}

// 이전 데이터 로딩 함수
function fetchPreviousData(pStart, pEnd) {
    loading = true; // 데이터를 불러오는 중임을 표시

    console.log(`이전 데이터 요청 ${pStart}..${pEnd}`);

    fetch(`/get-items?start=${pStart}&end=${pEnd}`)
        .then((response) => response.json())
        .then((items) => {
            items.reverse(); // 역순으로 가져오기
            items.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.textContent = item;
                itemElement.id = pEnd - index;
                container.insertBefore(itemElement, container.firstElementChild);
            });

            // 화면 스크롤을 새로 추가된 아이템에 맞춰 조정
            const firstItem = container.firstElementChild;
            const firstItemHeight = firstItem.clientHeight;
            const scrollBeforePos = firstItemHeight * items.length;
            window.scrollTo(0, window.scrollY + scrollBeforePos);

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
            const lastItem = container.lastElementChild;
            const start = parseInt(lastItem?.id);
            fetchData(start, start + itemsPerLoad);
        }
        // 스크롤이 페이지 맨 위에 도달했는지 확인
        else if (window.scrollY === 0) {
            const firstItem = container.firstElementChild;
            const pEnd = Math.max(0, parseInt(firstItem?.id) - 1);
            const pStart = Math.max(0, pEnd - itemsPerLoad);
            fetchPreviousData(pStart, pEnd);
        }
    }
});
