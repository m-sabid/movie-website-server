const express = require('express');
const { signup, login, googleLogin } = require('../controllers/authController');
const router = express.Router();

// POST request to signup
router.post('/signup', signup);

// POST request to login
router.post('/login', login);

// POST /api/auth/googleLogin
router.post('/googleLogin', googleLogin);

module.exports = router;
