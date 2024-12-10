document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.error || 'Login failed');
            });
        }
        return response.json();
    })
    .then((data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            window.location.href = '/'; // Redirect to index page
        } else {
            throw new Error('Login failed');
        }
    })
    .catch((error) => {
        errorContainer.innerText = error.message;
    });
});
