const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, registerValidation, loginValidation } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.post('/register', ...registerValidation, validate, register);
router.post('/login', ...loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

module.exports = router;
