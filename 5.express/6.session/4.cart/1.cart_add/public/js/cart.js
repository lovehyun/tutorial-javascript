document.addEventListener('DOMContentLoaded', function () {
    // 서버에서 상품 목록을 가져와 테이블에 출력
    fetch('/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products))
        // 퀴즈1. 최초 로딩 시 cart 내용 불러오는것 추가
        .then(() => {
            // 서버에서 최초 로딩 시 장바구니 정보를 가져와 테이블에 출력
            return fetch('/cart');
        })
        .then((response) => response.json())
        .then((cart) => displayCart(cart));
        
    // 테이블에 상품 목록을 출력하는 함수
    function displayProducts(products) {
        const productTableBody = document.querySelector('#productTable tbody');

        products.forEach((product) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><button class="add-to-cart" data-product-id="${product.id}">담기</button></td>
                `;
                // HTML5의 데이터 속성은 반드시 data-로 시작해야 합니다. 
                // data-로 시작하지 않으면 HTML 표준에 맞지 않으며, 브라우저가 이를 HTML 데이터 속성으로 인식하지 않습니다.
            productTableBody.appendChild(row);
        });

        // 상품 목록 테이블에서 클릭 이벤트 리스너 추가
        productTableBody.addEventListener('click', function (event) {
            if (event.target.classList.contains('add-to-cart')) {
                // 이렇게 data-로 시작하는 속성만이 브라우저의 표준 HTML API (dataset)에서 접근할 수 있으며, 
                // JavaScript로 접근할 때는 element.dataset.productId처럼 사용할 수 있습니다. 
                const productId = event.target.dataset.productId;

                // 또는 아래와 같이 getAttribute 를 통해서 직접 가져올수도 있음.
                // const productId = event.target.getAttribute('data-product-id');
                
                addToCart(productId);
            }
        });
    }

    function addToCart(productId) {
        fetch(`/add-to-cart/${productId}`, { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                // 서버에서 업데이트된 장바구니 정보를 가져와 테이블에 출력
                fetch('/cart')
                    .then((response) => response.json())
                    .then((cart) => displayCart(cart));
            });
    }

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
