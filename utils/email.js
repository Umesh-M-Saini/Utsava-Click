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
        
        // Ensure BASE_URL doesn't end with a slash for consistency
        const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

        const approveLink = `${cleanBaseUrl}/booking/approve/${booking._id}`;
        const rejectLink = `${cleanBaseUrl}/booking/reject/${booking._id}`;

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
        console.log('--- DEBUG: Preparing Approval Email for User ---', {
            name: booking.name,
            email: booking.email,
            package: booking.packageName
        });

        if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
            console.error('❌ SendGrid configuration missing');
            return { success: false, error: 'SendGrid not configured' };
        }

        const msg = {
            to: booking.email,
            from: {
                email: process.env.EMAIL_FROM,
                name: "Utsava Click"
            },
            subject: `Booking Approved! 🎉 - ${booking.packageName || 'Custom Package'}`,
            html: `
                <div style="font-family: Arial; max-width:600px; margin:auto; border:1px solid #28a745; border-radius:10px;">
                    <div style="background:#28a745; color:white; padding:20px; text-align:center; border-radius:9px 9px 0 0;">
                        <h2>Booking Approved!</h2>
                    </div>
                    <div style="padding:20px; color: #333;">
                        <p>Hi <strong>${booking.name}</strong>,</p>
                        <p>We are excited to inform you that your booking request for <strong>${booking.packageName || 'Custom Package'}</strong> has been <strong>Approved</strong>! ✅</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Package:</strong> ${booking.packageName || 'Custom'}</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>Location:</strong> ${booking.place}</p>
                            <p style="margin: 5px 0;"><strong>Total Price:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</p>
                        </div>

                        <p>Our team will contact you shortly to discuss further details and coordination.</p>
                        <p>Thank you for choosing <strong>Utsava Click</strong>!</p>
                    </div>
                    <div style="background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#666; border-radius:0 0 9px 9px;">
                        &copy; ${new Date().getFullYear()} Utsava Click. All rights reserved.
                    </div>
                </div>
            `
        };

        const response = await sgMail.send(msg);
        console.log(`✅ Approval email sent to ${booking.email}`);
        return { success: true, messageId: response[0]?.headers['x-message-id'] };

    } catch (error) {
        console.error('❌ Approval Email Error:', error.response?.body || error);
        return { success: false, error: error.message };
    }
};

/**
 * Send Rejection Email to User
 */
const sendRejectionToUser = async (booking) => {
    try {
        console.log('--- DEBUG: Preparing Rejection Email for User ---', {
            name: booking.name,
            email: booking.email
        });

        if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
            console.error('❌ SendGrid configuration missing');
            return { success: false, error: 'SendGrid not configured' };
        }

        const msg = {
            to: booking.email,
            from: {
                email: process.env.EMAIL_FROM,
                name: "Utsava Click"
            },
            subject: `Update on your Booking Request - Utsava Click`,
            html: `
                <div style="font-family: Arial; max-width:600px; margin:auto; border:1px solid #dc3545; border-radius:10px;">
                    <div style="background:#dc3545; color:white; padding:20px; text-align:center; border-radius:9px 9px 0 0;">
                        <h2>Booking Update</h2>
                    </div>
                    <div style="padding:20px; color: #333;">
                        <p>Hi <strong>${booking.name}</strong>,</p>
                        <p>Thank you for your interest in <strong>Utsava Click</strong>.</p>
                        <p>Regrettably, we are unable to accept your booking request for <strong>${booking.packageName || 'Custom Package'}</strong> at this time. ❌</p>
                        <p>This could be due to scheduling conflicts or unavailability on the requested dates.</p>
                        <p>Feel free to reach out to us for other dates or any questions.</p>
                        <br>
                        <p>Best regards,<br><strong>Utsava Click Team</strong></p>
                    </div>
                    <div style="background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#666; border-radius:0 0 9px 9px;">
                        &copy; ${new Date().getFullYear()} Utsava Click. All rights reserved.
                    </div>
                </div>
            `
        };

        const response = await sgMail.send(msg);
        console.log(`✅ Rejection email sent to ${booking.email}`);
        return { success: true, messageId: response[0]?.headers['x-message-id'] };

    } catch (error) {
        console.error('❌ Rejection Email Error:', error.response?.body || error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendBookingToOwner,
    sendApprovalToUser,
    sendRejectionToUser
};