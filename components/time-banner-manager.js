class TimeBannerManager {
    constructor() {
        this.cosmicBanner = null;
        this.localBanner = null;
        this.init();
        this.setupResizeHandler();
    }
    init() {
        this.initializeForCurrentScreen();
    }
    initializeForCurrentScreen() {
        if (this.isMobile()) {
            this.initializeLocalBanner();
        } else {
            this.initializeCosmicBanner();
        }
    }
    cleanupBanners() {
        if (this.cosmicBanner) {
            this.cosmicBanner = null;
        }
        if (this.localBanner) {
            this.localBanner = null;
        }
        console.log('Time displays cleaned up');
    }
    initializeLocalBanner() {
        if (!this.localBanner && typeof CityTimeTicker !== 'undefined') {
            this.localBanner = new CityTimeTicker();
            console.log('City time ticker initialized');
        }
        if (this.cosmicBanner) {
            this.cosmicBanner = null;
        }
    }
    initializeCosmicBanner() {
        console.log('Initializing temporal counters...');
        console.log('TemporalCounters available:', typeof TemporalCounters !== 'undefined');
        if (!this.cosmicBanner && typeof TemporalCounters !== 'undefined') {
            this.cosmicBanner = new TemporalCounters();
            console.log('Temporal counters initialized');
        }
        if (this.localBanner) {
            this.localBanner = null;
        }
    }
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            const wasDesktop = this.cosmicBanner !== null;
            const isDesktopNow = !this.isMobile();
            if (wasDesktop !== isDesktopNow) {
                console.log(`Screen size changed: ${wasDesktop ? 'desktop' : 'mobile'} → ${isDesktopNow ? 'desktop' : 'mobile'}`);
                this.initializeForCurrentScreen();
            }
        });
    }
    isMobile() {
        const mobile = window.innerWidth <= 768;
        console.log('Screen width:', window.innerWidth, 'isMobile:', mobile);
        return mobile;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing time banner manager');
    window.timeBannerManager = new TimeBannerManager();
    setTimeout(() => {
        if (window.innerWidth > 768 && !window.timeBannerManager.cosmicBanner) {
            console.log('Fallback: directly initializing temporal counters');
            if (typeof TemporalCounters !== 'undefined') {
                window.temporalCountersFallback = new TemporalCounters();
            }
        }
    }, 1000);
});
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimeBannerManager;
}