const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.registerUser);

/**
 * @route   POST /login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', authController.loginUser);

/**
 * @route   GET /logout
 * @desc    Logout a user
 * @access  Public
 */
router.get('/logout', authController.logoutUser);

module.exports = router;