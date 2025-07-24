class Router {
    constructor() {
        this.routes = {
            '/': 'landing-page',
            '/new-user': 'new-user-page',
            '/returning-user': 'returning-user-page',
            '/paste-link': 'paste-link-page'
        };
        
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        this.handleRoute();
    }

    navigate(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const pageId = this.routes[path] || this.routes['/'];
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // Show current page
        const currentPage = document.getElementById(pageId);
        if (currentPage) {
            currentPage.style.display = 'flex';
        }
        
        // Update page title
        this.updateTitle(path);
    }

    updateTitle(path) {
        const titles = {
            '/': 'BasketButler - AI Meal Planning Assistant',
            '/new-user': 'Welcome - BasketButler',
            '/returning-user': 'Welcome Back - BasketButler',
            '/paste-link': 'Share Link - BasketButler'
        };
        
        document.title = titles[path] || titles['/'];
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});