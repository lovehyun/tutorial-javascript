// cartRouter.js
const express = require('express');
const router = express.Router();

// 라우트 체인
router.route('/')
    .get((req, res) => {
        // 장바구니 정보 조회
        res.send('Get Cart');
    })
    .post((req, res) => {
        // 새로운 상품 추가
        res.send('Add to Cart');
    })
    .put((req, res) => {
        // 상품 수량 업데이트
        res.send('Update in Cart');
    })
    .delete((req, res) => {
        // 상품 삭제
        res.send('Delete from Cart');
    });

module.exports = router;
