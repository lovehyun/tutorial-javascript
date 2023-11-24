// src/controllers/productController.js

const products = require('../data/products');

function getProducts(req, res) {
    res.json(products);
}

module.exports = { getProducts };
