// 검색 폼 제출 이벤트 처리
document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼 기본 제출 동작 방지

    const searchQuery = document.getElementById('searchQuery').value;
    const searchScope = document.getElementById('searchScope').value;
    performSearch(searchQuery, searchScope, 1); // 페이지 1에서 검색 시작
});

async function performSearch(searchQuery, searchScope, page) {
    try {
        // 검색 API에 GET 요청 전송
        const response = await fetch(`/api/search?searchQuery=${encodeURIComponent(searchQuery)}&searchScope=${encodeURIComponent(searchScope)}&page=${page}`);
        const data = await response.json();

        // 응답에 에러가 있는지 확인
        if (data.error) {
            alert(data.error);
            return;
        }

        displayResults(data.results, data.searchScope);
        displayPagination(data.searchQuery, data.searchScope, data.currentPage, data.totalPages);
    } catch (error) {
        console.error("Error fetching search results:", error);
        alert("검색 중 오류가 발생했습니다.");
    }
}

// 검색 결과 표시
function displayResults(results, searchScope) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ''; // 이전 결과 지우기

    if (results && results.length > 0) {
        results.forEach(result => {
            const li = document.createElement('li');

            // 검색 범위에 따라 적절한 필드 표시
            if (searchScope === 'artist' || searchScope === 'genre') {
                li.textContent = result.Name;
            } else if (searchScope === 'album') {
                li.textContent = result.Title;
            } else if (searchScope === 'track') {
                li.textContent = result.Name;
            } else if (searchScope === 'composer') {
                li.textContent = result.Composer;
            } else if (searchScope === 'customer') {
                li.textContent = `${result.FirstName} ${result.LastName}`;
            }

            resultsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = '검색 결과가 없습니다.';
        resultsList.appendChild(li);
    }
}

// 페이지네이션 컨트롤 표시
function displayPagination(searchQuery, searchScope, currentPage, totalPages) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; // 이전 페이지네이션 컨트롤 지우기

    // 이전 페이지 버튼
    const prevButton = document.createElement('button');
    prevButton.textContent = '이전';
    prevButton.disabled = currentPage <= 1;
    prevButton.onclick = () => performSearch(searchQuery, searchScope, currentPage - 1);
    paginationControls.appendChild(prevButton);

    // 현재 페이지 및 전체 페이지 수 표시
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `페이지 ${currentPage} / ${totalPages}`;
    paginationControls.appendChild(pageInfo);

    // 다음 페이지 버튼
    const nextButton = document.createElement('button');
    nextButton.textContent = '다음';
    nextButton.disabled = currentPage >= totalPages;
    nextButton.onclick = () => performSearch(searchQuery, searchScope, currentPage + 1);
    paginationControls.appendChild(nextButton);
}
