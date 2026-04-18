const Feedback = require('../models/Feedback');

/**
 * Render Feedback Form Page
 * Route: GET /feedback
 */
exports.getFeedbackPage = (req, res) => {
    res.render('pages/feedback', { title: 'Share Your Experience | Utsava Click' });
};

/**
 * Handle Feedback Submission
 * Route: POST /feedback
 */
exports.postFeedback = async (req, res) => {
    try {
        const { name, packageName, experience, rating } = req.body;

        // Basic validation
        if (!name || !packageName || !experience || !rating) {
            req.flash('error_msg', 'All fields are required ❌');
            return res.redirect('/feedback');
        }

        const newFeedback = new Feedback({
            name,
            packageName,
            experience,
            rating: parseInt(rating)
        });

        await newFeedback.save();

        req.flash('success_msg', 'Thank you for your feedback! 🎉');
        res.redirect('/');

    } catch (error) {
        console.error('Feedback Submission Error:', error);
        req.flash('error_msg', 'Something went wrong. Please try again ❌');
        res.redirect('/feedback');
    }
};
