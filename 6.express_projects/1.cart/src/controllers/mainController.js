// src/controllers/mainController.js

import path from 'path';

function home(req, res) {
    const user = req.session.user;
    res.sendFile(path.resolve('public/home.html'));
}

function products(req, res) {
    res.sendFile(path.resolve('public/products.html'));
}

function cart(req, res) {
    res.sendFile(path.resolve('public/cart.html'));
}

export { home, products, cart };
