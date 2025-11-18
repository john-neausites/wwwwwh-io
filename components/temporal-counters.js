class TemporalCounters {
    constructor() {
        this.element = document.querySelector('#when-content');
        this.cachedValues = [];
        this.currentIndex = 0;
        this.baseTime = null;
        this.sessionStartTime = Date.now();
        this.y2kStartTime = new Date('2000-01-01T00:00:00Z').getTime();
        this.init();
    }
    init() {
        if (!this.element) {
            console.error('Cosmic time banner element not found');
            return;
        }
        this.setupTimeDisplays();
        this.generateCachedValues();
        this.startAllCounters();
    }
    setupTimeDisplays() {
        this.element.innerHTML = `
            <span class="session-time"></span>
            <span class="cosmic-time"></span>
            <span class="y2k-time"></span>
        `;
        this.element.style.animation = 'none';
        this.element.style.transform = 'none';
        this.element.className = 'when-content time-displays';
        this.sessionElement = this.element.querySelector('.session-time');
        this.cosmicElement = this.element.querySelector('.cosmic-time');
        this.y2kElement = this.element.querySelector('.y2k-time');
    }
    generateCachedValues() {
        console.log('Generating cached cosmic time values...');
        const now = new Date();
        this.baseTime = now.getTime();
        const year1 = new Date('0001-01-01T00:00:00Z');
        const baseDiffMs = now.getTime() - year1.getTime();
        const baseTotalSeconds = baseDiffMs / 1000;
        for (let i = 0; i < 4000; i++) {
            const offsetMs = i * 25; 
            const offsetSeconds = offsetMs / 1000;
            const cosmicTime = (baseTotalSeconds + offsetSeconds).toFixed(5);
            this.cachedValues.push(cosmicTime);
        }
        console.log(`Generated ${this.cachedValues.length} cached values`);
    }
    startAllCounters() {
        this.updateAllTimes();
        setInterval(() => {
            this.updateAllTimes();
        }, 25);
        console.log('All time counters started');
    }
    updateAllTimes() {
        this.updateSessionTime();
        this.updateCosmicTime();
        this.updateY2KTime();
    }
    updateSessionTime() {
        const now = Date.now();
        const sessionMs = now - this.sessionStartTime;
        const sessionSeconds = (sessionMs / 1000).toFixed(3);
        this.sessionElement.textContent = sessionSeconds;
    }
    updateY2KTime() {
        const now = Date.now();
        const y2kMs = now - this.y2kStartTime;
        const y2kSeconds = (y2kMs / 1000).toFixed(2);
        this.y2kElement.textContent = y2kSeconds;
    }
    updateCosmicTime() {
        const cosmicTime = this.cachedValues[this.currentIndex];
        this.cosmicElement.textContent = cosmicTime;
        this.currentIndex++;
        if (this.currentIndex >= this.cachedValues.length) {
            this.generateCachedValues();
            this.currentIndex = 0;
        }
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemporalCounters;
}