const express = require('express');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// 정적 파일 제공
app.use('/static', express.static('public'));

// 사용자 데이터
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// 상품 데이터
const products = [
    { id: 1, name: 'Product 1', price: 2000 },
    { id: 2, name: 'Product 2', price: 3000 },
    { id: 3, name: 'Product 3', price: 1500 },
];

// --->
// 메인 라우트
app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('home.html', { user });
});

app.get('/cart', (req, res) => {
    res.render('cart.html', { user: req.session.user });
});

app.get('/products', (req, res) => {
    res.render('products.html', { user: req.session.user });
});
// 메인 라우트
// <---

// --->
// REST-APIs
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.status(401).json({ message: '로그인 실패' });
    }
});

app.get('/api/logout', (req, res) => {
    // 세션에서 사용자 정보를 삭제
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 오류:', err);
            res.status(500).json({ message: '로그아웃 실패' });
        } else {
            // 로그아웃 성공 시 리다이렉트 URL을 클라이언트에게 제공
            res.json({ message: '로그아웃 성공', redirectUrl: '/' });
        }
    });
});

app.get('/api/check-login', (req, res) => {
    const loggedIn = req.session.user ? true : false;
    res.json({ loggedIn });
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

app.post('/api/cart/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const product = products.find((p) => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    const cart = req.session.cart || [];
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        });
    }

    req.session.cart = cart;
    res.json({ message: '상품이 장바구니에 추가되었습니다.', cart, totalAmount: calculateTotalAmount(cart) });
});

app.put('/api/cart/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const change = Number(req.query.change);

    if (isNaN(productId) || isNaN(change)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    const cart = req.session.cart || [];
    const item = cart.find((i) => i.id === productId);

    if (!item) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    item.quantity = Math.max(1, item.quantity + change);

    req.session.cart = cart;
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

app.delete('/api/cart/:productId', (req, res) => {
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    let cart = req.session.cart || [];
    const itemIndex = cart.findIndex((i) => i.id === productId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    cart = cart.filter((_, index) => index !== itemIndex);
    req.session.cart = cart;

    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
// REST-APIs
// <---

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
