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
    try {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.user = req.session.user || null;
        res.locals.cloudinaryBaseUrl = process.env.CLOUDINARY_URL || "https://res.cloudinary.com/dwyfclm8v/image/upload/v1713340000/utsava-click/";

        // ✅ Default values for templates
        res.locals.unreadCount = 0;
        res.locals.notifications = [];
        res.locals.feedbacks = [];

        // Fetch Global Feedbacks (Limit to 10 for performance)
        try {
            const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(10);
            res.locals.feedbacks = feedbacks || [];
        } catch (err) {
            console.error("❌ Feedback fetching error:", err);
        }

        // Fetch User-Specific Notifications
        if (req.session && req.session.user) {
            try {
                const userId = req.session.user.id || req.session.user._id; // Handle both id formats
                if (userId) {
                    const [notifications, unreadCount] = await Promise.all([
                        Notification.find({ userId: userId.toString() }).sort({ createdAt: -1 }).limit(5),
                        Notification.countDocuments({ userId: userId.toString(), isRead: false })
                    ]);

                    res.locals.notifications = notifications || [];
                    res.locals.unreadCount = unreadCount || 0;
                    console.log(`🔔 Notifications fetched for user: ${userId}`);
                }
            } catch (err) {
                console.error("❌ Notification fetching error:", err);
            }
        }
        
        next(); // 🔥 CRITICAL: Move to next middleware/route
    } catch (error) {
        console.error("❌ Global Middleware Error:", error);
        next(); // Ensure request continues even if middleware fails
    }
});

// Routesa
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const feedbackRoutes = require('./routes/feedback');

app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/booking'));
app.use('/', require('./routes/feedback'));

// 404 handler (Move to bottom)
app.use((req, res) => {
    res.status(404).render('pages/404', { title: '404 - Page Not Found' });
});

// ✅ DATABASE & SERVER STARTUP (SAFE ASYNC)
const startServer = async () => {
    try {
        console.log("⏳ Starting server setup...");
        
        // Connect to MongoDB
        await connectDB();
        console.log("✅ MongoDB Connection Established");

        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server successfully running on port ${PORT}`);
        });
        
    } catch (error) {
        console.error("❌ CRITICAL: Server failed to start:", error);
        process.exit(1); // Exit with failure
    }
};

// Execute Startup
startServer();
