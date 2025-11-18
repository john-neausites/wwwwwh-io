class ProtocolHandler {
    constructor(options = {}) {
        this.options = {
            navSelector: options.navSelector || '.nav-menu a',
            protocols: options.protocols || [
                'kb', 'ftp', 'sftp', 'https', 'api', 'ssh', 'vpn', 'nstp', 'jrv'
            ],
            onProtocolClick: options.onProtocolClick || this.defaultProtocolHandler.bind(this),
            ...options
        };
        this.init();
    }
    init() {
        document.querySelectorAll(this.options.navSelector).forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const protocol = link.textContent.toLowerCase();
                console.log(`Navigation to ${protocol} protocol`);
                this.options.onProtocolClick(protocol, link, event);
            });
        });
    }
    defaultProtocolHandler(protocol, element, event) {
        const protocolResult = this.handleProtocol(protocol);
        if (protocolResult.status === 'nskey_required' || protocolResult.status === 'nskey_input') {
            return;
        }
        if (protocolResult.status === 'auth_required') {
            alert(protocolResult.message);
            return;
        }
        console.warn(`Unexpected protocol result for ${protocol}:`, protocolResult);
    }
    handleProtocol(protocol, data = null) {
        switch (protocol.toLowerCase()) {
            case 'kb':
                return this.handleKnowledgeBase(data);
            case 'ftp':
                return this.handleFTP(data);
            case 'sftp':
                return this.handleSFTP(data);
            case 'https':
                return this.handleHTTPS(data);
            case 'api':
                return this.handleAPI(data);
            case 'ssh':
                return this.handleSSH(data);
            case 'vpn':
                return this.handleVPN(data);
            case 'nstp':
                return this.handleNSTP(data);
            case 'jrv':
                return this.handleJRV(data);
            default:
                console.warn(`Unknown protocol: ${protocol}`);
                return false;
        }
    }
    handleKnowledgeBase(data) {
        console.log('Knowledge Base access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('KB', 'Insert NSkey');
            return { 
                protocol: 'kb', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('KB', 'Touch NSkey');
        return { protocol: 'kb', status: 'nskey_input' };
    }
    handleFTP(data) {
        console.log('FTP access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('FTP', 'Insert NSkey');
            return { 
                protocol: 'ftp', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('FTP', 'Touch NSkey');
        return { protocol: 'ftp', status: 'nskey_input' };
    }
    handleSFTP(data) {
        console.log('SFTP access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('SFTP', 'Insert NSkey');
            return { 
                protocol: 'sftp', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('SFTP', 'Touch NSkey');
        return { protocol: 'sftp', status: 'nskey_input' };
    }
    handleHTTPS(data) {
        console.log('HTTPS access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('HTTPS', 'Insert NSkey');
            return { 
                protocol: 'https', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('HTTPS', 'Touch NSkey');
        return { protocol: 'https', status: 'nskey_input' };
    }
    handleAPI(data) {
        console.log('API access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('API', 'Insert NSkey');
            return { 
                protocol: 'api', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('API', 'Touch NSkey');
        return { protocol: 'api', status: 'nskey_input' };
    }
    handleSSH(data) {
        console.log('SSH access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('SSH', 'Insert NSkey');
            return { 
                protocol: 'ssh', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('SSH', 'Touch NSkey');
        return { protocol: 'ssh', status: 'nskey_input' };
    }
    handleVPN(data) {
        console.log('VPN access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported || !authStatus.hardwareKey.supported) {
            this.showNSKeyInput('VPN', 'Insert NSkey');
            return { 
                protocol: 'vpn', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('VPN', 'Touch NSkey');
        return { protocol: 'vpn', status: 'nskey_input' };
    }
    handleNSTP(data) {
        console.log('NSTP access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('NSTP', 'Insert NSkey');
            return { 
                protocol: 'nstp', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('NSTP', 'Touch NSkey');
        return { protocol: 'nstp', status: 'nskey_input' };
    }
    handleJRV(data) {
        console.log('JRV access requested', data);
        const authStatus = this.checkAuthenticationElements();
        if (!authStatus.certificates.supported) {
            this.showNSKeyInput('JRV', 'Insert NSkey');
            return { 
                protocol: 'jrv', 
                status: 'nskey_required',
                message: 'Insert NSkey'
            };
        }
        this.showNSKeyInput('JRV', 'Touch NSkey');
        return { protocol: 'jrv', status: 'nskey_input' };
    }
    getSupportedProtocols() {
        return [...this.options.protocols];
    }
    checkAuthenticationElements() {
        return {
            hardwareKey: this.detectHardwareKey(),
            certificates: this.detectClientCertificates(),
            webauthn: this.detectWebAuthn(),
            browserSecurity: this.getBrowserSecurityInfo()
        };
    }
    detectHardwareKey() {
        const hasWebAuthn = 'navigator' in window && 'credentials' in navigator;
        const hasUSBHID = 'hid' in navigator;
        const hasWebUSB = 'usb' in navigator;
        return {
            webauthn: hasWebAuthn,
            usbHid: hasUSBHID,
            webUsb: hasWebUSB,
            supported: hasWebAuthn || hasUSBHID || hasWebUSB
        };
    }
    detectClientCertificates() {
        const hasTLS = location.protocol === 'https:';
        const hasClientCerts = 'crypto' in window && 'subtle' in window.crypto;
        return {
            tlsConnection: hasTLS,
            cryptoApi: hasClientCerts,
            supported: hasTLS && hasClientCerts
        };
    }
    detectWebAuthn() {
        if (!('navigator' in window) || !('credentials' in navigator)) {
            return { supported: false, reason: 'WebAuthn API not available' };
        }
        const hasCreate = 'create' in navigator.credentials;
        const hasGet = 'get' in navigator.credentials;
        return {
            supported: hasCreate && hasGet,
            create: hasCreate,
            get: hasGet,
            publicKey: 'PublicKeyCredential' in window
        };
    }
    getBrowserSecurityInfo() {
        const info = {
            userAgent: navigator.userAgent,
            isSecureContext: window.isSecureContext,
            protocol: location.protocol,
            origin: location.origin,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            language: navigator.language,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
        };
        info.capabilities = {
            serviceWorker: 'serviceWorker' in navigator,
            pushManager: 'PushManager' in window,
            notifications: 'Notification' in window,
            geolocation: 'geolocation' in navigator,
            bluetooth: 'bluetooth' in navigator,
            usb: 'usb' in navigator,
            serial: 'serial' in navigator
        };
        return info;
    }
    async requestHardwareKeyAuth(options = {}) {
        const authCheck = this.checkAuthenticationElements();
        if (!authCheck.webauthn.supported) {
            throw new Error('WebAuthentication not supported in this browser');
        }
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32), 
                    timeout: options.timeout || 60000,
                    userVerification: options.userVerification || 'preferred',
                    ...options
                }
            });
            return {
                success: true,
                credential: credential,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    getAuthenticationStatus() {
        const elements = this.checkAuthenticationElements();
        const timestamp = new Date().toISOString();
        return {
            timestamp: timestamp,
            hardware: elements.hardwareKey,
            certificates: elements.certificates,
            webauthn: elements.webauthn,
            browser: elements.browserSecurity,
            summary: {
                hardwareKeySupported: elements.hardwareKey.supported,
                certificatesSupported: elements.certificates.supported,
                webauthnSupported: elements.webauthn.supported,
                secureContext: elements.browserSecurity.isSecureContext
            }
        };
    }
    showNSKeyInput(protocol, message) {
        this.removeNSKeyModal();
        const modal = document.createElement('div');
        modal.className = 'nskey-modal';
        modal.innerHTML = `
            <div class="nskey-modal-content">
                <div class="nskey-header">
                    <h3>${protocol} Authentication</h3>
                    <button class="nskey-close" onclick="this.closest('.nskey-modal').remove()">&times;</button>
                </div>
                <div class="nskey-body">
                    <p>${message}</p>
                    <div class="nskey-input-container">
                        <label for="nskey-input">Hash:</label>
                        <input type="password" 
                               id="nskey-input" 
                               class="nskey-input" 
                               placeholder=""
                               autocomplete="off"
                               spellcheck="false">
                    </div>
                    <div class="nskey-actions">
                        <button class="nskey-cancel" onclick="this.closest('.nskey-modal').remove()">Cancel</button>
                        <button class="nskey-submit" onclick="window.protocolHandler.processNSKeyInput('${protocol}')">Authenticate</button>
                    </div>
                    <div class="nskey-status" id="nskey-status"></div>
                </div>
            </div>
        `;
        this.addNSKeyStyles();
        document.body.appendChild(modal);
        setTimeout(() => {
            const input = document.getElementById('nskey-input');
            if (input) {
                input.focus();
                this.setupNSKeyInputValidation(input, protocol);
            }
            this.setupModalKeyboardHandlers(modal);
        }, 100);
    }
    setupModalKeyboardHandlers(modal) {
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        modal._escHandler = escHandler;
    }
    setupNSKeyInputValidation(input, protocol) {
        let inputTimer = null;
        input.addEventListener('input', (e) => {
            clearTimeout(inputTimer);
            const value = e.target.value;
            this.updateNSKeyStatus('', 'info');
            if (value.length > 0 && !this.isValidNSKeyOutput(value)) {
                this.updateNSKeyStatus('Invalid input. Only NSkey output accepted.', 'error');
                e.target.value = '';
                return;
            }
            inputTimer = setTimeout(() => {
                if (value.length >= 32) {
                    if (this.isValidNSKeyOutput(value)) {
                        this.updateNSKeyStatus('Ready to authenticate.', 'success');
                    }
                }
            }, 500);
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processNSKeyInput(protocol);
            }
        });
    }
    isValidNSKeyOutput(input) {
        const nsKeyPatterns = [
            /^[cbdefghijklnrtuv]{44}$/, 
            /^[a-f0-9]{32}$/i,          
            /^[a-zA-Z0-9+/]{43}=$/     
        ];
        return nsKeyPatterns.some(pattern => pattern.test(input.trim()));
    }
    processNSKeyInput(protocol) {
        const input = document.getElementById('nskey-input');
        if (!input) return;
        const value = input.value.trim();
        if (!value) {
            this.updateNSKeyStatus('Insert NSkey.', 'error');
            return;
        }
        if (!this.isValidNSKeyOutput(value)) {
            this.updateNSKeyStatus('Insert NSkey.', 'error');
            input.value = '';
            return;
        }
        this.updateNSKeyStatus('Validating...', 'info');
        setTimeout(() => {
            const isValid = this.validateNSKeyOutput(value, protocol);
            if (isValid) {
                this.updateNSKeyStatus(`${protocol} authentication successful!`, 'success');
                setTimeout(() => {
                    this.removeNSKeyModal();
                    this.handleSuccessfulAuth(protocol, value);
                }, 1500);
            } else {
                this.updateNSKeyStatus('Authentication failed.', 'error');
                input.value = '';
            }
        }, 1000);
    }
    validateNSKeyOutput(output, protocol) {
        return this.isValidNSKeyOutput(output);
    }
    handleSuccessfulAuth(protocol, nsKeyOutput) {
        console.log(`${protocol} authentication successful with NSkey`);
        alert(`${protocol} connection established.`);
    }
    updateNSKeyStatus(message, type) {
        const status = document.getElementById('nskey-status');
        if (status) {
            status.textContent = message;
            status.className = `nskey-status ${type}`;
        }
    }
    removeNSKeyModal() {
        const existingModal = document.querySelector('.nskey-modal');
        if (existingModal) {
            if (existingModal._escHandler) {
                document.removeEventListener('keydown', existingModal._escHandler);
            }
            existingModal.remove();
        }
    }
    addNSKeyStyles() {
        if (document.getElementById('nskey-styles')) return;
        const styles = document.createElement('style');
        styles.id = 'nskey-styles';
        styles.textContent = `
            .nskey-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: var(--font-mono, monospace);
            }
            .nskey-modal-content {
                background: white;
                border: 2px solid #000;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .nskey-header {
                background: #f5f5f5;
                padding: 16px;
                border-bottom: 1px solid #000;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .nskey-header h3 {
                margin: 0;
                font-size: 16px;
            }
            .nskey-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
            }
            .nskey-body {
                padding: 20px;
            }
            .nskey-input-container {
                margin: 20px 0;
            }
            .nskey-input-container label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
            }
            .nskey-input {
                width: 100%;
                padding: 12px;
                border: 2px solid #ccc;
                font-family: var(--font-mono, monospace);
                font-size: 14px;
                background: #f9f9f9;
            }
            .nskey-input:focus {
                border-color: #000;
                outline: none;
                background: white;
            }
            .nskey-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 20px;
            }
            .nskey-cancel, .nskey-submit {
                padding: 10px 20px;
                border: 2px solid #000;
                background: white;
                cursor: pointer;
                font-family: var(--font-mono, monospace);
            }
            .nskey-submit {
                background: #000;
                color: white;
            }
            .nskey-submit:hover {
                background: #333;
            }
            .nskey-cancel:hover {
                background: #f5f5f5;
            }
            .nskey-status {
                margin-top: 16px;
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                min-height: 20px;
            }
            .nskey-status.error {
                background: #ffebee;
                color: #c62828;
                border: 1px solid #ffcdd2;
            }
            .nskey-status.success {
                background: #e8f5e8;
                color: #2e7d32;
                border: 1px solid #c8e6c9;
            }
            .nskey-status.info {
                background: #e3f2fd;
                color: #1565c0;
                border: 1px solid #bbdefb;
            }
        `;
        document.head.appendChild(styles);
    }
}