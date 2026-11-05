const filterButtons = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

const applyProjectFilter = (filterValue) => {
  workCards.forEach((card) => {
    const rawCategories = card.getAttribute('data-cat') || '';
    const categories = rawCategories.trim().split(/\s+/).filter(Boolean);
    const shouldShow = filterValue === 'all' || categories.includes(filterValue);
    card.style.display = shouldShow ? '' : 'none';
  });
};

if (filterButtons.length && workCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activeButton = document.querySelector('.filter-btn.active');
      if (activeButton) activeButton.classList.remove('active');

      button.classList.add('active');
      applyProjectFilter(button.getAttribute('data-filter') || 'all');
    });
  });

  const activeButton = document.querySelector('.filter-btn.active');
  applyProjectFilter(activeButton ? activeButton.getAttribute('data-filter') : 'featured');
}

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.main-nav');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('change', () => {
    navLinks.classList.toggle('is-open', menuToggle.checked);
  });
}
