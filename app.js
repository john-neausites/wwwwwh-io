let mainMenu = null;
let navigationManager = null;
let contentManager = null;
let protocolHandler = null;
function initializeApplication() {
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('wwwwwh.io initializing...');
    initializeApplication();
    console.log('wwwwwh.io initialized successfully');
    console.log('🧪 Test functions available: testAuthenticationElements(), testHardwareKeyAuth()');
});