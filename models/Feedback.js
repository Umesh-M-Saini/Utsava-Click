const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    packageName: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },
    experience: {
        type: String,
        required: [true, 'Experience message is required'],
        maxlength: [300, 'Experience cannot exceed 300 characters'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
