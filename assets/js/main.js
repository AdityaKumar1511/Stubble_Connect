/*
  Stubble-Connect Frontend Interactivity
  - Theme toggle with persistence (localStorage)
  - Sticky navbar with animated underline (scroll-spy across sections)
  - Smooth scrolling with offset handling for fixed navbar
  - Farmer page: image upload and simple estimation logic
  - Buyer page: filters with dummy data and selection summary
  - Logistics page: dummy route heuristic and summary updates
*/

/* ---------- Theme: load persisted and toggle across pages ---------- */
(function initTheme() {
  const saved = localStorage.getItem('stubble-theme');
  const html = document.documentElement;
  if (saved === 'dark' || saved === 'light') {
    html.setAttribute('data-theme', saved);
  } else {
    html.setAttribute('data-theme', 'light');
  }

  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = html.getAttribute('data-theme') === 'dark' ? 'Light Mode' : 'Dark Mode';
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('stubble-theme', next);
      toggleBtn.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
  }
})();

/* ---------- Mobile navbar toggle ---------- */
(function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
})();

/* ---------- Smooth scrolling with fixed navbar offset ---------- */
/*
  We use scrollIntoView({ behavior: 'smooth', block: 'start' }) and adjust with an offset by adding padding-top on sections
  The CSS hero has top padding to account for navbar height. For other sections, we account by scrolling then adjusting window.scrollBy
*/
(function initSmoothScroll() {
  const navLinks = document.querySelectorAll('[data-scroll]');
  const navbar = document.querySelector('.navbar');

  function smoothScrollTo(target) {
    const section = document.querySelector(target);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top;
    const navHeight = navbar ? navbar.offsetHeight : 0;

    // Scroll smoothly to calculated position considering sticky navbar offset
    window.scrollTo({ top: offsetTop - (navHeight - 1), behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
      }
      // Close mobile menu after selection
      const linksMenu = document.querySelector('.nav-links');
      if (linksMenu && linksMenu.classList.contains('open')) {
        linksMenu.classList.remove('open');
      }
    });
  });
})();

/* ---------- Scroll-Spy + Animated underline ---------- */
(function initScrollSpy() {
  const underline = document.querySelector('.nav-underline');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sectionIds = navLinks
    .map(l => l.getAttribute('href'))
    .filter(h => h && h.startsWith('#'));

  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

  function setUnderlineTo(el) {
    if (!underline || !el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = underline.offsetParent.getBoundingClientRect();
    const left = rect.left - parentRect.left;
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${left}px`;
  }

  function onScroll() {
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    let activeLink = null;
    sections.forEach((sec, idx) => {
      const top = sec.getBoundingClientRect().top - navHeight - 10;
      if (top <= 0) activeLink = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    });
    if (activeLink) {
      navLinks.forEach(l => l.classList.remove('active'));
      activeLink.classList.add('active');
      setUnderlineTo(activeLink);
    }
  }

  // Initialize underline under first active link
  const initialActive = document.querySelector('.nav-link.active') || navLinks[0];
  setUnderlineTo(initialActive);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => setUnderlineTo(document.querySelector('.nav-link.active') || navLinks[0]));
})();

/* ---------- Farmer page logic ---------- */
/*
  Estimations are intentionally simple:
  - Base payout: ₹150 per acre (from screenshots)
  - Estimated stubble tons per acre: 1.2 (dummy factor)
  - Carbon credits per acre: 0.5 tCO2e (dummy factor)
*/
(function initFarmer() {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fieldImage');
  const preview = document.getElementById('fieldPreview');
  const calcBtn = document.getElementById('calcPayout');
  const areaInput = document.getElementById('fieldArea');

  const estStubble = document.getElementById('estStubble');
  const estPayout = document.getElementById('estPayout');
  const estCarbon = document.getElementById('estCarbon');

  if (uploadBox && fileInput && preview) {
    uploadBox.addEventListener('click', () => fileInput.click());
    uploadBox.addEventListener('keypress', (e) => { if (e.key === 'Enter') fileInput.click(); });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      // Basic size check client-side
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Max 5MB.');
        fileInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => { preview.src = e.target.result; };
      reader.readAsDataURL(file);
    });
  }

  if (calcBtn && areaInput && estStubble && estPayout && estCarbon) {
    calcBtn.addEventListener('click', () => {
      const acres = parseFloat(areaInput.value || '0');
      const tonsPerAcre = 1.2; // dummy factor
      const carbonPerAcre = 0.5; // dummy factor
      const ratePerAcre = 150; // ₹

      const stubble = Math.max(0, acres * tonsPerAcre);
      const payout = Math.max(0, Math.round(acres * ratePerAcre));
      const carbon = Math.max(0, parseFloat((acres * carbonPerAcre).toFixed(2)));

      estStubble.textContent = stubble.toFixed(1);
      estPayout.textContent = payout.toString();
      estCarbon.textContent = carbon.toString();
    });
  }
})();

/* ---------- Buyer page logic ---------- */
(function initBuyer() {
  const farmCards = document.getElementById('farmCards');
  if (!farmCards) return;

  const minQty = document.getElementById('minQty');
  const maxDist = document.getElementById('maxDist');
  const onlyVerified = document.getElementById('onlyVerified');

  const minQtyVal = document.getElementById('minQtyVal');
  const maxDistVal = document.getElementById('maxDistVal');

  const selectedCount = document.getElementById('selectedCount');
  const selectedArea = document.getElementById('selectedArea');
  const selectedCost = document.getElementById('selectedCost');
  const requestPickup = document.getElementById('requestPickup');

  // Dummy farm data (mirrors screenshots)
  const RATE_PER_ACRE = 150;
  const farms = [
    { id: 1, name: 'Singh Farm', acres: 40, distance: 8, verified: true },
    { id: 2, name: 'Kumar Farm', acres: 15, distance: 3, verified: true },
    { id: 3, name: 'Patel Farm', acres: 60, distance: 12, verified: false },
    { id: 4, name: 'Verma Farm', acres: 35, distance: 7, verified: true },
    { id: 5, name: 'Sharma Farm', acres: 20, distance: 15, verified: false },
    { id: 6, name: 'Rajesh Farm', acres: 25, distance: 5, verified: true },
  ];

  const selection = new Set();

  function renderFarms() {
    const minQ = parseInt(minQty.value, 10);
    const maxD = parseInt(maxDist.value, 10);
    const filterVerified = !!onlyVerified.checked;

    minQtyVal.textContent = minQ.toString();
    maxDistVal.textContent = maxD.toString();

    const filtered = farms.filter(f => 
      f.acres >= minQ && f.distance <= maxD && (!filterVerified || f.verified)
    );

    farmCards.innerHTML = '';
    filtered.forEach(f => {
      const card = document.createElement('div');
      card.className = 'farm-card';

      const left = document.createElement('div');
      left.innerHTML = `
        <strong>${f.name}</strong>
        <div class="farm-meta">${f.acres} acres • ${f.distance} km away • ₹${f.acres * RATE_PER_ACRE} (₹${RATE_PER_ACRE}/acre)</div>
      `;

      const right = document.createElement('div');
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = f.verified ? 'Verified' : 'Unverified';

      const selectBtn = document.createElement('button');
      selectBtn.className = 'btn btn-outline';
      const isSelected = selection.has(f.id);
      selectBtn.textContent = isSelected ? 'Remove' : 'Select';
      selectBtn.addEventListener('click', () => {
        if (selection.has(f.id)) selection.delete(f.id);
        else selection.add(f.id);
        updateSummary();
        renderFarms(); // re-render to update button state
      });

      right.style.display = 'inline-flex';
      right.style.alignItems = 'center';
      right.style.gap = '8px';
      right.appendChild(badge);
      right.appendChild(selectBtn);

      card.appendChild(left);
      card.appendChild(right);

      farmCards.appendChild(card);
    });

    updateSummary();
  }

  function updateSummary() {
    const picked = farms.filter(f => selection.has(f.id));
    const count = picked.length;
    const area = picked.reduce((sum, f) => sum + f.acres, 0);
    const cost = picked.reduce((sum, f) => sum + f.acres * RATE_PER_ACRE, 0);

    selectedCount.textContent = count.toString();
    selectedArea.textContent = area.toString();
    selectedCost.textContent = cost.toString();
    requestPickup.textContent = `Request pickup (${count})`;
  }

  [minQty, maxDist, onlyVerified].forEach(ctrl => {
    if (!ctrl) return;
    ctrl.addEventListener('input', renderFarms);
    ctrl.addEventListener('change', renderFarms);
  });

  requestPickup?.addEventListener('click', () => {
    const count = selection.size;
    if (count === 0) {
      alert('Select at least one farm to request pickup.');
      return;
    }
    alert(`Pickup requested for ${count} farm(s). This is a demo—no backend calls are made.`);
  });

  renderFarms();
})();

/* ---------- Logistics page: dummy route summary + re-optimize ---------- */
(function initLogistics() {
  const sumDistance = document.getElementById('sumDistance');
  const sumFuel = document.getElementById('sumFuel');
  const sumCO2 = document.getElementById('sumCO2');
  const sumPoints = document.getElementById('sumPoints');
  const routeStops = document.getElementById('routeStops');
  const reoptimizeBtn = document.getElementById('reoptimizeBtn');

  if (!routeStops) return;

  // Dummy stops
  let stops = [
    { name: 'Singh Farm', location: 'Kharar, India', acres: 40 },
    { name: 'Verma Farm', location: 'Mullanpur, India', acres: 35 },
    { name: 'Industry Plant', location: 'Ludhiana, India', acres: 0 },
  ];

  function renderStops() {
    routeStops.innerHTML = '';
    stops.forEach((s, i) => {
      const item = document.createElement('div');
      item.className = 'stop-item';
      item.innerHTML = `
        <span><strong>${i === stops.length - 1 ? 'Destination' : 'Pickup ' + (i+1)}</strong>: ${s.name} — ${s.location}</span>
        <span>${s.acres ? s.acres + ' acres' : ''}</span>
      `;
      routeStops.appendChild(item);
    });
    sumPoints.textContent = (stops.length - 1).toString();
  }

  /* 
    Simple heuristic for demo:
    - Randomize pickup order to simulate re-optimization
    - Recompute distance, fuel and CO2 with dummy factors
    Assumptions:
    - Distance changes ±10% randomly
    - Fuel economy: 10 km/L
    - CO2 factor: 2.35 kg/L diesel
  */
  function recomputeSummary() {
    const baseDistance = 128;
    const variability = 0.1;
    const change = (Math.random() * variability * 2) - variability;
    const distance = Math.max(60, Math.round(baseDistance * (1 + change)));

    const fuelEconomyKmPerL = 10;
    const fuel = parseFloat((distance / fuelEconomyKmPerL).toFixed(1));
    const co2PerL = 2.35;
    const co2 = parseFloat((fuel * co2PerL).toFixed(1));

    sumDistance.textContent = distance.toString();
    sumFuel.textContent = fuel.toString();
    sumCO2.textContent = co2.toString();
  }

  reoptimizeBtn?.addEventListener('click', () => {
    // Randomize pickups (keep destination last)
    const pickups = stops.slice(0, -1);
    pickups.sort(() => Math.random() - 0.5);
    stops = [...pickups, stops[stops.length - 1]];

    renderStops();
    recomputeSummary();
  });

  renderStops();
  recomputeSummary();
})();