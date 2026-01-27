document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // 기본 동작 방지
    const query = document.getElementById('query').value.trim();
    if (!query) return;

    // 기존 결과 삭제
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = '<li>Loading...</li>';

    try {
        // 서버에 요청 보내기
        const response = await fetch(`/search/blog?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        // 결과 렌더링
        resultsElement.innerHTML = '';
        if (data.items && data.items.length > 0) {
            data.items.forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>${item.description}</p>
                    <small>Post Date: ${item.postdate}</small>
                `;
                resultsElement.appendChild(li);
            });
        } else {
            resultsElement.innerHTML = '<li>No results found.</li>';
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        resultsElement.innerHTML = '<li>Error fetching results. Please try again later.</li>';
    }
});
