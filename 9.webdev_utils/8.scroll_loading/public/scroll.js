let start = 0;
const itemsPerLoad = 20;
const container = document.getElementById('scroll-container');

// 초기 데이터 로딩
fetch(`/get-items?start=${start}&end=${start + itemsPerLoad}`)
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
        console.log('화면 끝 스크롤 요청중...');
        // 스크롤이 바닥에 도달하면 데이터 요청
        fetch(`/get-items?start=${start}&end=${start + itemsPerLoad}`)
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
