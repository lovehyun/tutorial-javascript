document.addEventListener('DOMContentLoaded', function () {
    // 서버에서 상품 목록을 가져와 테이블에 출력
    fetch('/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products));

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

    // 상품을 장바구니에 추가하는 함수
    window.addToCart = function (productId) {
        fetch(`/add-to-cart/${productId}`, { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                // 서버에서 업데이트된 장바구니 정보를 가져와 장바구니 페이지로 이동
                fetch('/cart')
                    .then((response) => response.json())
                    .then((cart) => {
                        window.location.href = '/cart.html';
                    });
            });
    };
});
