// productRouter.js
const express = require('express');
const router = express.Router();

// 제품 목록 조회
router.get('/list', (req, res) => {
    res.send('Product List');
});

// 제품 상세 정보 조회
router.get('/details', (req, res) => {
    res.send('Product Details');
});

// 제품 상세 정보 조회 - 동적 ID 사용
router.get('/:id/details', (req, res) => {
    const productId = req.params.id; // URL 파라미터에서 id 추출
    res.send(`Product Details for ID: ${productId}`);
});

// 새로운 제품 추가 - POST 요청
router.post('/add', (req, res) => {
    const productData = req.body; // 요청 본문에서 데이터 추출
    res.send(`Product added with data: ${JSON.stringify(productData)}`);
});

// 제품 삭제 - DELETE 요청
router.delete('/:id/delete', (req, res) => {
    const productId = req.params.id; // URL 파라미터에서 id 추출
    res.send(`Product with ID ${productId} has been deleted`);
});

module.exports = router;
