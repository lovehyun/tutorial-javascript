// 초기 위치 설정
let scrollPosition = 0;
const movieList = document.querySelector('.movie-list');
const movieCardWidth = 170; // 각 영화 카드의 너비와 간격
const maxScroll = movieList.scrollWidth - movieList.clientWidth;

// 왼쪽으로 스크롤
function scrollLeftMovie() {
    scrollPosition -= movieCardWidth * 2;
    if (scrollPosition < 0) {
        scrollPosition = 0;
    }
    movieList.style.transform = `translateX(-${scrollPosition}px)`;
}

// 오른쪽으로 스크롤
function scrollRightMovie() {
    scrollPosition += movieCardWidth * 2;
    if (scrollPosition > maxScroll) {
        scrollPosition = maxScroll;
    }
    movieList.style.transform = `translateX(-${scrollPosition}px)`;
}
