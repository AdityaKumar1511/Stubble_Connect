// --- Global Data Store Simulation ---
// In a real app, this comes from a database.
const dummyData = [
    { id: 1, crop: 'Paddy Straw', area: 5, price: 2500, lat: 30.7333, lng: 76.7794, dist: '2.5 km', owner: 'Ravi Singh' },
    { id: 2, crop: 'Wheat Stubble', area: 8, price: 3200, lat: 30.7100, lng: 76.8000, dist: '4.1 km', owner: 'Manpreet Kaur' },
    { id: 3, crop: 'Sugarcane', area: 12, price: 5000, lat: 30.7500, lng: 76.7500, dist: '6.0 km', owner: 'Gurmeet' },
];

// --- FARMER DASHBOARD LOGIC ---
if (document.getElementById('listing-form')) {
    
    // 1. Image Upload Preview
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewImg = document.getElementById('preview-img');
    const uploadContent = document.querySelector('.upload-content');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewImg.classList.remove('hidden');
                uploadContent.classList.add('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    // 2. Form Submission
    document.getElementById('listing-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show Success Modal
        const modal = document.getElementById('success-modal');
        modal.classList.remove('hidden');
        
        // Store data in LocalStorage (Simple simulation)
        const newListing = {
            crop: document.getElementById('crop-type').value,
            area: document.getElementById('area').value,
            price: document.getElementById('price').value,
            lat: 30.74 + (Math.random() * 0.05), // Random nearby loc
            lng: 76.78 + (Math.random() * 0.05)
        };
        
        // Get existing or init new
        const existing = JSON.parse(localStorage.getItem('paraliListings') || '[]');
        existing.push(newListing);
        localStorage.setItem('paraliListings', JSON.stringify(existing));
    });
}

function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
    // Reset form
    document.getElementById('listing-form').reset();
    document.getElementById('preview-img').classList.add('hidden');
    document.querySelector('.upload-content').classList.remove('hidden');
}


// --- BUYER DASHBOARD LOGIC (MAP) ---
if (document.getElementById('map')) {
    
    // 1. Initialize Leaflet Map (Centered on Chandigarh/Punjab for demo)
    const map = L.map('map').setView([30.7333, 76.7794], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    // 2. Custom Marker Icon
    const tractorIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2313/2313988.png', // Tractor Icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // 3. Load Data (Dummy + LocalStorage)
    const localData = JSON.parse(localStorage.getItem('paraliListings') || '[]');
    // Transform local data to match dummy format
    const formattedLocal = localData.map((item, index) => ({
        id: `loc-${index}`,
        crop: item.crop,
        area: item.area,
        price: item.price,
        lat: item.lat,
        lng: item.lng,
        dist: '1.2 km (New)',
        owner: 'You'
    }));

    const allListings = [...dummyData, ...formattedLocal];
    const listContainer = document.getElementById('listings-list');

    // 4. Render Markers & List
    allListings.forEach(farm => {
        // Add Marker to Map
        const marker = L.marker([farm.lat, farm.lng], {icon: tractorIcon}).addTo(map);
        marker.bindPopup(`<b>${farm.crop}</b><br>${farm.area} Acres<br>₹${farm.price}`);

        // Add Card to Sidebar
        const card = document.createElement('div');
        card.className = 'listing-card fade-up';
        card.innerHTML = `
            <div class="card-header">
                <span class="crop-badge">${farm.crop}</span>
                <span class="distance"><i class="fas fa-map-marker-alt"></i> ${farm.dist}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-size:0.9rem; color:#64748b;">Area: ${farm.area} Acres</div>
                    <div style="font-size:0.8rem; color:#94a3b8;">Owner: ${farm.owner}</div>
                </div>
                <div class="price-tag">₹${farm.price}</div>
            </div>
            <button class="btn-request" onclick="requestPickup(this)">Request Pickup</button>
        `;
        
        // Click card to fly to map location
        card.addEventListener('click', () => {
            map.flyTo([farm.lat, farm.lng], 14, { duration: 1.5 });
            marker.openPopup();
        });

        listContainer.appendChild(card);
    });
}

function requestPickup(btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.style.background = '#10b981'; // Green
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Request Sent';
        btn.disabled = true;
    }, 1500);
}
/* --- PLACE INSIDE THE BUYER DASHBOARD BLOCK --- */

// A. Mock Logistics Data (Shipments)
const shipments = [
    { 
        id: 'TRK-902', 
        driver: 'Rajesh Kumar', 
        from: 'Ropar Fields', 
        status: 'In Transit', 
        progress: 60, // % completed
        start: [30.7333, 76.7794], // Farm
        end: [30.7046, 76.7179]    // Factory (Mohali Ind. Area)
    },
    { 
        id: 'TRK-881', 
        driver: 'Sukhdev Singh', 
        from: 'Kharar Farm', 
        status: 'In Transit', 
        progress: 30,
        start: [30.7400, 76.6500], 
        end: [30.7046, 76.7179]
    },
    { 
        id: 'TRK-104', 
        driver: 'Amit Verma', 
        from: 'Zirakpur', 
        status: 'Arrived', 
        progress: 100,
        start: [30.6425, 76.8173], 
        end: [30.7046, 76.7179]
    }
];

// B. Tab Switching Logic
window.switchTab = function(tabName) {
    // 1. Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // 2. Switch Panel Content
    if (tabName === 'logistics') {
        document.getElementById('view-market').classList.add('hidden');
        document.getElementById('view-logistics').classList.remove('hidden');
        renderShipments(); // Load the list
        clearMap();        // Remove market markers
    } else {
        document.getElementById('view-market').classList.remove('hidden');
        document.getElementById('view-logistics').classList.add('hidden');
        // Reload Market Markers (You can wrap your previous marker logic in a function and call it here)
        location.reload(); // Simple way to reset to market view for this demo
    }
};

// C. Render Shipment List
function renderShipments() {
    const container = document.getElementById('logistics-list');
    container.innerHTML = '';

    shipments.forEach(ship => {
        const card = document.createElement('div');
        card.className = 'shipment-card fade-up';
        card.innerHTML = `
            <div class="shipment-header">
                <span>🚛 ${ship.id}</span>
                <span class="status-badge ${ship.status === 'In Transit' ? 'transit' : 'arrived'}">${ship.status}</span>
            </div>
            <div style="margin-bottom:5px; font-weight:bold;">${ship.driver}</div>
            <div class="route-info">
                <i class="fas fa-map-marker-alt"></i> ${ship.from} 
                <i class="fas fa-arrow-right" style="font-size:0.7rem"></i> 
                <i class="fas fa-industry"></i> Factory
            </div>
            <div style="width:100%; height:4px; background:#eee; margin-top:10px; border-radius:2px;">
                <div style="width:${ship.progress}%; height:100%; background:${ship.status === 'Arrived' ? '#10b981' : '#3b82f6'}; border-radius:2px;"></div>
            </div>
        `;
        
        // Add Click Event to Draw Route
        card.onclick = () => showRouteOnMap(ship, card);
        container.appendChild(card);
    });
}

// D. Draw Route Logic
let currentRouteLine = null;
let currentTruckMarker = null;

function showRouteOnMap(ship, cardElement) {
    // Highlight Active Card
    document.querySelectorAll('.shipment-card').forEach(c => c.classList.remove('active'));
    cardElement.classList.add('active');

    // Clear Previous Route
    if(currentRouteLine) map.removeLayer(currentRouteLine);
    if(currentTruckMarker) map.removeLayer(currentTruckMarker);

    // 1. Add Markers (Start & End)
    const farmIcon = L.divIcon({ html: '<i class="fas fa-seedling" style="color:green; font-size:24px;"></i>', className: 'marker-custom' });
    const factoryIcon = L.divIcon({ html: '<i class="fas fa-industry" style="color:blue; font-size:24px;"></i>', className: 'marker-custom' });

    L.marker(ship.start, {icon: farmIcon}).addTo(map).bindPopup(`<b>From:</b> ${ship.from}`);
    L.marker(ship.end, {icon: factoryIcon}).addTo(map).bindPopup("<b>To:</b> Your Factory");

    // 2. Draw Polyline (Route)
    const routePoints = [ship.start, ship.end];
    currentRouteLine = L.polyline(routePoints, {
        color: '#3b82f6',
        weight: 4,
        dashArray: '10, 10', // Dashed Line
        className: 'route-line-anim' // Animated CSS class
    }).addTo(map);

    // 3. Zoom to fit route
    map.fitBounds(currentRouteLine.getBounds(), {padding: [50, 50]});

    // 4. Add Moving Truck Icon
    const truckIcon = L.divIcon({ 
        html: '<i class="fas fa-truck" style="color:#1e40af; font-size:20px; background:white; padding:5px; border-radius:50%; border:2px solid #3b82f6;"></i>', 
        className: 'moving-truck',
        iconSize: [30, 30]
    });

    // Calculate position based on progress % (Simple Linear Interpolation)
    const lat = ship.start[0] + (ship.end[0] - ship.start[0]) * (ship.progress / 100);
    const lng = ship.start[1] + (ship.end[1] - ship.start[1]) * (ship.progress / 100);

    currentTruckMarker = L.marker([lat, lng], {icon: truckIcon}).addTo(map);
    
    // Simulate movement (Optional visual flair)
    if(ship.status === 'In Transit') {
        currentTruckMarker.bindPopup(`<b>${ship.driver}</b><br>Arriving in 20 mins`).openPopup();
    }
}

function clearMap() {
    // Helper to remove all layers except tiles (Simplified for demo)
    map.eachLayer((layer) => {
        if (!!layer.toGeoJSON) {
            map.removeLayer(layer);
        }
    });
}