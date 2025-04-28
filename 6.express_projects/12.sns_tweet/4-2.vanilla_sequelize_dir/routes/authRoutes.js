const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { loginRequired } = require('../controllers/middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', loginRequired, auth.logout);
router.get('/me', auth.me);

module.exports = router;
