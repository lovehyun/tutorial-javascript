document.addEventListener('DOMContentLoaded', function () {
    // 서버에서 상품 목록을 가져와 테이블에 출력
    fetch('/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products))
        // 퀴즈1. 최초 로딩 시 cart 내용 불러오는것 추가
        // .then(() => {
        //     // 서버에서 최초 로딩 시 장바구니 정보를 가져와 테이블에 출력
        //     return fetch('/cart');
        // })
        // .then((response) => response.json())
        // .then((cart) => displayCart(cart));
        
    // 테이블에 상품 목록을 출력하는 함수
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

    // 선택한 상품을 장바구니에 추가하는 함수
    window.addToCart = function (productId) {
        fetch(`/add-to-cart/${productId}`, { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                // alert(JSON.stringifys(data.cart));
                // 서버에서 업데이트된 장바구니 정보를 가져와 테이블에 출력
                fetch('/cart')
                    .then((response) => response.json())
                    .then((cart) => displayCart(cart));
            });
    };

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
                `;
            cartTableBody.appendChild(row);
        });
    }
});
