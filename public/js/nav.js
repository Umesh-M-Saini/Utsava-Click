/* public/js/nav.js */

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNavbar');

    // Navbar Scroll Effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add('bg-transparent');
        }
    });

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    const menuCollapse = document.getElementById('mainNavCollapse');
    const togglerIcon = document.getElementById('navbarTogglerIcon');
    
    if (menuCollapse) {
        const bsCollapse = new bootstrap.Collapse(menuCollapse, {toggle: false});

        // Toggle icon when collapse is shown/hidden
        menuCollapse.addEventListener('show.bs.collapse', () => {
            if (togglerIcon) {
                togglerIcon.classList.remove('bi-list');
                togglerIcon.classList.add('bi-x');
            }
        });

        menuCollapse.addEventListener('hide.bs.collapse', () => {
            if (togglerIcon) {
                togglerIcon.classList.remove('bi-x');
                togglerIcon.classList.add('bi-list');
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && menuCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // Notification Dropdown Mobile Logic
    const initNotifications = () => {
        const notifDropdown = document.getElementById('notifDropdown');
        const closeNotifBtn = document.getElementById('closeNotifications');
        const notifBackdrop = document.getElementById('notifBackdrop');

        if (notifDropdown && typeof bootstrap !== 'undefined') {
            const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(notifDropdown);

            if (closeNotifBtn) {
                closeNotifBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    bsDropdown.hide();
                });
            }

            if (notifBackdrop) {
                notifBackdrop.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    bsDropdown.hide();
                });
            }

            notifDropdown.addEventListener('shown.bs.dropdown', () => {
                if (window.innerWidth < 992) {
                    document.body.classList.add('notification-open-body');
                }
            });

            notifDropdown.addEventListener('hidden.bs.dropdown', () => {
                document.body.classList.remove('notification-open-body');
            });
        }
    };

    // Initialize notifications
    if (typeof bootstrap === 'undefined') {
        window.addEventListener('load', initNotifications);
    } else {
        initNotifications();
    }
});
