/* public/js/cart.js */
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/cart')
        .then((response) => response.json())
        .then((cartData) => displayCart(cartData));

    function displayCart(cartData) {
        const cart = cartData.cart || [];
        const cartTableBody = document.querySelector('#cartTable tbody');
        const totalAmountSpan = document.querySelector('#totalAmount');

        // 초기화
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

    window.increaseQuantity = function (productId) {
        updateQuantity(productId, 1);
    };

    window.decreaseQuantity = function (productId) {
        updateQuantity(productId, -1);
    };

    function updateQuantity(productId, change) {
        fetch(`/api/cart/${productId}?change=${change}`, { method: 'PUT' })
            .then((response) => response.json())
            .then((cartData) => {
                sessionStorage.setItem('cart', JSON.stringify(cartData.cart));
                displayCart(cartData);
            });
    }

    window.removeFromCart = function (productId) {
        fetch(`/api/cart/${productId}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((cartData) => {
                sessionStorage.setItem('cart', JSON.stringify(cartData.cart));
                displayCart(cartData);
            });
    };
});
