const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create-sample', userController.createSampleUser);
router.get('/user/:name', userController.getUserInfo);

module.exports = router;
