class Analytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.startTime = Date.now();
        this.lastActivityTime = Date.now();
        this.maxEvents = 1000; // Limit storage
        this.storageKey = 'wwwwwh_analytics';
        this.init();
    }

    init() {
        // Load existing session data
        this.loadSession();
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            this.track('visibility_change', {
                visible: !document.hidden
            });
        });

        // Track scrolling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.track('scroll', {
                    scrollY: window.scrollY,
                    scrollX: window.scrollX,
                    viewportHeight: window.innerHeight,
                    documentHeight: document.documentElement.scrollHeight
                });
            }, 500);
        });

        // Track clicks globally
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        }, true);

        // Track unload
        window.addEventListener('beforeunload', () => {
            this.track('session_end', {
                duration: Date.now() - this.startTime,
                totalEvents: this.events.length
            });
            this.saveSession();
        });

        // Periodic save
        setInterval(() => this.saveSession(), 30000); // Every 30 seconds

        console.log(`📊 Analytics initialized - Session: ${this.sessionId}`);
    }

    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    trackClick(event) {
        const target = event.target;
        const element = this.getElementInfo(target);
        
        this.track('click', {
            element: element.tag,
            id: element.id,
            class: element.class,
            text: element.text,
            x: event.clientX,
            y: event.clientY,
            path: this.getElementPath(target)
        });
    }

    getElementInfo(element) {
        return {
            tag: element.tagName?.toLowerCase() || 'unknown',
            id: element.id || null,
            class: element.className || null,
            text: element.textContent?.trim().substring(0, 50) || null,
            href: element.href || null,
            value: element.value || null
        };
    }

    getElementPath(element) {
        const path = [];
        let current = element;
        while (current && current !== document.body) {
            let selector = current.tagName?.toLowerCase() || 'unknown';
            if (current.id) {
                selector += `#${current.id}`;
            } else if (current.className) {
                const classes = current.className.toString().split(' ').filter(c => c);
                if (classes.length > 0) {
                    selector += `.${classes.join('.')}`;
                }
            }
            path.unshift(selector);
            current = current.parentElement;
            if (path.length > 10) break; // Limit depth
        }
        return path.join(' > ');
    }

    track(eventType, data = {}) {
        const event = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            timeSinceStart: Date.now() - this.startTime,
            timeSinceLastActivity: Date.now() - this.lastActivityTime,
            type: eventType,
            data: data,
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            userAgent: navigator.userAgent
        };

        this.events.push(event);
        this.lastActivityTime = Date.now();

        // Trim if too many events
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        console.log(`📊 ${eventType}:`, data);
    }

    trackNavigation(menuItem, itemId) {
        this.track('navigation', {
            menuItem,
            itemId,
            navigationDepth: this.getNavigationDepth()
        });
    }

    trackContentLoad(contentType, contentId) {
        this.track('content_load', {
            contentType,
            contentId
        });
    }

    trackMusicAction(action, songInfo) {
        this.track('music_action', {
            action,
            ...songInfo
        });
    }

    trackError(errorType, errorMessage, context) {
        this.track('error', {
            errorType,
            errorMessage,
            context
        });
    }

    getNavigationDepth() {
        // Try to get from static menu if available
        if (window.mainMenu && window.mainMenu.navigationStack) {
            return window.mainMenu.navigationStack.length;
        }
        return 0;
    }

    saveSession() {
        try {
            const data = {
                sessionId: this.sessionId,
                startTime: this.startTime,
                lastActivityTime: this.lastActivityTime,
                events: this.events
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save analytics:', e);
        }
    }

    loadSession() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                // If session is less than 1 hour old, continue it
                if (Date.now() - data.lastActivityTime < 3600000) {
                    this.sessionId = data.sessionId;
                    this.startTime = data.startTime;
                    this.events = data.events || [];
                    console.log(`📊 Resumed session: ${this.sessionId} (${this.events.length} events)`);
                }
            }
        } catch (e) {
            console.warn('Failed to load analytics:', e);
        }
    }

    getJourney() {
        return this.events.map(e => ({
            time: new Date(e.timestamp).toISOString(),
            timeDelta: e.timeSinceLastActivity,
            type: e.type,
            data: e.data
        }));
    }

    playbackJourney(speed = 1) {
        console.log(`🎬 Playing back user journey (${this.events.length} events)`);
        console.log(`Session: ${this.sessionId}`);
        console.log(`Duration: ${((Date.now() - this.startTime) / 1000 / 60).toFixed(2)} minutes`);
        console.log('---');

        let delay = 0;
        this.events.forEach((event, index) => {
            setTimeout(() => {
                const timeStr = new Date(event.timestamp).toLocaleTimeString();
                const deltaStr = `+${(event.timeSinceLastActivity / 1000).toFixed(1)}s`;
                console.log(`[${index + 1}/${this.events.length}] ${timeStr} (${deltaStr}) ${event.type}:`, event.data);
                
                // Visual highlight for clicks
                if (event.type === 'click' && event.data.path) {
                    try {
                        const element = document.querySelector(event.data.path.split(' > ').pop());
                        if (element) {
                            element.style.outline = '3px solid red';
                            setTimeout(() => {
                                element.style.outline = '';
                            }, 1000 / speed);
                        }
                    } catch (e) {
                        // Element might not exist anymore
                    }
                }
            }, delay);
            delay += (event.timeSinceLastActivity / speed);
        });

        setTimeout(() => {
            console.log('---');
            console.log('🎬 Playback complete');
            this.printSummary();
        }, delay + 1000);
    }

    printSummary() {
        const summary = {
            sessionId: this.sessionId,
            duration: `${((Date.now() - this.startTime) / 1000 / 60).toFixed(2)} minutes`,
            totalEvents: this.events.length,
            eventTypes: {},
            clicks: this.events.filter(e => e.type === 'click').length,
            navigations: this.events.filter(e => e.type === 'navigation').length,
            errors: this.events.filter(e => e.type === 'error').length,
            musicActions: this.events.filter(e => e.type === 'music_action').length
        };

        // Count by type
        this.events.forEach(e => {
            summary.eventTypes[e.type] = (summary.eventTypes[e.type] || 0) + 1;
        });

        console.log('📊 Session Summary:', summary);
        return summary;
    }

    exportSession() {
        const data = {
            sessionId: this.sessionId,
            startTime: new Date(this.startTime).toISOString(),
            duration: Date.now() - this.startTime,
            events: this.events,
            summary: this.printSummary()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${this.sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📊 Session exported');
    }

    clearSession() {
        this.events = [];
        this.startTime = Date.now();
        this.sessionId = this.generateSessionId();
        localStorage.removeItem(this.storageKey);
        console.log('📊 Session cleared');
    }
}

// Global instance
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
