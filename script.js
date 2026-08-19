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
          card.style.display = 'block';
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
 * 5. WATERCOLOR HYDRODYNAMIC HERO DRIFT (6 FLOWERS + 6 WASHES)
 * ─────────────────────────────────────────────────────────────
 */
(function initTabebuiaWaterEngine() {
  const elements = [
    // 8 Floating White Luminous Flowers (Well-spaced, no clumping)
    { sel: '.fl1', type: 'flower', initX: 680,  initY: 340, wanderX: 65, wanderY: 45, speed: 0.00030, radius: 85, rotFactor: 16, bobFreq: 0.0009 },
    { sel: '.fl2', type: 'flower', initX: 960,  initY: 400, wanderX: 60, wanderY: 40, speed: 0.00028, radius: 75, rotFactor: 14, bobFreq: 0.0008 },
    { sel: '.fl3', type: 'flower', initX: 1140, initY: 170, wanderX: 58, wanderY: 40, speed: 0.00029, radius: 80, rotFactor: 15, bobFreq: 0.0009 },
    { sel: '.fl4', type: 'flower', initX: 220,  initY: 460, wanderX: 55, wanderY: 38, speed: 0.00026, radius: 65, rotFactor: 12, bobFreq: 0.0008 },
    { sel: '.fl5', type: 'flower', initX: 500,  initY: 130, wanderX: 50, wanderY: 35, speed: 0.00027, radius: 72, rotFactor: 13, bobFreq: 0.0008 },
    { sel: '.fl6', type: 'flower', initX: 800,  initY: 200, wanderX: 52, wanderY: 38, speed: 0.00028, radius: 78, rotFactor: 14, bobFreq: 0.0009 },
    { sel: '.fl7', type: 'flower', initX: 350,  initY: 280, wanderX: 58, wanderY: 42, speed: 0.00026, radius: 68, rotFactor: 13, bobFreq: 0.0008 },
    { sel: '.fl8', type: 'flower', initX: 1240, initY: 460, wanderX: 62, wanderY: 44, speed: 0.00031, radius: 82, rotFactor: 15, bobFreq: 0.0009 },

    // 5 Loose Drifting Petals
    { sel: '.pt1', type: 'petal', initX: 740,  initY: 280, wanderX: 75, wanderY: 50, speed: 0.00038, radius: 35, rotFactor: 24, bobFreq: 0.0012 },
    { sel: '.pt2', type: 'petal', initX: 1260, initY: 260, wanderX: 70, wanderY: 45, speed: 0.00035, radius: 30, rotFactor: 22, bobFreq: 0.0011 },
    { sel: '.pt3', type: 'petal', initX: 150,  initY: 340, wanderX: 65, wanderY: 40, speed: 0.00034, radius: 32, rotFactor: 20, bobFreq: 0.0010 },
    { sel: '.pt4', type: 'petal', initX: 600,  initY: 460, wanderX: 68, wanderY: 42, speed: 0.00036, radius: 28, rotFactor: 22, bobFreq: 0.0011 },
    { sel: '.pt5', type: 'petal', initX: 1040, initY: 100, wanderX: 72, wanderY: 48, speed: 0.00037, radius: 34, rotFactor: 25, bobFreq: 0.0012 },

    // 3 Water Ripple Sets
    { sel: '.rip1', type: 'ripple', initX: 280,  initY: 320, wanderX: 40, wanderY: 25, speed: 0.00018, radius: 180, rotFactor: 4, bobFreq: 0.0006 },
    { sel: '.rip2', type: 'ripple', initX: 1140, initY: 420, wanderX: 45, wanderY: 30, speed: 0.00020, radius: 160, rotFactor: 5, bobFreq: 0.0007 },
    { sel: '.rip3', type: 'ripple', initX: 740,  initY: 180, wanderX: 35, wanderY: 20, speed: 0.00016, radius: 140, rotFactor: 4, bobFreq: 0.0005 },

    // 5 Ambient Washes
    { sel: '.blob1', type: 'blob', initX: 300,  initY: 300, wanderX: 50, wanderY: 30, speed: 0.00013, radius: 350, rotFactor: 0, bobFreq: 0.0004 },
    { sel: '.blob2', type: 'blob', initX: 880,  initY: 180, wanderX: 55, wanderY: 35, speed: 0.00012, radius: 360, rotFactor: 0, bobFreq: 0.0004 },
    { sel: '.blob3', type: 'blob', initX: 1200, initY: 400, wanderX: 45, wanderY: 25, speed: 0.00011, radius: 330, rotFactor: 0, bobFreq: 0.0004 },
    { sel: '.blob4', type: 'blob', initX: 620,  initY: 520, wanderX: 45, wanderY: 25, speed: 0.00012, radius: 320, rotFactor: 0, bobFreq: 0.0004 },
    { sel: '.blob5', type: 'blob', initX: 100,  initY: 440, wanderX: 40, wanderY: 20, speed: 0.00011, radius: 300, rotFactor: 0, bobFreq: 0.0004 }
  ];

  const BOUNDS = { minX: 60, maxX: 1340, minY: 50, maxY: 600 };

  const activeItems = elements.map((item, idx) => {
    const el = document.querySelector(item.sel);
    if (!el) return null;

    const isBlob = item.type === 'blob';
    let targetEl = el;

    if (isBlob) {
      el.setAttribute('cx', '0');
      el.setAttribute('cy', '0');
    } else {
      targetEl = el.closest('g[transform]') || el;
      if (targetEl.hasAttribute('transform')) {
        targetEl.removeAttribute('transform');
      }
    }

    return {
      el: targetEl,
      innerEl: !isBlob && el !== targetEl ? el : null,
      type: item.type,
      baseX: item.initX,
      baseY: item.initY,
      x: item.initX,
      y: item.initY,
      prevX: item.initX,
      prevY: item.initY,
      rot: 0,
      wanderX: item.wanderX,
      wanderY: item.wanderY,
      speed: item.speed,
      bobFreq: item.bobFreq,
      rotFactor: item.rotFactor,
      radius: item.radius,
      phase: idx * 1.95 + Math.random() * 3,
      ripplePhase: idx * 1.6 + Math.random() * 3
    };
  }).filter(Boolean);

  function animate(currentTime) {
    activeItems.forEach(item => {
      const t = currentTime * item.speed;
      const rippleT = currentTime * item.bobFreq;

      const tideX = Math.sin(t + item.phase) * item.wanderX;
      const rippleX = Math.cos(rippleT * 0.8 + item.ripplePhase) * (item.wanderX * 0.18);

      const tideY = Math.cos(t * 0.85 + item.phase) * item.wanderY;
      const rippleY = Math.sin(rippleT * 1.05 + item.ripplePhase) * (item.wanderY * 0.20);

      let targetX = item.baseX + tideX + rippleX;
      let targetY = item.baseY + tideY + rippleY;

      targetX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, targetX));
      targetY = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, targetY));

      item.prevX = item.x;
      item.prevY = item.y;

      item.x += (targetX - item.x) * 0.025;
      item.y += (targetY - item.y) * 0.025;

      const vx = item.x - item.prevX;
      const vy = item.y - item.prevY;

      const scaleVariation = item.type === 'ripple' ? 0.05 : 0.018;
      const buoyancyScale = 1 + Math.sin(rippleT + item.phase) * scaleVariation;

      if (item.rotFactor > 0) {
        const flowAngle = Math.atan2(vy, vx) * (180 / Math.PI);
        const targetRot = Math.sin(t + item.phase) * item.rotFactor + (flowAngle * 0.04);
        item.rot += (targetRot - item.rot) * 0.02;
      }

      item.el.setAttribute('transform', `translate(${item.x.toFixed(2)}, ${item.y.toFixed(2)}) scale(${buoyancyScale.toFixed(3)})`);

      if (item.innerEl) {
        item.innerEl.setAttribute('transform', `rotate(${item.rot.toFixed(2)})`);
      }
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();