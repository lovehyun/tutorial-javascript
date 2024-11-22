document.addEventListener('DOMContentLoaded', function () {
    const snippetElement = document.getElementById('snippet');
    const copyButton = document.getElementById('copySnippet');

    // 복사 버튼 클릭 시 클립보드에 복사
    copyButton.addEventListener('click', function () {
        const textToCopy = snippetElement.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Snippet copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    fetchSnippet();
});

function fetchSnippet() {
    fetch('/snippet', {
        method: 'GET',
        headers: {
            'x-auth': localStorage.getItem('token'),
        },
    })
    .then(response => {
        if (!response.ok) {
            return window.handleError(response);
        }
        return response.json();
    })
    .then((data) => {
        document.getElementById('snippet').innerText = data.snippet;
    })
    .catch((error) => console.error('Error:', error));
}
