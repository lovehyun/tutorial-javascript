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

// 세션 정보 출력 미들웨어
// app.use((req, res, next) => {
//     console.log('Session Information:', req.session);
//     next();
// });

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 간단한 메모리 기반 상품과 장바구니 데이터
const products = [
    { id: 1, name: 'Product 1', price: 20 },
    { id: 2, name: 'Product 2', price: 30 },
    { id: 3, name: 'Product 3', price: 15 },
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

    // 장바구니에 상품 추가
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
    });

    // 업데이트된 장바구니 데이터를 세션에 저장
    req.session.cart = cart;

    res.json({ message: '상품이 장바구니에 추가되었습니다.', cart });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
