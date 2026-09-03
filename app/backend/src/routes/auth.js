const express = require('express');
const router = express.Router();
const { register, requestOtp, verifyOtp, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { handleValidation, registerValidators, phoneValidator, otpValidator } = require('../utils/validators');

router.post('/register', registerValidators, handleValidation, register);
router.post('/request-otp', [phoneValidator], handleValidation, requestOtp);
router.post('/verify-otp', [phoneValidator, otpValidator], handleValidation, verifyOtp);
router.get('/me', requireAuth, me);

module.exports = router;
