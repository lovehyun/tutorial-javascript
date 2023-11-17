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

const products = [
    { id: 1, name: 'Product 1', price: 2000 },
    { id: 2, name: 'Product 2', price: 3000 },
    { id: 3, name: 'Product 3', price: 1500 },
];

app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/add-to-cart/:productId', (req, res) => {
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

app.post('/update-quantity/:productId', (req, res) => {
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
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

app.post('/remove-from-cart/:productId', (req, res) => {
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

    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products2.html'));
});

app.get('/cart2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart2.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
