const express = require('express');
const router = express.Router();
const { login, getMe, setup } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginValidation } = require('../middleware/validation');

router.post('/setup', setup);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

module.exports = router;
