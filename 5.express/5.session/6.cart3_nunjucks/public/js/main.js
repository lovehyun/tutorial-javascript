/* public/js/main.js */
function logout() {
    fetch('/api/logout', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            if (data.redirectUrl) {
                // 리다이렉트 URL이 존재하는 경우 페이지를 이동
                window.location.href = data.redirectUrl;
            } else {
                // 리다이렉트 URL이 없는 경우 페이지를 새로고침
                window.location.reload();
            }
        });
}
