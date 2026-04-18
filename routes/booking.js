const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const { isLoggedIn } = require('../middleware/auth');

/**
 * =========================
 * BOOKING ROUTES
 * =========================
 */

/**
 * GET /booking
 * Show booking page
 */
router.get('/booking', isLoggedIn, bookingController.getBookingPage);

/**
 * POST /booking
 * Submit booking
 */
router.post('/booking', isLoggedIn, bookingController.postBooking);

/**
 * =========================
 * APPROVE / REJECT (EMAIL LINKS)
 * NO LOGIN REQUIRED
 * =========================
 */

/**
 * Approve Booking
 */
const approveLink = `${BASE_URL}/booking/approve/${booking._id}`;
const rejectLink = `${BASE_URL}/booking/reject/${booking._id}`;

console.log("🚀 APPROVE LINK:", approveLink);
console.log("🚀 REJECT LINK:", rejectLink);

/**
 * Mark notification as read
 */
router.post('/notifications/read/:id', isLoggedIn, bookingController.markNotificationRead);

/**
 * =========================
 * CUSTOM PACKAGE
 * =========================
 */

/**
 * GET custom package page
 */
router.get('/custom-package', bookingController.getCustomPackagePage);

/**
 * POST custom package request
 */
router.post('/custom-package', bookingController.postCustomPackageRequest);

module.exports = router;