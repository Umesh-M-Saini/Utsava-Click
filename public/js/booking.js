/* public/js/booking.js */

// Helper function for manual package selection
function selectManualPackage(name, price, services) {
    // Update hidden inputs
    const hiddenPackageName = document.getElementById('hiddenPackageName');
    const hiddenTotalPrice = document.getElementById('hiddenTotalPrice');
    const hiddenServices = document.getElementById('hiddenServices');

    if (hiddenPackageName) hiddenPackageName.value = name;
    if (hiddenTotalPrice) hiddenTotalPrice.value = price;
    if (hiddenServices) hiddenServices.value = services;

    // Visual feedback for selection
    const allOptions = document.querySelectorAll('.package-option-item');
    allOptions.forEach(opt => opt.classList.remove('selected'));

    // Find the clicked element or its parent
    const event = window.event;
    const clickedElement = event.currentTarget;
    clickedElement.classList.add('selected');

    console.log(`Package Selected: ${name}, Price: ${price}`);
}

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('mainBookingForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const dateError = document.getElementById('dateError');
    
    // Set minimum date to today for both inputs
    const today = new Date().toISOString().split('T')[0];
    if (startDateInput) startDateInput.setAttribute('min', today);
    if (endDateInput) endDateInput.setAttribute('min', today);

    // Real-time validation
    const validateDates = () => {
        if (!startDateInput || !endDateInput) return true;

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDateInput.value && endDateInput.value && endDate < startDate) {
            // Invalid
            endDateInput.classList.add('is-invalid-custom');
            dateError.classList.remove('d-none');
            return false;
        } else {
            // Valid
            endDateInput.classList.remove('is-invalid-custom');
            dateError.classList.add('d-none');
            return true;
        }
    };

    if (startDateInput) startDateInput.addEventListener('change', validateDates);
    if (endDateInput) endDateInput.addEventListener('change', validateDates);

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            let isValid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            const packageName = document.getElementById('hiddenPackageName').value;

            // 1. Check if package is selected (for manual booking)
            if (!packageName) {
                isValid = false;
                alert('Please select a package first! ❌');
                const selectionBox = document.querySelector('.manual-selection');
                if (selectionBox) selectionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // 2. Check all required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid-custom');
                } else {
                    field.classList.remove('is-invalid-custom');
                }
            });

            // 3. Check date validity
            if (!validateDates()) {
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                // If package was the only missing thing, alert already shown. 
                // Otherwise, show generic error if fields are missing.
                const emptyFields = Array.from(requiredFields).filter(f => !f.value.trim());
                if (emptyFields.length > 0) {
                    alert('Please fill all required fields ❌');
                }
                return;
            }

            // Show loading state
            const submitBtn = bookingForm.querySelector('.btn-booking-submit');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
            submitBtn.disabled = true;
        });

        // Remove red border on input
        bookingForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('is-invalid-custom');
                }
            });
        });
    }
});
