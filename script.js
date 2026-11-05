// filter butons

const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

function applyProjectFilter(filterValue) {
  workCards.forEach(card => {
    const rawCat = card.getAttribute('data-cat') || card.getAttribute('data-categories') || '';
    const categories = rawCat.trim().split(/\s+/);

    if (filterValue === 'all' || categories.includes(filterValue)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

if (filterBtns.length > 0 && workCards.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.filter-btn.active');
      if (activeBtn) activeBtn.classList.remove('active');
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      applyProjectFilter(filterValue);
    });
  });

  // Automatically filter on initial page load based on whichever button has .active
  const initialActiveBtn = document.querySelector('.filter-btn.active');
  const initialFilter = initialActiveBtn ? initialActiveBtn.getAttribute('data-filter') : 'featured';
  applyProjectFilter(initialFilter);
}

/**
 * ─────────────────────────────────────────────────────────────
 * 2. SUBDIRECTORY HEADER NAVIGATION
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
 * 3. MOBILE / PANEL OVERLAY CONTROLS
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
