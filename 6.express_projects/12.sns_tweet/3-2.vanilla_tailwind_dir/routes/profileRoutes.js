const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { loginRequired } = require('../middlewares/authMiddleware');

router.post('/profile/update', loginRequired, profileController.updateProfile);
router.post('/profile/password', loginRequired, profileController.changePassword);

module.exports = router;
