const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('header nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Close nav if clicking outside
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
    nav.classList.remove('active');
  }
});
