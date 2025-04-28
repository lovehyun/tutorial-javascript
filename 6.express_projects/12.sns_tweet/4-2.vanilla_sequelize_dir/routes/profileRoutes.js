const express = require('express');
const router = express.Router();
const profile = require('../controllers/profileController');
const { loginRequired } = require('../controllers/middleware');

router.post('/profile/update', loginRequired, profile.updateProfile);
router.post('/profile/password', loginRequired, profile.changePassword);

module.exports = router;
