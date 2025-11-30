let mainMenu = null;
let navigationManager = null;
let contentManager = null;
let protocolHandler = null;
let colorPalette = null;
let analytics = null;

// Keyboard shortcut override system
let keyBuffer = '';
let keyBufferTimeout = null;
let unlocked = true; // Desktop unlocked by default for PRD usage

function initKeyboardOverride() {
    document.addEventListener('keydown', (event) => {
        // Don't interfere with input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Add key to buffer
        keyBuffer += event.key.toLowerCase();
        
        // Clear timeout and set new one (reset buffer after 1 second of inactivity)
        clearTimeout(keyBufferTimeout);
        keyBufferTimeout = setTimeout(() => {
            keyBuffer = '';
        }, 1000);
        
        // Check for 'jrv' sequence
        if (keyBuffer.includes('jrv')) {
            unlocked = !unlocked;
            keyBuffer = '';
            
            const status = unlocked ? 'UNLOCKED' : 'LOCKED';
            const message = `🔓 Navigation ${status}`;
            
            console.log(message);
            
            // Show visual feedback
            showUnlockNotification(status);
            
            // If unlocking, remove any active NSKey modals
            if (unlocked) {
                document.querySelectorAll('.nskey-modal').forEach(modal => modal.remove());
            }
        }
    });
}

function showUnlockNotification(status) {
    // Remove any existing notification
    const existing = document.querySelector('.unlock-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.textContent = `Navigation ${status}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${status === 'UNLOCKED' ? '#4CAF50' : '#FF5722'};
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function isUnlocked() {
    return unlocked;
}

function styleColorButton() {
    // Find the Color menu item (slug: photo-color, ID: 129)
    const menuItems = document.querySelectorAll('.menu-item');
    const isColored = sessionStorage.getItem('colorState') === 'on';
    
    menuItems.forEach(item => {
        const itemText = item.textContent.trim();
        if (itemText === 'Color') {
            if (isColored) {
                // Color is ON - button should be grayscale/transparent
                item.style.background = 'transparent';
                item.style.color = '';
                item.style.fontWeight = '';
                item.style.textShadow = '';
                item.style.border = '1px solid currentColor';
                item.style.opacity = '0.5';
            } else {
                // Color is OFF - button shows the palette colors
                const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#8B5CF6';
                const secondary = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#292524';
                const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#3B82F6';
                
                // Show colors on the button when site is grayscale
                item.style.background = `linear-gradient(135deg, ${primary} 0%, ${accent} 50%, ${secondary} 100%)`;
                item.style.color = '#fff';
                item.style.fontWeight = '700';
                item.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
                item.style.border = `2px solid ${accent}`;
                item.style.opacity = '1';
            }
        }
    });
}

function initializeApplication() {
    initKeyboardOverride();
    
    // Initialize analytics
    analytics = new Analytics();
    window.analytics = analytics; // Expose globally
    analytics.track('app_init', {
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });
    
    // Initialize color palette system
    colorPalette = new ColorPalette();
    window.colorPalette = colorPalette; // Expose globally
    
    // Initialize color state
    if (!sessionStorage.getItem('colorState')) {
        sessionStorage.setItem('colorState', 'off');
    }
    
    // Generate palette if none exists (but don't apply it yet)
    if (!sessionStorage.getItem('colorPalette')) {
        colorPalette.generatePalette();
    }
    
    // Apply colors if state is 'on'
    if (sessionStorage.getItem('colorState') === 'on') {
        colorPalette.applyPalette();
    }
    
    // Style the Color button after menu loads
    setTimeout(() => {
        styleColorButton();
    }, 500);
    
    navigationManager = new NavigationManager({
        mobileBreakpoint: 480,
        contentSelector: '.why-content',
        enableSwipeBack: true
    });
    contentManager = new ContentManager({
        contentSelector: '#content-display',
        loadingDelay: 200,
        mobileBreakpoint: 480
    });
    protocolHandler = new ProtocolHandler({
        navSelector: '.nav-menu a',
        onProtocolClick: handleProtocolClick
    });
    window.protocolHandler = protocolHandler;
    mainMenu = new StaticMenu('main-menu', {
        dataPath: 'menu-data.json',
        onItemClick: handleMenuItemClick,
        onError: handleMenuError,
        mobileBreakpoint: 480
    });
    
    // Expose globally for navigation integration
    window.mainMenu = mainMenu;
}
function handleMenuItemClick(slug, itemId, element) {
    console.log(`Menu item clicked: ${slug} (ID: ${itemId})`);
    
    // Track section access
    if (analytics) {
        analytics.trackSection(slug, itemId);
    }
    
    // Special handling for Color button - toggle color state
    if (slug === 'photo-color') {
        toggleColorState();
        // Still load content if not loaded
        contentManager.loadContent(slug);
        navigationManager.handleMobileNavigation(slug);
        return;
    }
    
    // Load content for other items
    contentManager.loadContent(slug);
    navigationManager.handleMobileNavigation(slug);
}

function toggleColorState() {
    // Check if colors are currently applied
    const isColored = sessionStorage.getItem('colorState') === 'on';
    
    if (isColored) {
        // Turn off colors - revert to grayscale
        sessionStorage.setItem('colorState', 'off');
        colorPalette.removePalette();
        styleColorButton(); // Update button to show colors
    } else {
        // Turn on colors - apply palette
        sessionStorage.setItem('colorState', 'on');
        // Generate palette if none exists
        if (!colorPalette.currentPalette) {
            colorPalette.generatePalette();
        }
        colorPalette.applyPalette();
    }
}
function handleProtocolClick(protocol, element, event) {
    console.log(`Protocol ${protocol} clicked`);
    const authStatus = protocolHandler.getAuthenticationStatus();
    console.log('Authentication status:', authStatus);
    const result = protocolHandler.handleProtocol(protocol);
    if (result.status === 'not_implemented') {
        protocolHandler.defaultProtocolHandler(protocol, element, event);
    }
}
function handleMenuLoadComplete(menuItems) {
    console.log(`Menu loaded successfully with ${menuItems.length} items`);
}
function handleMenuError(error) {
    console.error('Menu error:', error);
}
function testAuthenticationElements() {
    if (!protocolHandler) {
        console.error('Protocol handler not initialized');
        return;
    }
    const status = protocolHandler.getAuthenticationStatus();
    console.group('🔐 Authentication Element Detection');
    console.log('Hardware Key Support:', status.hardware);
    console.log('Certificate Support:', status.certificates);
    console.log('WebAuthn Support:', status.webauthn);
    console.log('Browser Security:', status.browser);
    console.log('Summary:', status.summary);
    console.groupEnd();
    return status;
}
function testHardwareKeyAuth() {
    if (!protocolHandler) {
        console.error('Protocol handler not initialized');
        return;
    }
    console.log('🔑 Testing hardware key authentication...');
    return protocolHandler.requestHardwareKeyAuth()
        .then(result => {
            console.log('Hardware key auth result:', result);
            return result;
        })
        .catch(error => {
            console.error('Hardware key auth failed:', error);
            return { success: false, error: error.message };
        });
}
window.testAuthenticationElements = testAuthenticationElements;
window.testHardwareKeyAuth = testHardwareKeyAuth;
window.isUnlocked = isUnlocked;
window.styleColorButton = styleColorButton;
window.toggleColorState = toggleColorState;

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Analytics helper functions
function showStats() {
    if (analytics) {
        return analytics.printStats();
    } else {
        console.error('Analytics not initialized');
    }
}

function exportStats() {
    if (analytics) {
        analytics.exportStats();
    } else {
        console.error('Analytics not initialized');
    }
}

function clearAnalytics() {
    if (analytics) {
        analytics.clearStats();
    } else {
        console.error('Analytics not initialized');
    }
}

window.showStats = showStats;
window.exportStats = exportStats;
window.clearAnalytics = clearAnalytics;

document.addEventListener('DOMContentLoaded', function() {
    console.log('wwwwwh.io initializing...');
    initializeApplication();
    console.log('wwwwwh.io initialized successfully');
    console.log('🧪 Test functions available: testAuthenticationElements(), testHardwareKeyAuth()');
    console.log('🔑 Shortcut: Type "jrv" to toggle navigation unlock');
    console.log('📊 Analytics functions: showStats(), exportStats(), clearAnalytics()');
});