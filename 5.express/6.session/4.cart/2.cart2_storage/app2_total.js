const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// 세션 정보 출력 미들웨어
// app.use((req, res, next) => {
//     console.log('Session Information:', req.session);
//     next();
// });

// 세션 정보 출력 미들웨어
app.use((req, res, next) => {
    // 현재 세션 출력
    // console.log('Session Information:', req.session);

    // 전체 세션 모두 출력
    const sessionStore = req.sessionStore;
    const allSessions = sessionStore.sessions;

    // 모든 세션 정보를 가져오기
    // console.log('Session Info: ', allSessions);
    
    // 모든 세션 정보를 파싱해서 출력하기
    Object.keys(allSessions).forEach(sessionId => {
        const sessionData = JSON.parse(allSessions[sessionId]);
        
        console.log('Session ID: ', sessionId);
        console.log('Session Data: ', sessionData);
        console.log('-----------------------------');
    });

    next();
});

// --> 성능 개선을 위한 측정
// curl -w '\nTime taken: %{time_total}s\n' http://localhost:3000
// Middleware to measure response time
app.use((req, res, next) => {
    const start = Date.now();

    // Attach a listener for when the response is finished
    res.on('finish', () => {
        const end = Date.now();
        const duration = end - start;

        console.log(`Request to ${req.path} took ${duration} ms`);
    });

    // Pass the request to the next middleware
    next();
});
// <-- 성능 개선을 위한 측정

// 정적 파일 제공 (public 폴더)
app.use(express.static('public'));

// 간단한 메모리 기반 상품과 장바구니 데이터
const products = [
    { id: 1, name: 'Product 1', price: 2000 },
    { id: 2, name: 'Product 2', price: 3000 },
    { id: 3, name: 'Product 3', price: 1500 },
];

// 장바구니 라우트
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
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
    res.json({ message: '상품이 장바구니에 추가되었습니다.', cart, totalAmount: calculateTotalAmount(cart) });
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
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
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

    res.json({ cart, totalAmount: calculateTotalAmount2(cart) });
});

// index.html을 반환하는 라우트 추가
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products2.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function calculateTotalAmount(cart) {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price * item.quantity;
    }

    return total;
}

function calculateTotalAmount2(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// 참고: array.reduce(callback(accumulator, currentValue[, currentIndex, array]), initialValue)
//   - accumulator: 누적된 값으로서, 각 요소를 통과하면서 누적되는 값
//   - currentValue: 현재 처리 중인 요소의 값
//   - currentIndex (옵션): 현재 처리 중인 요소의 인덱스
//   - array (옵션): reduce를 호출한 배열 자체
