const galleryImages = require('../config/galleryData');

/**
 * Get Gallery Page
 * Route: GET /gallery
 */
exports.getGalleryPage = (req, res) => {
    try {
        res.render('pages/gallery', {
            title: 'Full Gallery | Utsava Click',
            images: galleryImages
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        req.flash('error_msg', 'Could not load gallery images.');
        res.redirect('/');
    }
};
