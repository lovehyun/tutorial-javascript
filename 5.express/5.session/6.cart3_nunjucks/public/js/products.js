/* public/js/products.js */
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products));

    function displayProducts(products) {
        const productTableBody = document.querySelector('#productTable tbody');

        productTableBody.innerHTML = '';
        
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

    window.addToCart = function (productId) {
        // 체크: 사용자가 로그인되어 있는지 확인
        fetch('/api/check-login')
            .then((response) => response.json())
            .then((data) => {
                if (data.loggedIn) {
                    // 로그인된 경우: 상품을 장바구니에 추가
                    fetch(`/api/cart/${productId}`, { method: 'POST' })
                        .then((response) => response.json())
                        .then((data) => {
                            alert(data.message);
                            fetch('/api/cart')
                                .then((response) => response.json())
                                .then((cart) => {
                                    sessionStorage.setItem('cart', JSON.stringify(cart));
                                    window.location.href = '/cart';
                                });
                        });
                } else {
                    // 로그인되지 않은 경우: 팝업 표시
                    alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
                    // 또는 원하는 방식으로 모달이나 다른 UI로 표시할 수 있음
                }
            });
    };
});
