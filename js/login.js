document.addEventListener('DOMContentLoaded', () => {
    // 1. Check URL for role parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    if (roleParam === 'buyer') {
        setRole('buyer');
    } else {
        setRole('farmer'); // Default
    }
});

let currentRole = 'farmer';

function setRole(role) {
    currentRole = role;
    
    // 1. Update UI Body Attribute (Controls CSS Colors)
    document.body.setAttribute('data-role', role);
    
    // 2. Update Button Active States
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-role="${role}"]`).classList.add('active');
    
    // 3. Update Visuals
    const visual = document.querySelector('.login-visual');
    const quote = document.getElementById('dynamic-quote');
    const submitBtn = document.getElementById('submitBtn');
    
    if (role === 'farmer') {
        visual.classList.remove('buyer-theme');
        visual.classList.add('farmer-theme');
        quote.innerText = '"Zero Burn, Max Earn."';
        submitBtn.innerText = 'Login as Farmer';
        submitBtn.style.background = '#10b981'; // Green
    } else {
        visual.classList.remove('farmer-theme');
        visual.classList.add('buyer-theme');
        quote.innerText = '"Sourcing Clean Energy."';
        submitBtn.innerText = 'Login as Buyer';
        submitBtn.style.background = '#3b82f6'; // Blue
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    
    // Loading Animation
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        // Redirect Logic
        if (currentRole === 'farmer') {
            window.location.href = 'dashboard-farmer.html';
        } else {
            window.location.href = 'dashboard-buyer.html';
        }
    }, 1500); // 1.5s Fake delay
}