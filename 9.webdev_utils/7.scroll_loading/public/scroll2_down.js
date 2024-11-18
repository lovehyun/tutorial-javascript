const itemsPerLoad = 20;

let start = 0;
let end = start + itemsPerLoad;
let loading = false; // 데이터를 불러오는 중인지 여부

const container = document.getElementById('scroll-container');

loadInitialData(); // 페이지 로딩 시 초기 데이터 로딩

// 초기 데이터 로딩
function loadInitialData() {
    console.log(`초기 데이터 로딩 ${start}..${end}`)
    fetchData();
}

function fetchData() {
    loading = true; // 데이터를 불러오는 중임을 표시

    fetch(`/get-items?start=${start}&end=${end}`)
        .then((response) => response.json())
        .then((items) => {
            items.forEach((item) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.textContent = item;
                container.appendChild(itemElement);
            });

            // 다음 데이터를 가져오기 위해 start 값 업데이트
            start += items.length; // 가져온 데이터의 개수만큼 start를 증가
            end = start + itemsPerLoad;
            loading = false; // 데이터 로딩이 완료되었음을 표시
        });
}

// 무한스크롤 이벤트 감지
window.addEventListener('scroll', () => {
    if (!loading && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        console.log(`화면 끝 스크롤 데이터 요청중 ${start}..${end}`);
        // 스크롤이 바닥에 도달하면 데이터 요청
        fetchData();
    }
});
