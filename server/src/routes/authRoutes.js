const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/signup
router.post('/signup', authController.signup);

// @route   POST api/auth/login
router.post('/login', authController.login);

module.exports = router;
