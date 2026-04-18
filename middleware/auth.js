/**
 * Auth Middleware for Utsava Click
 * This file contains middleware functions to protect routes.
 */

/**
 * Middleware to check if user is logged in
 */
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to access this page 🔒');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware to check if user is NOT logged in (for login/signup routes)
 */
const isNotLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

module.exports = {
    isLoggedIn,
    isNotLoggedIn
};
