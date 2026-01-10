// Menu Overlay and Panel functionality (shared across all pages)
const hamburgerMenu = document.querySelector('.hamburger-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuPanel = document.querySelector('.menu-panel');
const closeMenu = document.querySelector('.close-menu');

if (hamburgerMenu && menuOverlay && menuPanel && closeMenu) {
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
}

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
            const projectCard = button.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-title').textContent;
            
            // Define project routes
            const projectRoutes = {
                'Steam Navigation Redesign': 'pages/steam_navigation.html',
                'QUESST': null, // Coming soon
                'Resource Bridge': 'pages/resource_bridge.html',
                'Spoonify': 'pages/spoonify.html',
                'Tastea': null // Coming soon
            };
            
            const route = projectRoutes[projectTitle];
            
            if (route) {
                window.location.href = route;
            } else {
                alert(`${projectTitle}\n\nComing soon!`);
            }
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