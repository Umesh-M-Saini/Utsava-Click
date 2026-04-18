document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toggles = document.querySelectorAll('.toggle-password');

    if (loginForm) {
        // No e.preventDefault() here - let the form submit naturally to the server
        // so req.flash and res.redirect work properly
    }
    
    if (toggles.length) {
        toggles.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSelector = btn.getAttribute('data-target');
                const input = document.querySelector(targetSelector);
                const eye = btn.querySelector('.icon-eye');
                const eyeSlash = btn.querySelector('.icon-eye-slash');
                
                if (!input) return;
                
                // Toggle type
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                
                // Toggle icons
                if (eye && eyeSlash) {
                    eye.classList.toggle('d-none', isPassword);
                    eyeSlash.classList.toggle('d-none', !isPassword);
                }
            });
        });
    }
});
