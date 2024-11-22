document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('/auth/register', {
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
            return window.handleError(response);
        }
        return response.json();
    })
    .then((data) => {
        if (data) {
            email.value = '';
            password.value = '';
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error);
    });
});
