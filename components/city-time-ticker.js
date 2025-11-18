class CityTimeTicker {
    constructor() {
        this.cities = [
            { name: 'NYC', timezone: 'America/New_York' },
            { name: 'LON', timezone: 'Europe/London' },
            { name: 'TOK', timezone: 'Asia/Tokyo' },
            { name: 'SYD', timezone: 'Australia/Sydney' },
            { name: 'LAX', timezone: 'America/Los_Angeles' },
            { name: 'DUB', timezone: 'Europe/Dublin' }
        ];
        this.element = document.querySelector('#mobile-banner-content');
        this.cityTimes = {};
        this.animationInitialized = false;
        this.initialTime = null;
        this.cityOffsets = {};
        this.init();
    }
    init() {
        if (!this.element) {
            console.error('City time ticker element not found');
            return;
        }
        this.calculateInitialOffsets();
        this.updateCityTimes();
        this.renderBanner();
        this.startUpdateLoop();
    }
    calculateInitialOffsets() {
        const baseTime = new Date();
        this.initialTime = baseTime;
        this.cities.forEach((city) => {
            try {
                const testDate = new Date('2024-01-15T12:00:00Z'); 
                const cityLocalTime = new Date(testDate.toLocaleString('en-US', { timeZone: city.timezone }));
                const utcLocalTime = new Date(testDate.toLocaleString('en-US', { timeZone: 'UTC' }));
                const offsetHours = (cityLocalTime.getHours() - utcLocalTime.getHours());
                const offsetMs = offsetHours * 60 * 60 * 1000;
                this.cityOffsets[city.name] = {
                    offsetMs: offsetMs,
                    offsetHours: offsetHours,
                    timezone: city.timezone
                };
                console.log(`${city.name} offset: ${offsetHours} hours (${offsetMs}ms)`);
            } catch (error) {
                console.error(`Error calculating offset for ${city.name}:`, error);
                this.cityOffsets[city.name] = { offsetMs: 0, offsetHours: 0, timezone: city.timezone };
            }
        });
    }
    updateCityTimes() {
        const now = new Date();
        this.cities.forEach((city) => {
            try {
                const offset = this.cityOffsets[city.name];
                if (!offset) return;
                const cityTime = new Date(now.getTime() + offset.offsetMs);
                const timeString = cityTime.toLocaleTimeString('en-US', {
                    timeZone: 'UTC', 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                const ms = String(cityTime.getMilliseconds()).padStart(3, '0');
                const preciseTime = `${timeString}.${ms.substring(0, 2)}`;
                this.cityTimes[city.name] = {
                    time: preciseTime,
                    timezone: city.timezone,
                    updated: now.toISOString()
                };
            } catch (error) {
                console.error(`Error updating time for ${city.name}:`, error);
                const fallbackTime = new Date().toLocaleTimeString('en-US', { 
                    timeZone: city.timezone, 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                this.cityTimes[city.name] = {
                    time: fallbackTime,
                    timezone: city.timezone,
                    updated: new Date().toISOString()
                };
            }
        });
    }
    renderBanner() {
        if (!this.element) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            timeZone: 'UTC',
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        const utcWithMs = `${timeStr}.${ms.substring(0, 2)}`;
        const bannerItems = [
            `UTC: ${utcWithMs}`,
            ...this.generateCityTimeItems()
        ];
        const tickerText = bannerItems.join('  •  ');
        const repeatedText = tickerText + '  •  ' + tickerText + '  •  ' + tickerText + '  •  ';
        this.element.textContent = repeatedText;
        if (!this.animationInitialized) {
            this.updateTickerAnimation();
            this.animationInitialized = true;
        }
    }
    updateTickerAnimation() {
        if (!this.element) return;
        this.element.style.animation = 'none';
        this.element.offsetHeight; 
        const screenWidth = window.innerWidth;
        const fullTextWidth = this.element.scrollWidth;
        const oneThirdWidth = fullTextWidth / 3;
        const totalDistance = screenWidth + oneThirdWidth;
        const duration = Math.max(25, totalDistance / 35); 
        this.element.style.animation = `ticker-scroll ${duration}s linear infinite`;
        console.log(`Ticker: ${duration}s duration, moving ${totalDistance}px (screen ${screenWidth}px + 1/3 content ${oneThirdWidth}px)`);
    }
    generateCityTimeItems() {
        const items = [];
        Object.entries(this.cityTimes).forEach(([city, data]) => {
            items.push(`${city}: ${data.time}`);
        });
        return items;
    }
    startUpdateLoop() {
        setInterval(() => {
            this.updateCityTimes();
            this.renderBanner();
        }, 100);
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CityTimeTicker;
}