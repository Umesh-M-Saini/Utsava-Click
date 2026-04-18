const mongoose = require('mongoose');

const customPackageSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: ['Wedding', 'Pre-wedding', 'Engagement', 'Birthday', 'Maternity', 'Other']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true
    },
    budgetRange: {
        type: String,
        required: [true, 'Budget range is required']
    },
    services: {
        traditionalPhoto: { type: Boolean, default: false },
        traditionalVideo: { type: Boolean, default: false },
        candidPhotography: { type: Boolean, default: false },
        cinematicVideo: { type: Boolean, default: false },
        droneShoot: { type: Boolean, default: false },
        fpvDrone: { type: Boolean, default: false },
        album30p: { type: Boolean, default: false },
        editedVideo1h: { type: Boolean, default: false },
        reel: { type: Boolean, default: false },
        ledWall: { type: Boolean, default: false }
    },
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Contacted', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomPackage', customPackageSchema);