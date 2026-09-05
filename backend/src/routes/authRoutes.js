const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.post('/register', validateBody(['name', 'email', 'password']), register);
router.post('/login', validateBody(['email', 'password']), login);
router.get('/me', protect, me);

module.exports = router;
