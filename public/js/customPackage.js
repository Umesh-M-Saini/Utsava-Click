/* public/js/customPackage.js */

document.addEventListener('DOMContentLoaded', () => {
    const services = [
        { id: 'trad_photo', name: 'Traditional Photo', price: 8000, icon: 'bi-camera' },
        { id: 'trad_video', name: 'Traditional Video', price: 8000, icon: 'bi-camera-video' },
        { id: 'candid_photo', name: 'Candid Photography', price: 15000, icon: 'bi-stars' },
        { id: 'cinematic_video', name: 'Cinematic Video', price: 15000, icon: 'bi-film' },
        { id: 'drone_shoot', name: 'Drone Shoot', price: 10000, icon: 'bi-send' },
        { id: 'fpv_drone', name: 'FPV Drone', price: 20000, icon: 'bi-rocket-takeoff' },
        { id: 'album_30p', name: '30 Page Album', price: 25000, icon: 'bi-book' },
        { id: 'edited_video_1h', name: 'Edited Video (1 hour)', price: 5000, icon: 'bi-scissors' },
        { id: 'reel', name: 'Reel', price: 2000, icon: 'bi-play-circle' },
        { id: 'led_wall', name: 'LED Wall Screen', price: 20000, icon: 'bi-tv' }
    ];

    let selectedServices = [];
    let totalPrice = 0;
    let numDays = 1;

    const servicesGrid = document.getElementById('servicesGrid');
    const selectedItemsList = document.getElementById('selectedItemsList');
    const totalAmount = document.getElementById('totalAmount');
    const proceedBtn = document.getElementById('proceedBtn');
    const numDaysInput = document.getElementById('numDays');
    const increaseDaysBtn = document.getElementById('increaseDays');
    const decreaseDaysBtn = document.getElementById('decreaseDays');

    // Number of Days Handlers
    increaseDaysBtn.addEventListener('click', () => {
        numDays++;
        numDaysInput.value = numDays;
        updateUI();
    });

    decreaseDaysBtn.addEventListener('click', () => {
        if (numDays > 1) {
            numDays--;
            numDaysInput.value = numDays;
            updateUI();
        }
    });

    // Render Services Grid
    function renderServices() {
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card ${selectedServices.find(s => s.id === service.id) ? 'selected' : ''}" 
                 onclick="toggleService('${service.id}')">
                <div class="service-icon"><i class="bi ${service.icon}"></i></div>
                <div class="service-name">${service.name}</div>
                <div class="service-price">₹ ${service.price.toLocaleString('en-IN')} <span>/ day</span></div>
                <div class="add-btn"><i class="bi bi-plus"></i></div>
            </div>
        `).join('');
    }

    // Toggle Service Selection
    window.toggleService = (serviceId) => {
        const service = services.find(s => s.id === serviceId);
        const index = selectedServices.findIndex(s => s.id === serviceId);

        if (index === -1) {
            selectedServices.push(service);
        } else {
            selectedServices.splice(index, 1);
        }

        updateUI();
    };

    // Update the Summary UI and Total
    function updateUI() {
        // Update Grid Selection States
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            const serviceId = services[index].id;
            if (selectedServices.find(s => s.id === serviceId)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Update Summary List
        if (selectedServices.length === 0) {
            selectedItemsList.innerHTML = '<div class="empty-message">No services selected yet</div>';
            totalPrice = 0;
            proceedBtn.disabled = true;
        } else {
            selectedItemsList.innerHTML = selectedServices.map(item => `
                <li class="selected-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">₹ ${item.price.toLocaleString('en-IN')}</span>
                </li>
            `).join('');
            
            const subtotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
            totalPrice = subtotal * numDays;
            proceedBtn.disabled = false;
        }

        // Update Total Amount
        totalAmount.textContent = `₹ ${totalPrice.toLocaleString('en-IN')}`;
    }

    // Handle Proceed Button Click
    proceedBtn.addEventListener('click', () => {
        if (selectedServices.length === 0) return;

        // Pass data to booking page via session or URL
        const packageData = {
            services: selectedServices.map(s => s.name),
            totalPrice: totalPrice,
            numDays: numDays,
            isCustom: true
        };
        
        // Redirect with query params for the new booking system
        const servicesParam = encodeURIComponent(packageData.services.join(','));
        window.location.href = `/booking?services=${servicesParam}&total=${totalPrice}`;
    });

    // Initialize
    renderServices();
    updateUI();
});
