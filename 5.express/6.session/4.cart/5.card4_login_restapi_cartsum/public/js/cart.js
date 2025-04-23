import { fetchUserInfo_asyncawait } from './checkuser.js';

document.addEventListener('DOMContentLoaded', function () {
    fetchUserInfo_asyncawait();
    
    getCartFromAPI();
    // getCartFromSessionStorage();
    // getCartFromLocalStorage();
});

function getCartFromAPI() {
    // 1. 서버에서 가져온다.
    fetch('/api/cart')
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
        .then((cartData) => displayCart(cartData))
        .catch((error) => {
            console.error(error);
        });
}

function getCartFromSessionStorage() {
    // 2. 로컬 세션저장소에서 가져온다.
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    displayCart(cart);
}

function getCartFromLocalStorage() {
    // 3. 로컬 저장소에서 가져온다.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart(cart);
}

function displayCart(cartData) {
    const cart = cartData.cart || [];
    const cartTableBody = document.querySelector('#cartTable tbody');
    const totalAmountSpan = document.querySelector('#totalAmount');
    const emptyCartMessageRow = document.querySelector('#emptyCartMessageRow');

    // 초기화
    cartTableBody.innerHTML = '';
    emptyCartMessageRow.style.display = 'none';

    if (cart.length === 0) {
        emptyCartMessageRow.style.display = 'table-row'; // 테이블 행 표시
    }
    
    let totalAmount = 0;

    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>
                <span class="quantity" id="quantity-${item.id}">${item.quantity}</span>
                <button class="increase-btn" data-product-id="${item.id}">+</button>
                <button class="decrease-btn" data-product-id="${item.id}">-</button>
            </td>
            <td><button class="remove-btn" data-product-id="${item.id}">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
        totalAmount += item.price * item.quantity;

        // 각 버튼에 이벤트 리스너를 once 옵션을 사용하여 한 번만 추가
        row.querySelector('.increase-btn').addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            updateQuantity(productId, 1);
        });

        row.querySelector('.decrease-btn').addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            updateQuantity(productId, -1);
        });

        row.querySelector('.remove-btn').addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });

    // totalAmountSpan.textContent = totalAmount.toFixed(2);
    totalAmountSpan.textContent = totalAmount;
}

function updateQuantity(productId, change) {
    fetch(`/api/cart/${productId}?change=${change}`, { method: 'PUT' })
        .then((response) => response.json())
        .then((data) => {
            // 세션 스토리지에 저장
            // sessionStorage.setItem('cart', JSON.stringify(data));
            // 로컬 스토리지에 저장
            // localStorage.setItem('cart', JSON.stringify(data));

            displayCart(data);
        });
}

function removeFromCart(productId) {
    fetch(`/api/cart/${productId}`, { method: 'DELETE' })
        .then(async (response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 204) {
                return {}; // 빈 객체 반환
            } else {
                throw new Error('Failed to delete item from cart');
            }
        })
        .then((data) => {
            // 세션 스토리지에 저장
            // sessionStorage.setItem('cart', JSON.stringify(data));
            // 로컬 스토리지에 저장
            // localStorage.setItem('cart', JSON.stringify(data));
            
            displayCart(data);
        });
};
