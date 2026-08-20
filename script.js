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
 * 5. ATMOSPHERIC GAUSSIAN BLOB, CLOUD & LIQUID SUN DRIFT ENGINE
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

    // Glassy Organic Sun & Lens Flare Group
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
    // 🌊 Dynamic Watery Glass Caustic Ripple Physics
    if (turbulenceEl) {
      const baseFreqX = 0.012 + Math.sin(time * 0.00045) * 0.003;
      const baseFreqY = 0.018 + Math.cos(time * 0.00038) * 0.004;
      turbulenceEl.setAttribute('baseFrequency', `${baseFreqX.toFixed(5)} ${baseFreqY.toFixed(5)}`);
    }

    // 🌤️ Floating Atmospheric Drift for Sky, Clouds & Sun
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
 * 6. LIVE TIME, WEATHER & CELESTIAL SUN ENGINE (CUPERTINO FALLBACK)
 * ─────────────────────────────────────────────────────────────
 */
(function initLiveWeatherAndSun() {
  const DEFAULT_LAT = 37.3230;
  const DEFAULT_LON = -122.0322;
  const DEFAULT_CITY = 'Cupertino';

  const heroSection = document.getElementById('weather-hero');
  const b1 = document.getElementById('sky-blob-1');
  const b2 = document.getElementById('sky-blob-2');
  const b3 = document.getElementById('sky-blob-3');
  const b4 = document.getElementById('sky-blob-4');
  const b5 = document.getElementById('sky-blob-5');
  const sunGroup = document.getElementById('sky-sun-group');

  const locEl = document.getElementById('widget-location');
  const timeEl = document.getElementById('widget-time');
  const tempEl = document.getElementById('widget-temp');
  const condEl = document.getElementById('widget-condition');

  // Lighter & cleaner sky color themes
  const skyPalettes = {
    sunnyDay: {
      blobs: ['#e4f1fa', '#d2e8f7', '#eee1ee', '#e5f3fa', '#fbf0e1'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(230, 242, 253, 0.38) 0%, rgba(255, 251, 251, 0.98) 100%)',
      sunOpacity: '1.0'
    },
    goldenHour: {
      blobs: ['#f8ded0', '#f7d2e0', '#fdecd0', '#eee0ea', '#fce8dc'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(254, 240, 234, 0.42) 0%, rgba(255, 251, 251, 0.98) 100%)',
      sunOpacity: '0.85'
    },
    nightSky: {
      blobs: ['#ccd8ec', '#c0cee6', '#e0e5f4', '#b7c7e6', '#d3dcf0'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(215, 228, 248, 0.32) 0%, rgba(255, 251, 251, 0.98) 100%)',
      sunOpacity: '0.10'
    },
    overcast: {
      blobs: ['#e2edf6', '#dbe5ee', '#eff4f8', '#d6dfec', '#f2f6f9'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(230, 240, 248, 0.38) 0%, rgba(255, 251, 251, 0.98) 100%)',
      sunOpacity: '0.35'
    },
    rainyMist: {
      blobs: ['#d0e6ea', '#c4dde0', '#e0ecee', '#bed6d8', '#e8f2f3'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(208, 230, 234, 0.32) 0%, rgba(255, 251, 251, 0.98) 100%)',
      sunOpacity: '0.18'
    },
    snowSky: {
      blobs: ['#edf4fa', '#e4eef7', '#f4f8fc', '#dcebf8', '#f8fafe'],
      heroBg: 'radial-gradient(120% 80% at 50% 20%, rgba(240, 247, 253, 0.45) 0%, rgba(255, 251, 251, 0.98) 100%)',
      sunOpacity: '0.25'
    }
  };

  let clockTimer = null;
  function updateClock(timeZone) {
    if (clockTimer) clearInterval(clockTimer);
    const update = () => {
      const now = new Date();
      const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timeZone || undefined
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
    return { label: 'Overcast', key: 'cloudy' };
  }

  function applySkyPalette(paletteKey) {
    const p = skyPalettes[paletteKey] || skyPalettes.sunnyDay;
    if (heroSection) heroSection.style.background = p.heroBg;
    if (b1) b1.setAttribute('fill', p.blobs[0]);
    if (b2) b2.setAttribute('fill', p.blobs[1]);
    if (b3) b3.setAttribute('fill', p.blobs[2]);
    if (b4) b4.setAttribute('fill', p.blobs[3]);
    if (b5) b5.setAttribute('fill', p.blobs[4]);
    if (sunGroup) sunGroup.style.opacity = p.sunOpacity;
  }

  function determineSkyTheme(weatherKey, hour) {
    if (hour >= 20 || hour < 6) return 'nightSky';
    if (hour >= 17 && hour < 20) return 'goldenHour';
    if (weatherKey === 'rain') return 'rainyMist';
    if (weatherKey === 'snow') return 'snowSky';
    if (weatherKey === 'cloudy') return 'overcast';
    return 'sunnyDay';
  }

  async function fetchLiveWeatherData(lat, lon, cityName) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m&temperature_unit=fahrenheit&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      const timeZone = data.timezone;
      updateClock(timeZone);

      const currentCode = data.current.weather_code;
      const currentTemp = Math.round(data.current.temperature_2m);
      const condition = interpretWeatherCode(currentCode);

      if (locEl) locEl.textContent = cityName;
      if (tempEl) tempEl.textContent = `${currentTemp}°F`;
      if (condEl) condEl.textContent = condition.label;

      const localHour = new Date(new Date().toLocaleString('en-US', { timeZone })).getHours();
      const themeKey = determineSkyTheme(condition.key, localHour);
      applySkyPalette(themeKey);
    } catch (err) {
      if (locEl) locEl.textContent = cityName || DEFAULT_CITY;
      if (tempEl) tempEl.textContent = '72°F';
      if (condEl) condEl.textContent = 'Clear Sky';
      updateClock('America/Los_Angeles');
      applySkyPalette('sunnyDay');
    }
  }

  async function resolveCityName(lat, lon) {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await res.json();
      return data.city || data.locality || data.principalSubdivision || 'Your Location';
    } catch {
      return 'Your Location';
    }
  }

  // Geolocation handling with generous timeout and fallback to Cupertino
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const city = await resolveCityName(lat, lon);
        fetchLiveWeatherData(lat, lon, city);
      },
      () => {
        // Fallback exclusively when user denies permission or location is unavailable
        fetchLiveWeatherData(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY);
      },
      { 
        enableHighAccuracy: false, 
        timeout: 10000, 
        maximumAge: 300000 
      }
    );
  } else {
    fetchLiveWeatherData(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY);
  }
})();