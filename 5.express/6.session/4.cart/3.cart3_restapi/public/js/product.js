import { fetchUserInfo_asyncawait } from './checkuser.js';

document.addEventListener('DOMContentLoaded', function () {
    fetchUserInfo_asyncawait();

    fetch('/api/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products));
});

function displayProducts(products) {
    const productTableBody = document.querySelector('#productTable tbody');

    products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><button class="add-to-cart-btn" data-product-id="${product.id}">담기</button></td>
        `;

        productTableBody.appendChild(row);

        // 버튼이 생성될 때마다 바로 이벤트 리스너를 추가, once 옵션 사용
        row.querySelector('.add-to-cart-btn').addEventListener('click', function () {
            // const productId = this.dataset.productId; // dataset을 통해 data-product-id 값을 가져옴
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

function addToCart(productId) {
    fetch(`/api/cart/${productId}`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                return response.json().then((data) => {
                    alert(data.message);
                    if (data.redirectUrl) {
                        window.location.href = data.redirectUrl;
                    }
                    throw new Error('Unauthorized');
                });
            } else {
                throw new Error('Failed to fetch cart data');
            }
        })
        .then((data) => {
            alert(data.message);
            return fetch('/api/cart')
        })
        .then((response) => response.json())
        .then((data) => {
            // 브라우저 세션 저장소에 장바구니 저장
            // sessionStorage.setItem('cart', JSON.stringify(data));
            window.location.href = '/cart';
        })
        .catch(error => {
            console.error('주문 오류:', error);
            alert('상품 담기 실패');
        });
}
