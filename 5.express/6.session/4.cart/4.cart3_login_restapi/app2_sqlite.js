const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// SQLite DB 연결
const db = new sqlite3.Database('shopping.db', (err) => {
    if (err) console.error('DB 연결 실패:', err.message);
    else console.log('SQLite DB 연결 성공!');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('public'));

// 메인 라우트
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'public', 'products.html')));

// 로그인 API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('로그인 쿼리 오류:', err.message);
            return res.status(500).json({ message: '서버 오류' });
        }

        if (row) {
            req.session.user = { id: row.id, username: row.username };
            res.json({ message: '로그인 성공', username: row.username });
        } else {
            res.status(401).json({ message: '로그인 실패' });
        }
    });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 오류:', err);
            res.status(500).json({ message: '로그아웃 실패' });
        } else {
            res.json({ message: '로그아웃 성공', redirectUrl: '/' });
        }
    });
});

app.get('/api/check-login', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.json({ username: user.username });
    } else {
        res.status(401).json({ message: '인증되지 않은 사용자' });
    }
});

app.get('/api/products', (req, res) => {
    const query = `SELECT * FROM products`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('상품 조회 오류:', err.message);
            return res.status(500).json({ message: '상품 조회 실패' });
        }
        res.json(rows);
    });
});

// 로그인 확인 미들웨어
function checkLogin(req, res, next) {
    if (req.session.user) next();
    else res.status(401).json({ message: '로그인이 필요합니다.', redirectUrl: '/' });
}

// 장바구니 API
app.get('/api/cart', checkLogin, (req, res) => {
    const cart = req.session.cart || [];
    res.json({ cart });
});

app.post('/api/cart/:productId', checkLogin, (req, res) => {
    const productId = Number(req.params.productId);
    const query = `SELECT * FROM products WHERE id = ?`;

    db.get(query, [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        const cart = req.session.cart || [];
        const existingItem = cart.find((item) => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        req.session.cart = cart;
        res.json({ message: '상품 추가 완료', cart });
    });
});

app.put('/api/cart/:productId', checkLogin, (req, res) => {
    const productId = Number(req.params.productId);
    const change = Number(req.query.change);
    if (isNaN(productId) || isNaN(change)) return res.status(400).json({ message: '잘못된 요청' });

    const cart = req.session.cart || [];
    const item = cart.find((i) => i.id === productId);
    if (!item) return res.status(404).json({ message: '상품 없음' });

    item.quantity = Math.max(1, item.quantity + change);
    req.session.cart = cart;

    res.json({ message: '수량 변경됨', cart });
});

app.delete('/api/cart/:productId', checkLogin, (req, res) => {
    const productId = Number(req.params.productId);
    let cart = req.session.cart || [];

    const index = cart.findIndex((i) => i.id === productId);
    if (index === -1) return res.status(404).json({ message: '상품 없음' });

    cart.splice(index, 1);
    req.session.cart = cart;

    res.json({ cart });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
