const CustomPackage = require('../models/CustomPackage');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { sendBookingToOwner, sendApprovalToUser, sendRejectionToUser } = require('../utils/email');

/**
 * Get Booking Page
 * Route: GET /booking
 */
exports.getBookingPage = (req, res) => {
    console.log('--- DEBUG: Booking Query Params ---', req.query);
    const { package: packageNameParam, price, services, total } = req.query;
    
    // Detect if this is a manual booking (no query params)
    const isManualBooking = !packageNameParam && !price && !services && !total;

    // Parse services if they come from custom package
    let selectedServices = [];
    if (services) {
        selectedServices = Array.isArray(services) ? services : services.split(',');
    }

    // Default package name if services are present but package name is missing
    let finalPackageName = packageNameParam || null;
    if (!finalPackageName && selectedServices.length > 0) {
        finalPackageName = "Custom Package";
    }

    // preFilled object with only the allowed fields
    const preFilled = {
        packageName: finalPackageName,
        services: selectedServices,
        totalPrice: parseFloat(total || price) || 0
    };

    console.log('--- DEBUG: preFilled Object ---', preFilled);

    res.render('pages/booking', {
        title: 'Book Your Session | Utsava Click',
        preFilled: preFilled,
        isManualBooking: isManualBooking
    });
};

/**
 * Handle Booking Submission
 * Route: POST /booking
 */
exports.postBooking = async (req, res) => {
    try {
        console.log('--- DEBUG: Received Booking Body ---', req.body);
        const { name, email, phone, packageName, services, totalPrice, startDate, endDate, place } = req.body;

        // Backend Validation: Ensure all required fields are present
        if (!name || !email || !phone || !packageName || !startDate || !endDate || !place) {
            console.log('--- DEBUG: Validation Failed ---', { name, email, phone, packageName, startDate, endDate, place });
            req.flash('error_msg', 'Please fill all required fields ❌');
            return res.redirect('/booking');
        }

        // Backend Date Validation
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            req.flash('error_msg', 'End date cannot be before start date ❌');
            return res.redirect('/booking');
        }

        const newBooking = new Booking({
            userId: req.session.user.id,
            name,
            email,
            phone,
            packageName,
            services: Array.isArray(services) ? services : (services ? services.split(',') : []),
            totalPrice,
            startDate,
            endDate,
            place
        });

        await newBooking.save();

        // Send Email to Owner
        const emailResult = await sendBookingToOwner(newBooking);
        if (!emailResult.success) {
            console.error('⚠️ Email notification failed:', emailResult.error);
        }

        // Create notification for user
        const notification = new Notification({
            userId: req.session.user.id,
            message: "Your booking request has been submitted! We will contact you soon.",
            type: 'success'
        });
        await notification.save();

        req.flash('success_msg', 'Booking request submitted successfully! 🎉');
        res.redirect('/');

    } catch (error) {
        console.error('Booking Submission Error:', error);
        req.flash('error_msg', 'Something went wrong with your booking. Please try again.');
        res.redirect('/booking');
    }
};

/**
 * Approve Booking
 * Route: GET /booking/approve/:id
 */
exports.approveBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // ✅ VALIDATION FIX (VERY IMPORTANT)
        if (!bookingId || bookingId.length < 10) {
            return res.status(400).send("Invalid booking ID ❌");
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send("Booking not found ❌");
        }

        if (booking.status !== "pending") {
            return res.send("Already processed ❌");
        }

        booking.status = "approved";
        await booking.save();

        await sendApprovalToUser(booking);

        // ✅ Notification Logic (Refined)
        try {
            const notification = await Notification.create({
                userId: booking.userId,
                message: "🎉 Congratulations! Your booking has been approved. We will contact you soon with further details.",
                type: "success",
                isRead: false
            });
            console.log("✅ Approval notification created for user:", booking.userId, "Notification ID:", notification._id);
        } catch (notifError) {
            console.error("❌ Failed to create approval notification:", notifError);
            // We don't return here because the booking itself was already approved in the DB
        }

        return res.send("<h2 style='color:green'>Booking Approved ✅</h2>");

    } catch (error) {
        console.error("Approve Error:", error);
        return res.status(500).send("Server Error ❌");
    }
};

/**
 * Reject Booking
 * Route: GET /booking/reject/:id
 */
exports.rejectBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // ✅ VALIDATION FIX
        if (!bookingId || bookingId.length < 10) {
            return res.status(400).send("Invalid booking ID ❌");
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send("Booking not found ❌");
        }

        if (booking.status !== "pending") {
            return res.send("Already processed ❌");
        }

        booking.status = "rejected";
        await booking.save();

        await sendRejectionToUser(booking);

        // ✅ Notification Logic (Refined)
        try {
            const notification = await Notification.create({
                userId: booking.userId,
                message: "❌ We’re sorry! Your booking request could not be accepted at this time. Please try again or contact us for more details.",
                type: "warning",
                isRead: false
            });
            console.log("❌ Rejection notification created for user:", booking.userId, "Notification ID:", notification._id);
        } catch (notifError) {
            console.error("❌ Failed to create rejection notification:", notifError);
            // We don't return here because the booking itself was already rejected in the DB
        }

        return res.send("<h2 style='color:red'>Booking Rejected ❌</h2>");

    } catch (error) {
        console.error("Reject Error:", error);
        return res.status(500).send("Server Error ❌");
    }
};

/**
 * Mark Notification as Read
 * Route: POST /notifications/read/:id
 */
exports.markNotificationRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

/**
 * Get Custom Package Page
 * Route: GET /custom-package
 */
exports.getCustomPackagePage = (req, res) => {
    res.render('pages/customPackage', { 
        title: 'Create Your Custom Package | Utsava Click' 
    });
};


/**
 * Delete Notification
 * Route: DELETE /notifications/:id
 */
exports.deleteNotification = async (req, res) => {
    try {
        const notifId = req.params.id;

        if (!notifId) {
            return res.status(400).json({ success: false, message: "Invalid ID ❌" });
        }

        await Notification.findByIdAndDelete(notifId);

        console.log("🗑️ Notification deleted:", notifId);

        res.json({ success: true });

    } catch (error) {
        console.error("❌ Delete Notification Error:", error);
        res.status(500).json({ success: false });
    }
};


/**
 * Handle Custom Package Request
 * Route: POST /custom-package
 */
exports.postCustomPackageRequest = async (req, res) => {
    try {
        console.log('--- DEBUG: Received Custom Package Body ---', req.body);
        const { 
            fullName, email, phone, eventType, 
            startDate, endDate, location, budgetRange,
            traditionalphoto, traditionalvideo, candidphotography, cinematicvideo,
            droneshoot, fpvdrone, album30page, editedvideo1hour, reel, ledwallscreen,
            message 
        } = req.body;

        // Create new request object
        const newRequest = new CustomPackage({
            fullName,
            email,
            phone,
            eventType,
            startDate,
            endDate,
            location,
            budgetRange,
            services: {
                traditionalPhoto: traditionalphoto === 'on' || traditionalphoto === true,
                traditionalVideo: traditionalvideo === 'on' || traditionalvideo === true,
                candidPhotography: candidphotography === 'on' || candidphotography === true,
                cinematicVideo: cinematicvideo === 'on' || cinematicvideo === true,
                droneShoot: droneshoot === 'on' || droneshoot === true,
                fpvDrone: fpvdrone === 'on' || fpvdrone === true,
                album30p: album30page === 'on' || album30page === true,
                editedVideo1h: editedvideo1hour === 'on' || editedvideo1hour === true,
                reel: reel === 'on' || reel === true,
                ledWall: ledwallscreen === 'on' || ledwallscreen === true
            },
            message
        });

        // Save to database
        await newRequest.save();

        // ✅ Trigger Email Notification for Custom Package Request
        const emailData = {
            name: fullName,
            email: email,
            phone: phone,
            packageName: `Custom Request: ${eventType}`,
            services: Object.entries(newRequest.services)
                .filter(([_, value]) => value === true)
                .map(([key]) => key),
            totalPrice: `Budget: ${budgetRange}`,
            place: location,
            startDate,
            endDate
        };

        console.log('--- DEBUG: Triggering Email for Custom Request ---');
        const emailResult = await sendBookingToOwner(emailData);
        if (!emailResult.success) {
            console.error('⚠️ Custom request email failed:', emailResult.error);
        }

        // Handle AJAX requests
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(200).json({ 
                success: true, 
                message: 'Request sent successfully 🎉. We will contact you soon!' 
            });
        }

        req.flash('success_msg', 'Request sent successfully 🎉. We will contact you soon!');
        res.redirect('/');

    } catch (error) {
        console.error('Custom Package Request Error:', error);

        // Handle AJAX errors
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ 
                success: false, 
                message: 'Something went wrong. Please try again ❌' 
            });
        }

        req.flash('error_msg', 'Something went wrong. Please try again ❌');
        res.redirect('/custom-package');
    }
};