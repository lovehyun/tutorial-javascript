import { fetchUserInfo } from './checkuser.js';

document.addEventListener('DOMContentLoaded', function () {
    fetchUserInfo();
    loadCartData();
    setupEventHandlers();
});

// 장바구니 데이터를 로드하는 함수
function loadCartData() {
    getCartFromAPI();
    // getCartFromSessionStorage();
    // getCartFromLocalStorage(); // 필요시 사용
}

// 버튼 이벤트 핸들러들을 설정하는 함수
function setupEventHandlers() {
    window.increaseQuantity = increaseQuantity;
    window.decreaseQuantity = decreaseQuantity;
    window.payButton = handlePayment;
    window.removeFromCart = removeFromCart;
}

// 결제 요청 함수
function handlePayment() {
    const paymentInfo = {
        amount: parseInt(document.getElementById('totalAmount').textContent), // 총 결제 금액
        orderId: `order-${Date.now()}`, // 고유 주문 ID
        orderName: 'Sample Order', // 주문 이름
        successUrl: 'http://localhost:3000/api/payment/success', // 결제 성공 URL
        failUrl: 'http://localhost:3000/api/payment/fail', // 결제 실패 URL
    };

    // 새 팝업 창을 열기
    const paymentWindow = window.open('', '결제창', 'width=500,height=600');

    // 결제 성공/실패를 랜덤으로 처리 (50% 확률)
    const isPaymentSuccessful = Math.random() > 0.5;

    if (isPaymentSuccessful) {
        // 결제 성공 시
        paymentWindow.document.write('<h1>결제가 성공적으로 완료되었습니다.</h1>');
        paymentWindow.document.write('<p>결제 처리가 성공하였습니다. 감사합니다!</p>');
    } else {
        // 결제 실패 시
        paymentWindow.document.write('<h1>결제 실패</h1>');
        paymentWindow.document.write('<p>결제 처리 중 문제가 발생했습니다. 다시 시도해 주세요.</p>');
    }

    // 결제 후 서버로 결제 상태를 전송 (임의로 승인 처리)
    fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            paymentKey: `paymentKey-${paymentInfo.orderId}`,
            orderId: paymentInfo.orderId,
            amount: paymentInfo.amount,
            isSuccess: isPaymentSuccessful
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('결제 승인 처리 완료');
            } else {
                console.log('결제 승인 처리 실패');
            }
        })
        .catch(error => {
            console.error('결제 승인 요청 중 오류 발생:', error);
        });
}

// 장바구니에서 아이템 삭제 함수
function removeFromCart(productId) {
    fetch(`/api/cart/${productId}`, { method: 'DELETE' })
        .then(async (response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 204) {
                return {};
            } else {
                throw new Error('Failed to delete item from cart');
            }
        })
        .then((data) => {
            sessionStorage.setItem('cart', JSON.stringify(data));
            displayCart(data);
        })
        .catch((error) => {
            console.error('상품 삭제 실패:', error);
        });
}

// 서버에서 장바구니 데이터 가져오기
function getCartFromAPI() {
    fetch('/api/cart')
        .then(async (response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                const data = await response.json();
                alert(data.message);
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

// 세션 저장소에서 장바구니 데이터 가져오기
function getCartFromSessionStorage() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    displayCart(cart);
    return cart;
}

// 로컬 저장소에서 장바구니 데이터 가져오기
function getCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart(cart);
    return cart;
}

// 장바구니 UI에 표시
function displayCart(cartData) {
    const cart = cartData.cart || [];
    const cartTableBody = document.querySelector('#cartTable tbody');
    const totalAmountSpan = document.querySelector('#totalAmount');
    const emptyCartMessageRow = document.querySelector('#emptyCartMessageRow');

    cartTableBody.innerHTML = '';
    emptyCartMessageRow.style.display = 'none';

    if (cart.length === 0) {
        emptyCartMessageRow.style.display = 'table-row';
    }
    
    let totalAmount = 0;
    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td><img src="${item.image}" class="cart-icon"></td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>
                <span class="quantity" id="quantity-${item.id}">${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
                <button onclick="decreaseQuantity(${item.id})">-</button>
            </td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
        totalAmount += item.price * item.quantity;
    });

    totalAmountSpan.textContent = totalAmount;
}

// 수량 업데이트
function increaseQuantity(productId) {
    updateQuantity(productId, 1);
}

function decreaseQuantity(productId) {
    updateQuantity(productId, -1);
}

// 서버에 수량 변경 요청
function updateQuantity(productId, change) {
    fetch(`/api/cart/${productId}?change=${change}`, { method: 'PUT' })
        .then((response) => response.json())
        .then((data) => {
            sessionStorage.setItem('cart', JSON.stringify(data));
            displayCart(data);
        });
}
