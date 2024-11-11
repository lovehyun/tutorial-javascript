// src/controllers/productController.js

import products from '../data/products.js';

function getProducts(req, res) {
    res.json(products);
}

export { getProducts };
