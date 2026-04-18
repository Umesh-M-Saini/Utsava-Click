const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isLoggedIn } = require('../middleware/auth');

/**
 * @route   GET /booking
 * @desc    Show booking page
 * @access  Private
 */
router.get('/booking', isLoggedIn, bookingController.getBookingPage);

/**
 * @route   POST /booking
 * @desc    Handle booking submission
 * @access  Private
 */
router.post('/booking', isLoggedIn, bookingController.postBooking);

/**
 * @route   GET /booking/approve/:id
 * @desc    Approve booking
 * @access  Public (from email)
 */
router.get('/booking/approve/:id', bookingController.approveBooking);

/**
 * @route   GET /booking/reject/:id
 * @desc    Reject booking
 * @access  Public (from email)
 */
router.get('/booking/reject/:id', bookingController.rejectBooking);

/**
 * @route   POST /notifications/read/:id
 * @desc    Mark notification as read
 * @access  Private
 */
router.post('/notifications/read/:id', isLoggedIn, bookingController.markNotificationRead);

/**
 * @route   GET /custom-package
 * @desc    Show custom package booking page
 * @access  Public
 */
router.get('/custom-package', bookingController.getCustomPackagePage);

/**
 * @route   POST /custom-package
 * @desc    Handle custom package request submission
 * @access  Public
 */
router.post('/custom-package', bookingController.postCustomPackageRequest);

module.exports = router;