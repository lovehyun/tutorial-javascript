import { fetchUserInfo } from './checkuser.js';

document.addEventListener('DOMContentLoaded', function () {
    fetchUserInfo();

    fetch('/api/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products));

    function displayProducts(products) {
        const productTableBody = document.querySelector('#productTable tbody');

        products.forEach((product) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><button onclick="addToCart(${product.id})">담기</button></td>
            `;
            productTableBody.appendChild(row);
        });
    }
});

window.addToCart = function (productId) {
    fetch(`/api/cart/${productId}`, { method: 'POST' })
        .then(async (response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                // 401 상태 코드일 경우 로그인이 필요하다는 메시지를 화면에 표시
                const data = await response.json();
                alert(data.message);

                // 만약 리다이렉트 URL이 제공되면 해당 URL로 이동
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
                
                throw new Error('Unauthorized');
            } else {
                throw new Error('Failed to fetch cart data');
            }
        })
        .then((data) => {
            alert(data.message);
            fetch('/api/cart')
                .then((response) => response.json())
                .then((data) => {
                    // 세션 스토리지에 저장
                    sessionStorage.setItem('cart', JSON.stringify(data));
                    // 로컬 스토리지에 저장
                    // localStorage.setItem('cart', JSON.stringify(data));

                    // 페이지 이동
                    window.location.href = '/cart';
                });
        })
        .catch(error => {
            // 여기에서 로그인 실패 또는 다른 오류 처리
            console.error('주문 오류:', error);
            alert('상품 담기 실패');
        });
}
