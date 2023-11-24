// src/controllers/cartController.js

const products = require('../data/products');

function getCart(req, res) {
    const cart = req.session.cart || [];
    res.json({ cart, totalAmount: calculateTotalAmount(cart) });
}

function addToCart(req, res) {
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
            image: product.image,
            name: product.name,
            price: product.price,
            quantity: 1,
        });
    }

    req.session.cart = cart;
    res.json({ message: '상품이 장바구니에 추가되었습니다.', cart, totalAmount: calculateTotalAmount(cart) });
}

function updateCartItem(req, res) {
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
}

function removeFromCart(req, res) {
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
}

function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
