let mainMenu = null;
let navigationManager = null;
let contentManager = null;
let protocolHandler = null;

// Keyboard shortcut override system
let keyBuffer = '';
let keyBufferTimeout = null;
let unlocked = false;

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

function initializeApplication() {
    initKeyboardOverride();
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
}
function handleMenuItemClick(slug, itemId, element) {
    console.log(`Menu item clicked: ${slug} (ID: ${itemId})`);
    contentManager.loadContent(slug);
    navigationManager.handleMobileNavigation(slug);
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('wwwwwh.io initializing...');
    initializeApplication();
    console.log('wwwwwh.io initialized successfully');
    console.log('🧪 Test functions available: testAuthenticationElements(), testHardwareKeyAuth()');
    console.log('🔑 Shortcut: Type "jrv" to toggle navigation unlock');
});