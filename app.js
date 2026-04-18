require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectDB = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (important for Railway)
app.set('trust proxy', 1);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ SESSION CONFIG (SAFE VERSION)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,

    store: process.env.MONGO_URI
        ? MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions'
        })
        : undefined,

    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,     // IMPORTANT: keep false for now
        sameSite: 'lax'
    }
}));

// Flash
app.use(flash());

// Models
const Notification = require('./models/Notification');
const Feedback = require('./models/Feedback');

// Global Middleware (Set res.locals before routes)
app.use(async (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    res.locals.cloudinaryBaseUrl = process.env.CLOUDINARY_URL || "https://res.cloudinary.com/dwyfclm8v/image/upload/v1713340000/utsava-click/"; 

    // ✅ Default values for templates
    res.locals.unreadCount = 0;
    res.locals.notifications = [];

    // Feedbacks
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(10);
        res.locals.feedbacks = feedbacks || [];
    } catch (err) {
        console.log("Feedback error:", err);
        res.locals.feedbacks = [];
    }

    // Notifications & unread count
    if (req.session.user) {
        try {
            const notifications = await Notification.find({ userId: req.session.user.id }).limit(5);
            res.locals.notifications = notifications;
            
            // ✅ Count unread notifications
            const count = await Notification.countDocuments({ 
                userId: req.session.user.id, 
                isRead: false 
            });
            res.locals.unreadCount = count;
        } catch (err) {
            console.log("Notification error:", err);
            res.locals.notifications = [];
            res.locals.unreadCount = 0;
        }
    }
    next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const feedbackRoutes = require('./routes/feedback');

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', bookingRoutes);
app.use('/', feedbackRoutes);

// 404 handler (Move to bottom)
app.use((req, res) => {
    res.status(404).render('pages/404', { title: '404 - Page Not Found' });
});

// ✅ CONNECT DB (SAFE)
connectDB()
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Mongo Error:", err));

// ✅ START SERVER (ALWAYS RUN)
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
