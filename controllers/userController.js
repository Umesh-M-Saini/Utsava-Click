/**
 * User controller to handle application logic for various pages.
 */
const Feedback = require('../models/Feedback');

// Home Page
exports.getHomePage = (req, res) => {
    res.render('pages/index', { 
        title: 'Saini Photography | Home'
    });
};

// Portfolio Page
exports.getPortfolioPage = (req, res) => {
    res.render('pages/portfolio', { title: 'Our Portfolio' });
};

// Packages Page
exports.getPackagesPage = (req, res) => {
    res.render('pages/packages', { title: 'Photography Packages' });
};

// Login Page
exports.getLoginPage = (req, res) => {
    res.render('pages/login', { title: 'Login | Utsava Click' });
};

// Signup Page
exports.getSignupPage = (req, res) => {
    res.render('pages/signup', { title: 'Signup | Utsava Click' });
};

// Package 1 Details Page
exports.getPackage1Page = (req, res) => {
    res.render('pages/package1', { title: 'First Package Details | Utsava Click' });
};

// Package 2 Details Page
exports.getPackage2Page = (req, res) => {
    res.render('pages/package2', { title: 'Second Package Details | Utsava Click' });
};

// Package 3 Details Page
exports.getPackage3Page = (req, res) => {
    res.render('pages/package3', { title: 'Third Package Details | Utsava Click' });
};
