// productRouter.js
const express = require('express');
const router = express.Router();

// 제품 상세 정보 조회
router.get('/details', (req, res) => {
    res.send('Product Details');
});

// 제품 목록 조회
router.get('/list', (req, res) => {
    res.send('Product List');
});

module.exports = router;
