// 검색 폼 제출 이벤트 처리
document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼의 기본 제출 동작을 방지

    const searchQuery = document.getElementById('searchQuery').value; // 검색어 가져오기
    const searchScope = document.getElementById('searchScope').value; // 검색 범위 가져오기

    try {
        // 서버의 API 엔드포인트에 GET 요청을 보냄
        const response = await fetch(`/api/search?searchQuery=${encodeURIComponent(searchQuery)}&searchScope=${encodeURIComponent(searchScope)}`);
        const data = await response.json();

        // 에러가 있는지 확인
        if (data.error) {
            alert(data.error);
            return;
        }

        // 검색 결과를 표시
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = ''; // 이전 결과 지우기

        if (data.results && data.results.length > 0) {
            // 각 검색 결과 항목을 리스트에 추가
            data.results.forEach(result => {
                const li = document.createElement('li');

                // 검색 범위에 따라 적절한 필드를 표시
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
            // 결과가 없는 경우 메시지 표시
            const li = document.createElement('li');
            li.textContent = '검색 결과가 없습니다.';
            resultsList.appendChild(li);
        }
    } catch (error) {
        // 오류 발생 시 콘솔에 출력하고 사용자에게 알림
        console.error("Error fetching search results:", error);
        alert("검색 중 오류가 발생했습니다.");
    }
});
