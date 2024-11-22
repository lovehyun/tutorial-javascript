document.addEventListener('DOMContentLoaded', function() {
    const accountInfo = document.getElementById('accountInfo');

    function updateLoginStatus() {
        const token = localStorage.getItem('token');
        const loginLink = document.getElementById('loginLink');
        if (token && loginLink) {
            loginLink.innerText = 'Logout';
            loginLink.removeEventListener('click', handleLogout); // Remove previous event listener if exists
            loginLink.addEventListener('click', handleLogout);
        
            fetch('/auth/me', {
                method: 'GET',
                headers: {
                    'x-auth': token,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                return response.json();
            })
            .then(data => {
                if (accountInfo) {
                    accountInfo.innerText = `Logged in as: ${data.email}`;
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function handleLogout(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        window.location.href = '/'; // Redirect to home page
    }

    function handleUnauthorizedError() {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.innerText = 'Unauthorized access. Please log in.';
        } else {
            alert('Unauthorized access. Please log in.');
        }
    }

    function handleError(response) {
        if (response.status === 401) {
            handleUnauthorizedError();
        } else {
            return response.json().then(data => {
                throw new Error(data.error || 'Unknown error');
            });
        }
    }

    // Check login status on page load
    updateLoginStatus();

    // Expose error handling function for other scripts
    window.handleError = handleError;
});
