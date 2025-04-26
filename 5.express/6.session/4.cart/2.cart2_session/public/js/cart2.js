document.addEventListener('DOMContentLoaded', function () {
    
    getCartFromAPI();
    // getCartFromSessionStorage();
    // getCartFromLocalStorage();

    function getCartFromAPI() {
        // 1. 서버에서 가져온다.
        fetch('/cart')
            .then((response) => response.json())
            .then((cartData) => displayCart(cartData));
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
                    <button onclick="increaseQuantity(${item.id})">+</button>
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                </td>
                <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
                `;
            cartTableBody.appendChild(row);
            totalAmount += item.price * item.quantity;
        });

        // totalAmountSpan.textContent = totalAmount.toFixed(2);
        totalAmountSpan.textContent = totalAmount;
    }

    window.increaseQuantity = function (productId) {
        updateQuantity(productId, 1);
    };

    window.decreaseQuantity = function (productId) {
        updateQuantity(productId, -1);
    };

    function updateQuantity(productId, change) {
        fetch(`/update-quantity/${productId}?change=${change}`, { method: 'POST' })
            .then((response) => response.json())
            .then((cartData) => {
                // 세션 스토리지에 저장
                sessionStorage.setItem('cart', JSON.stringify(cartData));
                // 로컬 스토리지에 저장
                // localStorage.setItem('cart', JSON.stringify(cartData));

                displayCart(cartData);
            });
    }

    window.removeFromCart = function (productId) {
        fetch(`/remove-from-cart/${productId}`, { method: 'POST' })
            .then((response) => response.json())
            .then((cartData) => {
                // 세션 스토리지에 저장
                sessionStorage.setItem('cart', JSON.stringify(cartData));
                // 로컬 스토리지에 저장
                // localStorage.setItem('cart', JSON.stringify(cartData));
                
                displayCart(cartData);
            });
    };

});
