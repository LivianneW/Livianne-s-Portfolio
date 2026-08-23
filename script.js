/**
 * ─────────────────────────────────────────────────────────────
 * 1. WORK GALLERY FILTERING
 * ─────────────────────────────────────────────────────────────
 */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

if (filterBtns.length > 0 && workCards.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.filter-btn.active');
      if (activeBtn) activeBtn.classList.remove('active');
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      workCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat') || card.getAttribute('data-categories') || '';
        if (filterValue === 'all' || cardCat.includes(filterValue)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * ─────────────────────────────────────────────────────────────
 * 2. GLOBAL BACK TO TOP SCROLL ACTION
 * ─────────────────────────────────────────────────────────────
 */
const scrollUpBtn = document.getElementById('scrollUpBtn') || document.querySelector('.scroll-up-btn');
if (scrollUpBtn) {
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * ─────────────────────────────────────────────────────────────
 * 3. SUBDIRECTORY HEADER NAVIGATION
 * ─────────────────────────────────────────────────────────────
 */
const headerBrand = document.querySelector('.site-brand') || document.querySelector('.header h1');
if (headerBrand && window.location.pathname.includes('/pages/')) {
  headerBrand.style.cursor = 'pointer';
  headerBrand.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../index.html';
  });
}

/**
 * ─────────────────────────────────────────────────────────────
 * 4. MOBILE / PANEL OVERLAY CONTROLS
 * ─────────────────────────────────────────────────────────────
 */
const hamburgerMenu = document.querySelector('.hamburger-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuPanel = document.querySelector('.menu-panel');
const closeMenu = document.querySelector('.close-menu');

if (hamburgerMenu && menuOverlay && menuPanel) {
  const toggleMenu = () => {
    menuOverlay.classList.toggle('active');
    menuPanel.classList.toggle('active');
  };

  const hideMenu = () => {
    menuOverlay.classList.remove('active');
    menuPanel.classList.remove('active');
  };

  hamburgerMenu.addEventListener('click', toggleMenu);
  if (closeMenu) closeMenu.addEventListener('click', hideMenu);
  menuOverlay.addEventListener('click', hideMenu);
}

/**
 * ─────────────────────────────────────────────────────────────
 * 5. ATMOSPHERIC GAUSSIAN BLOB, CLOUD & CELESTIAL DRIFT ENGINE
 * ─────────────────────────────────────────────────────────────
 */
(function initAtmosphericBlobDrift() {
  const turbulenceEl = document.getElementById('sun-water-turbulence');
  const isMobile = window.innerWidth <= 768;

  const driftElements = [
    // Sky ambient color pools
    { sel: '#sky-blob-1', initX: 280,  initY: 220, wanderX: 45, wanderY: 30, speed: 0.00016, bobFreq: 0.0006, isSun: false },
    { sel: '#sky-blob-2', initX: 820,  initY: 160, wanderX: 40, wanderY: 25, speed: 0.00014, bobFreq: 0.0005, isSun: false },
    { sel: '#sky-blob-3', initX: 1180, initY: 320, wanderX: 35, wanderY: 25, speed: 0.00013, bobFreq: 0.0005, isSun: false },
    { sel: '#sky-blob-4', initX: 580,  initY: 480, wanderX: 40, wanderY: 25, speed: 0.00015, bobFreq: 0.0006, isSun: false },
    { sel: '#sky-blob-5', initX: 120,  initY: 440, wanderX: 35, wanderY: 20, speed: 0.00014, bobFreq: 0.0005, isSun: false },
    
    // Soft floating clouds
    { sel: '.cloud-cluster-1', initX: 1140, initY: 470, wanderX: 25, wanderY: 12, speed: 0.00010, bobFreq: 0.0004, isSun: true },
    { sel: '.cloud-cluster-2', initX: 740,  initY: 290, wanderX: 30, wanderY: 15, speed: 0.00011, bobFreq: 0.0004, isSun: true },
    { sel: '.cloud-cluster-3', initX: 230,  initY: 130, wanderX: 20, wanderY: 10, speed: 0.00009, bobFreq: 0.0003, isSun: true },

    // Glassy Organic Sun/Moon & Lens Flare Group
    { sel: '#sky-sun-group', initX: isMobile ? -260 : 0, initY: isMobile ? -30 : 0, wanderX: 12, wanderY: 8, speed: 0.00018, bobFreq: 0.0008, isSun: true }
  ];

  const activeItems = driftElements.map((item, idx) => {
    const el = document.querySelector(item.sel);
    if (!el) return null;
    
    if (!item.isSun) {
      el.setAttribute('cx', '0');
      el.setAttribute('cy', '0');
    }

    return {
      el,
      isSun: item.isSun,
      baseX: item.initX,
      baseY: item.initY,
      x: item.initX,
      y: item.initY,
      wanderX: item.wanderX,
      wanderY: item.wanderY,
      speed: item.speed,
      bobFreq: item.bobFreq,
      phase: idx * 1.8 + 1.2
    };
  }).filter(Boolean);

  function animate(time) {
    if (turbulenceEl) {
      const baseFreqX = 0.012 + Math.sin(time * 0.00045) * 0.003;
      const baseFreqY = 0.018 + Math.cos(time * 0.00038) * 0.004;
      turbulenceEl.setAttribute('baseFrequency', `${baseFreqX.toFixed(5)} ${baseFreqY.toFixed(5)}`);
    }

    activeItems.forEach(b => {
      const t = time * b.speed;
      const bt = time * b.bobFreq;

      const targetX = b.baseX + Math.sin(t + b.phase) * b.wanderX + Math.cos(bt * 0.8) * 5;
      const targetY = b.baseY + Math.cos(t * 0.9 + b.phase) * b.wanderY + Math.sin(bt * 0.9) * 5;

      b.x += (targetX - b.x) * 0.02;
      b.y += (targetY - b.y) * 0.02;

      b.el.setAttribute('transform', `translate(${b.x.toFixed(2)}, ${b.y.toFixed(2)})`);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

/**
 * ─────────────────────────────────────────────────────────────
 * 6. LOS ANGELES WEATHER & DAY/NIGHT SKY ENGINE
 * ─────────────────────────────────────────────────────────────
 */
(function initLosAngelesWeather() {
  const LA_LAT = 34.0549;
  const LA_LON = -118.2426;
  const LA_TIMEZONE = 'America/Los_Angeles';

  const heroSection = document.getElementById('weather-hero');
  const b1 = document.getElementById('sky-blob-1');
  const b2 = document.getElementById('sky-blob-2');
  const b3 = document.getElementById('sky-blob-3');
  const b4 = document.getElementById('sky-blob-4');
  const b5 = document.getElementById('sky-blob-5');
  
  const sunGroup = document.getElementById('sky-sun-group');
  const starsGroup = document.getElementById('sky-stars-group');
  const haloEl = document.getElementById('celestial-halo');
  const bloomEl = document.getElementById('celestial-bloom');
  const bodyEl = document.getElementById('celestial-body');
  const discEl = document.getElementById('celestial-disc');
  const glareRays = document.getElementById('sun-glare-rays');
  const lensFlare = document.getElementById('lens-flare-elements');

  const locEl = document.getElementById('widget-location');
  const timeEl = document.getElementById('widget-time');
  const tempEl = document.getElementById('widget-temp');
  const condEl = document.getElementById('widget-condition');

  // Palette schemes for day, sunset, and nighttime in Los Angeles
  const skyPalettes = {
    sunnyDay: {
      blobs: ['#e4f1fa', '#d2e8f7', '#eee1ee', '#e5f3fa', '#fbf0e1'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(230, 242, 253, 0.38) 0%, rgba(255, 251, 251, 0.98) 100%)',
      isNight: false
    },
    goldenHour: {
      blobs: ['#f8ded0', '#f7d2e0', '#fdecd0', '#eee0ea', '#fce8dc'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(254, 240, 234, 0.42) 0%, rgba(255, 251, 251, 0.98) 100%)',
      isNight: false
    },
    nightSky: {
      // Atmospheric midnight blue & indigo wash
      blobs: ['#283b5e', '#1c2944', '#3d385e', '#1b2a4a', '#243354'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(32, 45, 74, 0.35) 0%, rgba(255, 251, 251, 0.98) 100%)',
      isNight: true
    },
    overcast: {
      blobs: ['#e2edf6', '#dbe5ee', '#eff4f8', '#d6dfec', '#f2f6f9'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(230, 240, 248, 0.38) 0%, rgba(255, 251, 251, 0.98) 100%)',
      isNight: false
    },
    rainyMist: {
      blobs: ['#d0e6ea', '#c4dde0', '#e0ecee', '#bed6d8', '#e8f2f3'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(208, 230, 234, 0.32) 0%, rgba(255, 251, 251, 0.98) 100%)',
      isNight: false
    }
  };

  let clockTimer = null;
  function updateLAClock() {
    if (clockTimer) clearInterval(clockTimer);
    const update = () => {
      const now = new Date();
      const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: LA_TIMEZONE
      };
      if (timeEl) timeEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    };
    update();
    clockTimer = setInterval(update, 20000);
  }

  function interpretWeatherCode(code) {
    if (code === 0) return { label: 'Clear Sky', key: 'clear' };
    if (code === 1) return { label: 'Mainly Clear', key: 'clear' };
    if (code === 2) return { label: 'Partly Cloudy', key: 'cloudy' };
    if (code === 3 || code === 45 || code === 48) return { label: 'Overcast', key: 'cloudy' };
    if (code >= 51 && code <= 67) return { label: 'Drizzle', key: 'rain' };
    if (code >= 71 && code <= 77) return { label: 'Snow', key: 'snow' };
    if (code >= 80 && code <= 82) return { label: 'Showers', key: 'rain' };
    return { label: 'Clear Sky', key: 'clear' };
  }

  function applySkyPalette(paletteKey) {
    const p = skyPalettes[paletteKey] || skyPalettes.sunnyDay;
    if (heroSection) heroSection.style.background = p.heroBg;
    if (b1) b1.setAttribute('fill', p.blobs[0]);
    if (b2) b2.setAttribute('fill', p.blobs[1]);
    if (b3) b3.setAttribute('fill', p.blobs[2]);
    if (b4) b4.setAttribute('fill', p.blobs[3]);
    if (b5) b5.setAttribute('fill', p.blobs[4]);

    // 🌙 Switch between Sun and Moon visuals
    if (p.isNight) {
      if (starsGroup) starsGroup.setAttribute('opacity', '0.85');
      if (haloEl) haloEl.setAttribute('fill', 'url(#moon-ambient-halo)');
      if (bloomEl) bloomEl.setAttribute('fill', 'url(#moon-glow-grad)');
      if (bodyEl) bodyEl.setAttribute('fill', 'url(#moon-glow-grad)');
      if (discEl) discEl.setAttribute('fill', 'url(#moon-glow-grad)');
      if (glareRays) glareRays.style.display = 'none';
      if (lensFlare) lensFlare.style.opacity = '0.15';
    } else {
      if (starsGroup) starsGroup.setAttribute('opacity', '0');
      if (haloEl) haloEl.setAttribute('fill', 'url(#glare-ambient-halo)');
      if (bloomEl) bloomEl.setAttribute('fill', 'url(#sun-glow-grad)');
      if (bodyEl) bodyEl.setAttribute('fill', 'url(#sun-glow-grad)');
      if (discEl) discEl.setAttribute('fill', 'url(#sun-glow-grad)');
      if (glareRays) glareRays.style.display = 'block';
      if (lensFlare) lensFlare.style.opacity = '1';
    }
  }

  function determineLATargetTheme(weatherKey, hour) {
    // Night hours in LA (8 PM to 6 AM)
    if (hour >= 20 || hour < 6) return 'nightSky';
    // Sunset / Golden hour (5 PM to 8 PM)
    if (hour >= 17 && hour < 20) return 'goldenHour';
    if (weatherKey === 'rain') return 'rainyMist';
    if (weatherKey === 'cloudy') return 'overcast';
    return 'sunnyDay';
  }

  async function fetchLAWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LA_LAT}&longitude=${LA_LON}&current=weather_code,temperature_2m&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles`;
      const res = await fetch(url);
      const data = await res.json();

      updateLAClock();

      const currentCode = data.current.weather_code;
      const currentTemp = Math.round(data.current.temperature_2m);
      const condition = interpretWeatherCode(currentCode);

      if (locEl) locEl.textContent = 'Los Angeles';
      if (tempEl) tempEl.textContent = `${currentTemp}°F`;
      if (condEl) condEl.textContent = condition.label;

      const laHour = new Date(new Date().toLocaleString('en-US', { timeZone: LA_TIMEZONE })).getHours();
      const themeKey = determineLATargetTheme(condition.key, laHour);
      applySkyPalette(themeKey);
    } catch (err) {
      if (locEl) locEl.textContent = 'Los Angeles';
      if (tempEl) tempEl.textContent = '75°F';
      if (condEl) condEl.textContent = 'Clear Sky';
      updateLAClock();
      applySkyPalette('sunnyDay');
    }
  }

  fetchLAWeather();
})();