const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const { isLoggedIn } = require('../middleware/auth');

/**
 * GET /booking
 */
router.get('/booking', isLoggedIn, bookingController.getBookingPage);

/**
 * POST /booking
 */
router.post('/booking', isLoggedIn, bookingController.postBooking);

/**
 * APPROVE BOOKING (EMAIL LINK)
 */
router.get('/booking/approve/:id', bookingController.approveBooking);

/**
 * REJECT BOOKING (EMAIL LINK)
 */
router.get('/booking/reject/:id', bookingController.rejectBooking);

/**
 * NOTIFICATION READ & DELETE
 */
router.post('/notifications/read/:id', isLoggedIn, bookingController.markNotificationRead);
router.delete('/notifications/:id', isLoggedIn, bookingController.deleteNotification);

/**
 * CUSTOM PACKAGE
 */
router.get('/custom-package', bookingController.getCustomPackagePage);
router.post('/custom-package', bookingController.postCustomPackageRequest);

module.exports = router;