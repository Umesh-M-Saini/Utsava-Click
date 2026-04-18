/* public/js/package3.js */

document.addEventListener('DOMContentLoaded', function() {
    const locationSelect = document.getElementById('locationSelect');
    const totalPriceElement = document.getElementById('totalPrice');
    const basePrice = 149000;
    const travelCost = 5000; // Example travel cost

    function updatePrice() {
        const selectedLocation = locationSelect.value;
        let total = basePrice;

        if (selectedLocation !== 'Rajasthan' && selectedLocation !== 'Gujarat') {
            total += travelCost;
        }

        // Format price with commas
        const formattedPrice = total.toLocaleString('en-IN');
        totalPriceElement.textContent = `₹ ${formattedPrice}`;
    }

    if (locationSelect) {
        locationSelect.addEventListener('change', updatePrice);
        // Initial call to set price correctly on load
        updatePrice();
    }
});
