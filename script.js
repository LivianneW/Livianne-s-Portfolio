// Menu Overlay and Panel functionality (shared across all pages)
const hamburgerMenu = document.querySelector('.hamburger-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuPanel = document.querySelector('.menu-panel');
const closeMenu = document.querySelector('.close-menu');

hamburgerMenu.addEventListener('click', () => {
    menuOverlay.classList.toggle('active');
    menuPanel.classList.toggle('active');
});

closeMenu.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    menuPanel.classList.remove('active');
});

menuOverlay.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    menuPanel.classList.remove('active');
});

// Index page specific: Category filtering
const categoryButtons = document.querySelectorAll('.category-btn');
if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the selected category
            const selectedCategory = button.getAttribute('data-category');
            
            // Filter project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories');
                if (selectedCategory === 'all' || categories.includes(selectedCategory)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Index page specific: View Project buttons
const viewProjectButtons = document.querySelectorAll('.view-project-btn');
if (viewProjectButtons.length > 0) {
    viewProjectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectTitle = button.closest('.project-card').querySelector('.project-title').textContent;
            alert(`Opening project: ${projectTitle}\n\n(This would navigate to the project details page)`);
        });
    });
}

// Scroll up button (for both pages)
const scrollUpBtn = document.querySelector('.scroll-up-btn');
if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// About page specific: Make header h1 clickable to go home
const headerTitle = document.querySelector('.header h1');
if (headerTitle && (window.location.pathname.includes('about.html') || window.location.pathname.includes('/pages/'))) {
    headerTitle.style.cursor = 'pointer';
    headerTitle.addEventListener('click', () => {
        // Check if we're in a subdirectory
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    });
}