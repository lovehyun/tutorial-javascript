function getToken() {
    return localStorage.getItem('token');
}

async function fetchMe() {
    const token = getToken();
    if (!token) return null;

    const res = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok ? await res.json() : null;
}

async function setupNav() {
    const user = await fetchMe();

    if (user) {
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-logout').style.display = 'inline';
        document.getElementById('nav-profile').style.display = 'inline';
        document.getElementById('nav-tweet').style.display = 'inline';
    } else {
        document.getElementById('nav-login').style.display = 'inline';
        document.getElementById('nav-logout').style.display = 'none';
        document.getElementById('nav-profile').style.display = 'none';
        document.getElementById('nav-tweet').style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

function showFlash(message, type='success') {
    const flash = document.getElementById('flash-message');
    flash.innerHTML = `<li class="${type}">${message}</li>`;
    setTimeout(() => {
        flash.innerHTML = '';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', setupNav);
