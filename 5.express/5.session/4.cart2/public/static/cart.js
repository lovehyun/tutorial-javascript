document.addEventListener('DOMContentLoaded', function () {
    fetch('/cart')
        .then((response) => response.json())
        .then((cartData) => displayCart(cartData));

    // 테이블에 장바구니 정보를 출력하는 함수
    function displayCart(cart) {
        const cartTableBody = document.querySelector('#cartTable tbody');
        // 기존 테이블 내용을 비우고 새로운 내용으로 업데이트
        cartTableBody.innerHTML = '';

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
        });
    }

    // 상품 수량을 증가시키는 함수
    window.increaseQuantity = function (productId) {
        updateQuantity(productId, 1);
    };

    // 상품 수량을 감소시키는 함수
    window.decreaseQuantity = function (productId) {
        updateQuantity(productId, -1);
    };

    // 상품 수량을 업데이트하는 함수
    function updateQuantity(productId, change) {
        fetch(`/update-quantity/${productId}?change=${change}`, { method: 'POST' })
            .then((response) => response.json())
            .then((cart) => {
                displayCart(cart);
            });
    }

    // 상품을 장바구니에서 제거하는 함수
    window.removeFromCart = function (productId) {
        fetch(`/remove-from-cart/${productId}`, { method: 'POST' })
            .then((response) => response.json())
            .then((cart) => {
                displayCart(cart);
            });
    };

    // 참고: 버튼 속성(attribute)을 통한 아이템 추가/삭제 
    // <td>
    //     <span class="quantity" id="quantity-${item.id}">${item.quantity}</span>
    //     <button class="increase" data-product-id="${item.id}">+</button>
    //     <button class="decrease" data-product-id="${item.id}">-</button>
    // </td>
    // <td><button class="remove" data-product-id="${item.id}">Remove</button></td>
    
    // 각 버튼에 이벤트 리스너를 등록
    // document.querySelectorAll('.increase').forEach(btn => {
    //     btn.addEventListener('click', function () {
    //         updateQuantity(parseInt(this.getAttribute('data-product-id')), 1);
    //     });
    // });
    
    // document.querySelectorAll('.decrease').forEach(btn => {
    //     btn.addEventListener('click', function () {
    //         updateQuantity(parseInt(this.getAttribute('data-product-id')), -1);
    //     });
    // });
    
    // document.querySelectorAll('.remove').forEach(btn => {
    //     btn.addEventListener('click', function () {
    //         removeFromCart(parseInt(this.getAttribute('data-product-id')));
    //     });
    // });
});
