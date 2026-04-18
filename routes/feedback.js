const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

/**
 * @route   GET /feedback
 * @desc    Show feedback form page
 * @access  Public
 */
router.get('/feedback', feedbackController.getFeedbackPage);

/**
 * @route   POST /feedback
 * @desc    Handle feedback submission
 * @access  Public
 */
router.post('/feedback', feedbackController.postFeedback);

module.exports = router;
