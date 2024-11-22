document.addEventListener('DOMContentLoaded', async function () {
    const authenticated = await window.checkAuthentication();
    window.updateLoginStatus();
    if (authenticated) fetchApiKeys();
});

function fetchApiKeys() {
    fetch('/apikeys', {
        method: 'GET',
        headers: {
            'x-auth': localStorage.getItem('token'),
        },
    })
    .then(response => {
        if (!response.ok) return handleError(response);
        return response.json();
    })
    .then(data => {
        const apikeysList = document.getElementById('apikeys');
        apikeysList.innerHTML = '';

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(apiKey => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <span><strong>${apiKey.title}</strong>: ${apiKey.key}</span>
                    <div>
                        <button class="btn btn-warning btn-sm auth-required edit-button">Edit</button>
                        <button class="btn btn-danger btn-sm auth-required delete-button">Delete</button>
                    </div>
                `;

                // 버튼 동작 연결
                const editButton = li.querySelector('.edit-button');
                const deleteButton = li.querySelector('.delete-button');

                editButton.addEventListener('click', () => editApiKeyTitle(apiKey.key, apiKey.title));
                deleteButton.addEventListener('click', () => deleteApiKey(apiKey.key));

                apikeysList.appendChild(li);
            });
        } else {
            apikeysList.innerHTML = '<li class="list-group-item">No API keys available. Please generate one.</li>';
        }
        window.updateButtonState(); // 새로 생성된 버튼 상태 업데이트
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

function editApiKeyTitle(apiKey, currentTitle) {
    const newTitle = prompt('Enter a new title:', currentTitle || '');
    if (newTitle === null || newTitle.trim() === currentTitle) {
        alert('No changes made.');
        return;
    }

    fetch('/apikeys/title', {
        method: 'PATCH',
        headers: {
            'x-auth': localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, newTitle: newTitle.trim() }),
    })
    .then(response => {
        if (!response.ok) {
            return window.handleError(response);
        }
        return response.json();
    })
    .then(() => fetchApiKeys()) // 키 목록 새로고침
    .catch(error => console.error('Error updating API key title:', error));
}

function deleteApiKey(apiKey) {
    fetch('/apikeys', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': localStorage.getItem('token'),
        },
        body: JSON.stringify({ apiKey }),
    })
    .then(response => {
        if (!response.ok) {
            return window.handleError(response);
        }
        return response.json();
    })
    .then(() => fetchApiKeys()) // 키 목록 새로고침
    .catch(error => console.error('Error deleting API key:', error));
}

document.getElementById('generateApiKey').addEventListener('click', function () {
    const title = document.getElementById('apiKeyTitle').value.trim();
    if (!title) {
        alert('Please enter a title for the API key.');
        return;
    }

    fetch('/apikeys', {
        method: 'POST',
        headers: {
            'x-auth': localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    })
    .then(response => {
        if (!response.ok) return handleError(response);
        return response.json();
    })
    .then(fetchApiKeys)
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});
