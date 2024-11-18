const itemsPerLoad = 20;

let start = 0;
let end = start + itemsPerLoad;

const container = document.getElementById('scroll-container');

// 초기 데이터 로딩
console.log(`초기 데이터 로딩 ${start}..${end}`)
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
        start += itemsPerLoad;
    });

// 무한스크롤 이벤트 감지
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const end = start + itemsPerLoad;
        console.log(`화면 끝 스크롤 데이터 요청중 ${start}..${end}`);
        // 스크롤이 바닥에 도달하면 데이터 요청
        fetch(`/get-items?start=${start}&end=${end}`)
            .then((response) => response.json())
            .then((items) => {
                // 받아온 데이터를 화면에 추가
                items.forEach((item) => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('item');
                    itemElement.textContent = item;
                    container.appendChild(itemElement);
                });

                // 다음 데이터를 가져오기 위해 start 값 업데이트
                start += itemsPerLoad;
            });
    }
});
