function fetchPage(pageNumber) {
    // 가상 API 호출 함수로, 실제 API 호출로 대체 가능
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Fetched data from page ${pageNumber}`);
            const hasMoreData = pageNumber < 10; // 예를 들어 페이지가 10까지 있다고 가정
            resolve(hasMoreData);
        }, 500); // 500ms 지연
    });
}

async function fetchAllPages(pageNumber = 1) {
    const hasMoreData = await fetchPage(pageNumber);
    if (hasMoreData) {
        return fetchAllPages(pageNumber + 1); // 다음 페이지를 재귀 호출
    }
    console.log("All pages fetched.");
}

fetchAllPages();
