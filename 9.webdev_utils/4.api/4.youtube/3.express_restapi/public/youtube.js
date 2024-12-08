document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    if (!query) return alert('Please enter a search term.');

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const playerContainer = document.getElementById('player');
    playerContainer.innerHTML = '';

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const videos = await response.json();

        videos.forEach(video => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <div>
                    <h3>${video.snippet.title}</h3>
                    <p>${video.snippet.description}</p>
                </div>
            `;

            listItem.addEventListener('click', () => {
                playerContainer.innerHTML = `
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/${video.id.videoId}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                `;
            });

            resultsContainer.appendChild(listItem);
        });
    } catch (err) {
        console.error('Error fetching videos:', err);
        alert('Failed to fetch videos.');
    }
});
