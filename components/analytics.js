class Analytics {
    constructor() {
        this.storageKey = 'wwwwwh_analytics';
        this.sectionStats = {};
        this.currentSection = null;
        this.sectionStartTime = null;
        this.init();
    }

    init() {
        // Load existing stats
        this.loadStats();
        
        // Save stats periodically
        setInterval(() => this.saveStats(), 10000); // Every 10 seconds
        
        // Save on unload
        window.addEventListener('beforeunload', () => {
            this.endCurrentSection();
            this.saveStats();
        });

        console.log('📊 Analytics initialized - Tracking section access and engagement');
    }

    trackSection(sectionName, sectionId) {
        // End previous section timing
        this.endCurrentSection();
        
        // Initialize section stats if needed
        if (!this.sectionStats[sectionName]) {
            this.sectionStats[sectionName] = {
                id: sectionId,
                name: sectionName,
                accessCount: 0,
                totalTimeSpent: 0, // milliseconds
                lastAccessed: null,
                firstAccessed: null
            };
        }
        
        const section = this.sectionStats[sectionName];
        section.accessCount++;
        section.lastAccessed = new Date().toISOString();
        
        if (!section.firstAccessed) {
            section.firstAccessed = new Date().toISOString();
        }
        
        // Start timing this section
        this.currentSection = sectionName;
        this.sectionStartTime = Date.now();
        
        console.log(`📊 Section accessed: ${sectionName} (${section.accessCount} times)`);
        this.saveStats();
        
        // Send to API (async, don't wait)
        this.sendToAPI(sectionName, sectionId, 0);
    }

    endCurrentSection() {
        if (this.currentSection && this.sectionStartTime) {
            const timeSpent = Date.now() - this.sectionStartTime;
            this.sectionStats[this.currentSection].totalTimeSpent += timeSpent;
            
            console.log(`📊 Time on ${this.currentSection}: ${(timeSpent / 1000).toFixed(1)}s`);
            
            // Send time spent to API
            this.sendToAPI(this.currentSection, this.sectionStats[this.currentSection].id, timeSpent);
            
            this.currentSection = null;
            this.sectionStartTime = null;
        }
    }

    async sendToAPI(sectionName, sectionId, timeSpent) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sectionName, sectionId, timeSpent })
            });
        } catch (error) {
            console.warn('Failed to send analytics to server:', error);
        }
    }

    async fetchServerStats() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            return data.sections || [];
        } catch (error) {
            console.error('Failed to fetch server stats:', error);
            return [];
        }
    }

    async getSectionCount(sectionName) {
        try {
            const response = await fetch(`/api/analytics?action=section&name=${encodeURIComponent(sectionName)}`);
            const data = await response.json();
            return data.accessCount || 0;
        } catch (error) {
            console.warn('Failed to fetch section count:', error);
            return 0;
        }
    }

    async getClickCounts() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            const counts = {};
            (data.sections || []).forEach(section => {
                counts[section.name] = section.accessCount;
            });
            return counts;
        } catch (error) {
            console.warn('Failed to fetch click counts:', error);
            return {};
        }
    }

    saveStats() {
        try {
            // Don't end current section when auto-saving
            const stats = { ...this.sectionStats };
            localStorage.setItem(this.storageKey, JSON.stringify(stats));
        } catch (e) {
            console.warn('Failed to save analytics:', e);
        }
    }

    loadStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.sectionStats = JSON.parse(stored);
                console.log('📊 Loaded analytics for', Object.keys(this.sectionStats).length, 'sections');
            }
        } catch (e) {
            console.warn('Failed to load analytics:', e);
            this.sectionStats = {};
        }
    }

    getStats() {
        // Convert stats to sorted array with calculated fields
        const stats = Object.values(this.sectionStats).map(section => ({
            ...section,
            avgTimeSpent: section.accessCount > 0 
                ? (section.totalTimeSpent / section.accessCount / 1000).toFixed(1) 
                : 0,
            totalTimeFormatted: this.formatTime(section.totalTimeSpent),
            lastAccessedAgo: section.lastAccessed 
                ? this.timeAgo(new Date(section.lastAccessed))
                : 'Never'
        }));
        
        return stats;
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'just now';
    }

    async printStats() {
        console.log('\n📊 SECTION ANALYTICS (ALL USERS)');
        console.log('='.repeat(80));
        console.log('Fetching aggregate data from server...\n');
        
        const serverStats = await this.fetchServerStats();
        
        if (serverStats.length === 0) {
            console.log('No server data available yet.');
            return [];
        }
        
        // Format stats
        const stats = serverStats.map(section => ({
            ...section,
            avgTimeSpent: section.accessCount > 0 
                ? (section.totalTimeSpent / section.accessCount / 1000).toFixed(1) 
                : 0,
            totalTimeFormatted: this.formatTime(section.totalTimeSpent),
            lastAccessedAgo: section.lastAccessed 
                ? this.timeAgo(new Date(section.lastAccessed))
                : 'Never'
        }));
        
        // Sort by access count
        console.log('\n🔥 MOST ACCESSED SECTIONS:');
        const byAccess = [...stats].sort((a, b) => b.accessCount - a.accessCount);
        byAccess.slice(0, 10).forEach((section, i) => {
            console.log(`${i + 1}. ${section.name}`);
            console.log(`   Access count: ${section.accessCount} times`);
            console.log(`   Total time: ${section.totalTimeFormatted}`);
            console.log(`   Avg time: ${section.avgTimeSpent}s per visit`);
            console.log(`   Last accessed: ${section.lastAccessedAgo}`);
            console.log('');
        });
        
        // Sort by total time spent
        console.log('\n⏱️  MOST ENGAGING CONTENT (Total Time):');
        const byTime = [...stats].sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);
        byTime.slice(0, 10).forEach((section, i) => {
            console.log(`${i + 1}. ${section.name}`);
            console.log(`   Total time: ${section.totalTimeFormatted}`);
            console.log(`   Access count: ${section.accessCount} times`);
            console.log(`   Avg time: ${section.avgTimeSpent}s per visit`);
            console.log('');
        });
        
        // Sort by average time per visit
        console.log('\n🎯 HIGHEST ENGAGEMENT PER VISIT (Avg Time):');
        const byAvg = [...stats].sort((a, b) => 
            (b.totalTimeSpent / b.accessCount) - (a.totalTimeSpent / a.accessCount)
        );
        byAvg.slice(0, 10).forEach((section, i) => {
            console.log(`${i + 1}. ${section.name}`);
            console.log(`   Avg time: ${section.avgTimeSpent}s per visit`);
            console.log(`   Total time: ${section.totalTimeFormatted}`);
            console.log(`   Access count: ${section.accessCount} times`);
            console.log('');
        });
        
        console.log('='.repeat(80));
        console.log(`Total sections tracked: ${stats.length}`);
        console.log('\n');
        
        return stats;
    }

    exportStats() {
        const stats = this.getStats();
        const data = {
            exportDate: new Date().toISOString(),
            totalSections: stats.length,
            sections: stats
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `section-analytics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📊 Analytics exported');
    }

    clearStats() {
        if (confirm('Clear all analytics data? This cannot be undone.')) {
            this.sectionStats = {};
            this.currentSection = null;
            this.sectionStartTime = null;
            localStorage.removeItem(this.storageKey);
            console.log('📊 Analytics cleared');
        }
    }
}

// Global instance
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
