document.addEventListener('DOMContentLoaded', function () {
    // 페이지 로드 시 상품 목록과 장바구니를 불러오기
    loadProducts();
    loadCart();
});

function loadProducts() {
    // 서버에서 상품 목록을 가져와 화면에 출력
    fetch('/products')
        .then((response) => response.json())
        .then((products) => displayProducts(products))
        .catch((error) => console.error("상품 목록을 불러오는데 실패했습니다:", error));
}

function loadCart() {
    // 서버에서 장바구니 정보를 가져와 화면에 출력
    fetch('/cart')
        .then((response) => response.json())
        .then((cart) => displayCart(cart))
        .catch((error) => console.error("장바구니 정보를 불러오는데 실패했습니다:", error));
}

function displayProducts(products) {
    const productTableBody = document.querySelector('#productTable tbody');
    productTableBody.innerHTML = ''; // 기존 내용 비우기

    products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><button class="add-to-cart" data-product-id="${product.id}">담기</button></td>
        `;
        productTableBody.appendChild(row);
    });

    // "담기" 버튼에 클릭 이벤트 리스너 추가
    // 아래 코드는 **이벤트 위임(event delegation)**이라는 방식으로 모든 버튼에 이벤트가 적용됩니다.
    productTableBody.addEventListener('click', handleAddToCartClick);
    // productTableBody 요소에만 click 이벤트 리스너를 한 번만 설정해도, 그 안에 포함된 자식 요소(여기서는 각 상품의 담기 버튼)에 클릭이 발생할 때마다 이벤트가 전파됩니다. 
    // HTML 요소는 기본적으로 **버블링(bubbling)**이라는 특성을 가지기 때문에, 하위 요소에서 발생한 이벤트가 상위 요소로 전파됩니다.
}

function handleAddToCartClick(event) {
    // "담기" 버튼 클릭 시 장바구니에 상품 추가
    if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.getAttribute('data-product-id');
        addToCart(productId);
    }
}

function addToCart(productId) {
    // 선택한 상품을 장바구니에 추가하는 요청을 서버에 전송
    fetch(`/add-to-cart/${productId}`, { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            // 장바구니를 다시 불러와 최신 정보로 갱신
            loadCart();
        })
        .catch((error) => console.error("장바구니에 상품을 추가하는데 실패했습니다:", error));
}

function displayCart(cart) {
    const cartTableBody = document.querySelector('#cartTable tbody');
    cartTableBody.innerHTML = ''; // 기존 장바구니 내용 비우기

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
