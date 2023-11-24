// src/controllers/mainController.js

const path = require('path');

function home(req, res) {
    const user = req.session.user;
    res.sendFile(path.join(__dirname, '../../public', 'home.html'));
}

function products(req, res) {
    res.sendFile(path.join(__dirname, '../../public', 'products.html'));
}

function cart(req, res) {
    res.sendFile(path.join(__dirname, '../../public', 'cart.html'));
}

module.exports = { home, products, cart };
