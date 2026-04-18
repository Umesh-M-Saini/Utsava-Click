const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Register a new user
 * Route: POST /register
 */
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation: Check if all fields are provided
        if (!name || !email || !password) {
            req.flash('error_msg', 'All fields are required ❌');
            return res.redirect('/signup');
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email is already registered ❌');
            return res.redirect('/signup');
        }

        // 3. Password Security: Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Save user to MongoDB
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // 5. Success Alert and Session Creation (Regenerate for security)
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session Regeneration Error:', err);
                req.flash('error_msg', 'Something went wrong during signup ❌');
                return res.redirect('/signup');
            }
            req.session.user = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            };
            req.flash('success_msg', 'Account created successfully 🎉');
            res.redirect('/');
        });

    } catch (error) {
        console.error(`Registration Error: ${error.message}`);
        req.flash('error_msg', 'Server Error. Please try again later. ❌');
        res.redirect('/signup');
    }
};

/**
 * Login User
 * Route: POST /login
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation: Check if email and password are provided
        if (!email || !password) {
            req.flash('error_msg', 'Please provide email and password ❌');
            return res.redirect('/login');
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid email or password ❌');
            return res.redirect('/login');
        }

        // 3. Password Check: Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password ❌');
            return res.redirect('/login');
        }

        // 4. Success Alert and Session Creation (Regenerate for security)
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session Regeneration Error:', err);
                req.flash('error_msg', 'Something went wrong during login ❌');
                return res.redirect('/login');
            }
            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email
            };
            req.flash('success_msg', 'Login successful ✅');
            res.redirect('/');
        });

    } catch (error) {
        console.error(`Login Error: ${error.message}`);
        req.flash('error_msg', 'Server Error. Please try again later. ❌');
        res.redirect('/login');
    }
};

/**
 * Logout User
 * Route: GET /logout
 */
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/'); // Redirect to home page as requested
    });
};