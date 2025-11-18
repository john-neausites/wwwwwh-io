class NavigationManager {
    constructor(options = {}) {
        this.options = {
            mobileBreakpoint: options.mobileBreakpoint || 480,
            contentSelector: options.contentSelector || '.why-content',
            enableSwipeBack: options.enableSwipeBack !== false,
            ...options
        };
        this.navigationHistory = [];
        this.currentView = 'home';
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }
    init() {
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMobile() && this.navigationHistory.length > 0) {
                this.navigateBack();
            }
        });
        if (this.options.enableSwipeBack) {
            document.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
            document.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
        }
        this.handleResize();
    }
    isMobile() {
        return window.innerWidth <= this.options.mobileBreakpoint;
    }
    handleMobileNavigation(slug) {
        if (!this.isMobile()) return;
        this.navigationHistory.push(this.currentView);
        this.currentView = slug;
        const content = document.querySelector(this.options.contentSelector);
        if (content) {
            content.style.display = 'block';
        }
    }
    navigateBack() {
        if (this.navigationHistory.length > 0) {
            const previousView = this.navigationHistory.pop();
            this.currentView = previousView;
            if (this.isMobile() && previousView === 'home') {
                const content = document.querySelector(this.options.contentSelector);
                if (content) {
                    content.style.display = 'none';
                }
            }
        }
    }
    handleResize() {
        const content = document.querySelector(this.options.contentSelector);
        if (!this.isMobile()) {
            if (content) {
                content.style.display = 'block';
            }
            this.navigationHistory = [];
            this.currentView = 'home';
        } else {
            if (this.currentView === 'home' && content) {
                content.style.display = 'none';
            }
        }
    }
    handleTouchStart(event) {
        this.touchStartX = event.changedTouches[0].screenX;
    }
    handleTouchEnd(event) {
        this.touchEndX = event.changedTouches[0].screenX;
        this.handleSwipe();
    }
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (swipeDistance > swipeThreshold && this.navigationHistory.length > 0) {
            this.navigateBack();
        }
    }
    getCurrentView() {
        return this.currentView;
    }
    getNavigationHistory() {
        return [...this.navigationHistory];
    }
}