document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent form submission

    const searchQuery = document.getElementById('searchQuery').value;

    // Use fetch to call the server's API endpoint
    const response = await fetch(`/api/search?searchQuery=${encodeURIComponent(searchQuery)}`);
    // GET 에 BODY 를 추가하는것은 비표준 방식. 추천하지 않음. 이렇게 할거면 POST로...
    // const response = await fetch('/api/search', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ searchQuery }),
    // });

    const data = await response.json();

    // Clear previous results
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    // Display new results
    if (data.results && data.results.length > 0) {
        data.results.forEach(artist => {
            const li = document.createElement('li');
            li.textContent = artist.Name;
            resultsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No results found';
        resultsList.appendChild(li);
    }
});
