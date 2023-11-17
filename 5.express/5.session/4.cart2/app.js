const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

// 간단한 메모리 기반 상품과 장바구니 데이터
const products = [
    { id: 1, name: 'Product 1', price: 2000 },
    { id: 2, name: 'Product 2', price: 3000 },
    { id: 3, name: 'Product 3', price: 1500 },
];

// 장바구니 라우트
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.json(cart);
});

// 상품 목록 라우트
app.get('/products', (req, res) => {
    res.json(products);
});

// 상품을 장바구니에 추가하는 라우트
app.post('/add-to-cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const product = products.find((p) => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 세션에서 장바구니 데이터 가져오기
    const cart = req.session.cart || [];

    // 이미 장바구니에 있는지 확인
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1; // 이미 있는 상품이면 수량 증가
    } else {
        // 없는 상품이면 새로 추가
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        });
    }

    // 업데이트된 장바구니 데이터를 세션에 저장
    req.session.cart = cart;

    res.json({ message: '상품이 장바구니에 추가되었습니다.', cart });
});

// 상품 수량을 업데이트하는 라우트
app.post('/update-quantity/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const change = parseInt(req.query.change);

    if (isNaN(productId) || isNaN(change)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 세션에서 장바구니 데이터 가져오기
    const cart = req.session.cart || [];

    // 상품 찾기
    const item = cart.find((i) => i.id === productId);

    if (!item) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 수량 업데이트
    item.quantity = Math.max(1, item.quantity + change);

    // 업데이트된 장바구니 데이터를 세션에 저장
    req.session.cart = cart;

    res.json(cart);
});

// 상품을 장바구니에서 제거하는 라우트
app.post('/remove-from-cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 세션에서 장바구니 데이터 가져오기
    let cart = req.session.cart || [];

    // 상품 찾기
    const itemIndex = cart.findIndex((i) => i.id === productId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 상품 제거
    cart = cart.filter((_, index) => index !== itemIndex);

    // 업데이트된 장바구니 데이터를 세션에 저장
    req.session.cart = cart;

    res.json(cart);
});

// index.html을 반환하는 라우트 추가
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

// cart.html을 반환하는 라우트 추가
app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
