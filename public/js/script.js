// Saini Photography - Custom Scripts

document.addEventListener('DOMContentLoaded', () => {
    console.log('Saini Photography website initialized');

    // Smooth scroll for internal links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Removed problematic generic form interceptor to avoid blocking booking/login flows

    // Fallback for broken images
    const handleImageError = (img) => {
        console.warn(`Image failed to load: ${img.src}`);
        img.onerror = null; // Prevent infinite loop
        img.src = 'https://res.cloudinary.com/dwyfclm8v/image/upload/v1713340000/utsava-click/placeholder.jpg'; // Default placeholder
        img.classList.add('img-placeholder');
    };

    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            if (img.naturalWidth === 0) handleImageError(img);
        } else {
            img.addEventListener('error', () => handleImageError(img));
        }
    });

    // Horizontal Scrolling Gallery Infinite Loop Logic
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack) {
        // Clone the gallery items to create a seamless infinite scroll
        const items = galleryTrack.innerHTML;
        galleryTrack.innerHTML += items; // Double the items for seamless animation
    }

    // Custom Package Form Submission Handler
    const customForm = document.getElementById('customPackageForm');
    if (customForm) {
        const submitBtn = document.getElementById('submitBtn');
        const successAlert = document.getElementById('successAlert');

        customForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(customForm);
            const data = {};
            formData.forEach((value, key) => {
                // Handle checkboxes separately
                if (['photography', 'videography', 'droneShoot', 'album'].includes(key)) {
                    data[key] = value === 'on';
                } else {
                    data[key] = value;
                }
            });

            try {
                const response = await fetch('/custom-package', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Show success alert
                    successAlert.style.display = 'block';
                    customForm.reset();
                    // Scroll to top of alert
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const result = await response.json();
                    alert(result.message || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Floating Contact Button Toggle Logic
    const toggleBtn = document.getElementById('toggleContactBtn');
    const contactOptions = document.getElementById('contactOptions');
    const toggleIcon = document.getElementById('toggleIcon');

    if (toggleBtn && contactOptions && toggleIcon) {
        toggleBtn.addEventListener('click', () => {
            contactOptions.classList.toggle('show');
            toggleBtn.classList.toggle('active');

            if (toggleBtn.classList.contains('active')) {
                toggleIcon.classList.remove('bi-link-45deg');
                toggleIcon.classList.add('bi-x');
            } else {
                toggleIcon.classList.remove('bi-x');
                toggleIcon.classList.add('bi-link-45deg');
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !contactOptions.contains(e.target)) {
                contactOptions.classList.remove('show');
                toggleBtn.classList.remove('active');
                toggleIcon.classList.remove('bi-x');
                toggleIcon.classList.add('bi-link-45deg');
            }
        });
    }
});
