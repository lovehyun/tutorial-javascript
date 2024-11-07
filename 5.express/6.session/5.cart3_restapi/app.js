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

// 정적 파일 제공
app.use(express.static('public'));

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
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
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
        res.json({ message: '로그인 성공' });
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

app.use('/api/check-login', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({ username: user.username });
    } else {
        res.status(401).json({ message: '인증되지 않은 사용자' });
    }
});


app.get('/api/products', (req, res) => {
    res.json(products);
});

// 미들웨어: 로그인 여부 확인
function checkLogin(req, res, next) {
    const user = req.session.user;

    if (user) {
        // 로그인된 경우 다음 미들웨어로 이동
        next();
    } else {
        // 로그인되지 않은 경우
        res.status(401).json({ message: '로그인이 필요합니다.', redirectUrl: '/' });
    }
}

// '/cart' 라우트에 미들웨어 적용
app.get('/api/cart', checkLogin, (req, res) => {
    const cart = req.session.cart || [];
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

app.post('/api/cart/:productId', checkLogin, (req, res) => {
    const productId = parseInt(req.params.productId);
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

app.put('/api/cart/:productId', checkLogin, (req, res) => {
    const productId = parseInt(req.params.productId);
    const change = parseInt(req.query.change);

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
    res.json({ message: '수량이 변경되었습니다.', cart, totalAmount: calculateTotalAmount(cart) });
});

app.delete('/api/cart/:productId', checkLogin, (req, res) => {
    const productId = parseInt(req.params.productId);

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

    // res.status(204).send(); // No content
    // 잔여 cart 내용을 회신하여 프런트에서 세션 스토리지에 저장
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
