const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const galleryController = require('../controllers/galleryController');
const { isLoggedIn, isNotLoggedIn } = require('../middleware/auth');

// Home page route
router.get('/', userController.getHomePage);

// Gallery page route
router.get('/gallery', galleryController.getGalleryPage);

// Portfolio page route
router.get('/portfolio', userController.getPortfolioPage);

// Packages page route
router.get('/packages', userController.getPackagesPage);

// Login page route (Only for guests)
router.get('/login', isNotLoggedIn, userController.getLoginPage);

// Signup page route (Only for guests)
router.get('/signup', isNotLoggedIn, userController.getSignupPage);

// Package 1 details route
router.get('/package1', userController.getPackage1Page);

// Package 2 details route
router.get('/package2', userController.getPackage2Page);

// Package 3 details route
router.get('/package3', userController.getPackage3Page);

module.exports = router;
