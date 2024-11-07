document.addEventListener('DOMContentLoaded', function () {
    fetch('/products')
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

    window.addToCart = function (productId) {
        fetch(`/add-to-cart/${productId}`, { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                fetch('/cart')
                    .then((response) => response.json())
                    .then((cart) => {
                        // 세션 스토리지에 저장
                        sessionStorage.setItem('cart', JSON.stringify(cart));
                        // 로컬 스토리지에 저장
                        // localStorage.setItem('cart', JSON.stringify(cart));

                        // 페이지 이동
                        window.location.href = '/cart2.html';
                    });
            });
    };
});
