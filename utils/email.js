const sgMail = require('@sendgrid/mail');

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send Booking Notification Email to Owner
 */
const sendBookingToOwner = async (booking) => {
    try {
        console.log('--- DEBUG: Preparing Booking Email for Owner ---', {
            packageName: booking.packageName,
            name: booking.name,
            email: booking.email
        });

        if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
            console.error('❌ SendGrid configuration missing');
            return { success: false, messageId: null, error: 'SendGrid not configured' };
        }

        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

        const approveLink = `${BASE_URL}/booking/approve/${booking._id}`;
        const rejectLink = `${BASE_URL}/booking/reject/${booking._id}`;

        const servicesList = Array.isArray(booking.services) && booking.services.length > 0
            ? booking.services.join(', ')
            : 'No services specified';

        const msg = {
            to: process.env.EMAIL_FROM,

            // ✅ FIXED (important)
            from: {
                email: process.env.EMAIL_FROM,
                name: "Utsava Click"
            },

            replyTo: booking.email || process.env.EMAIL_FROM,

            subject: `New Booking Request: ${booking.packageName || 'Custom Package'}`,

            html: `
                <div style="font-family: Arial; max-width:600px; margin:auto; border:1px solid #d4af37; border-radius:10px;">
                    <div style="background:#111; color:#d4af37; padding:20px; text-align:center;">
                        <h2>New Booking Request</h2>
                    </div>

                    <div style="padding:20px;">
                        <p><strong>Name:</strong> ${booking.name || 'N/A'}</p>
                        <p><strong>Email:</strong> ${booking.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${booking.phone || 'N/A'}</p>
                        <p><strong>Package:</strong> ${booking.packageName || 'Custom'}</p>
                        <p><strong>Services:</strong> ${servicesList}</p>
                        <p><strong>Price:</strong> ₹${booking.totalPrice || 0}</p>
                        <p><strong>Location:</strong> ${booking.place || 'N/A'}</p>

                        <div style="margin-top:20px; text-align:center;">
                            <a href="${approveLink}" style="background:#28a745; color:white; padding:10px 20px; text-decoration:none; border-radius:20px;">Approve</a>
                            <a href="${rejectLink}" style="background:#dc3545; color:white; padding:10px 20px; text-decoration:none; border-radius:20px;">Reject</a>
                        </div>
                    </div>
                </div>
            `
        };

        const response = await sgMail.send(msg);

        console.log('✅ Booking email sent');
        return { success: true, messageId: response[0]?.headers['x-message-id'], error: null };

    } catch (error) {
        // ✅ FULL ERROR LOG (VERY IMPORTANT)
        console.error('❌ FULL ERROR:', error.response?.body || error);

        return { success: false, messageId: null, error: error.message };
    }
};


/**
 * Send Approval Email to User
 */
const sendApprovalToUser = async (booking) => {
    try {
        const msg = {
            to: booking.email,

            // ✅ FIXED
            from: {
                email: process.env.EMAIL_FROM,
                name: "Utsava Click"
            },

            subject: 'Booking Approved 🎉',

            html: `
                <h2>Booking Approved</h2>
                <p>Hi ${booking.name},</p>
                <p>Your booking has been approved.</p>
            `
        };

        await sgMail.send(msg);
        console.log(`✅ Approval email sent to ${booking.email}`);

    } catch (error) {
        console.error('❌ FULL ERROR:', error.response?.body || error);
    }
};


/**
 * Send Rejection Email to User
 */
const sendRejectionToUser = async (booking) => {
    try {
        const msg = {
            to: booking.email,

            // ✅ FIXED
            from: {
                email: process.env.EMAIL_FROM,
                name: "Utsava Click"
            },

            subject: 'Booking Rejected',

            html: `
                <h2>Booking Rejected</h2>
                <p>Hi ${booking.name},</p>
                <p>Your booking was not accepted.</p>
            `
        };

        await sgMail.send(msg);
        console.log(`❌ Rejection email sent to ${booking.email}`);

    } catch (error) {
        console.error('❌ FULL ERROR:', error.response?.body || error);
    }
};

module.exports = {
    sendBookingToOwner,
    sendApprovalToUser,
    sendRejectionToUser
};