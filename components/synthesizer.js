class Synthesizer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            octaves: options.octaves || 3,
            startOctave: options.startOctave || 3,
            waveform: options.waveform || 'sine',
            ...options
        };
        
        // Audio context
        this.audioContext = null;
        this.masterGain = null;
        this.activeNotes = new Map(); // Track playing notes
        
        // Synth parameters
        this.currentOctave = this.options.startOctave;
        this.waveform = this.options.waveform;
        this.attack = 0.01;
        this.decay = 0.1;
        this.sustain = 0.7;
        this.release = 0.3;
        this.filterFrequency = 2000;
        this.filterQ = 1;
        
        // Keyboard mappings (QWERTY to piano keys)
        this.keyMap = {
            // White keys
            'a': 'C', 's': 'D', 'd': 'E', 'f': 'F', 'g': 'G', 'h': 'A', 'j': 'B',
            // Black keys
            'w': 'C#', 'e': 'D#', 't': 'F#', 'y': 'G#', 'u': 'A#'
        };
        
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
    }
    
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioContext.destination);
            console.log('🎹 Synthesizer audio context initialized');
        }
    }
    
    render() {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let keysHtml = '';
        
        // Generate keys for specified octaves
        for (let octave = 0; octave < this.options.octaves; octave++) {
            const currentOctave = this.options.startOctave + octave;
            notes.forEach(note => {
                const isBlack = note.includes('#');
                const keyClass = isBlack ? 'synth-key black' : 'synth-key white';
                const noteId = `${note}${currentOctave}`;
                const frequency = this.getFrequency(note, currentOctave);
                
                keysHtml += `
                    <div class="${keyClass}" 
                         data-note="${noteId}" 
                         data-frequency="${frequency}"
                         data-is-black="${isBlack}">
                        <span class="note-label">${note}</span>
                    </div>
                `;
            });
        }
        
        this.container.innerHTML = `
            <div class="synthesizer-container">
                <div class="synth-header">
                    <h3>🎹 Synthesizer</h3>
                    <div class="synth-info">Octave ${this.currentOctave} | ${this.waveform}</div>
                </div>
                
                <div class="synth-controls">
                    <div class="control-group">
                        <label>Waveform</label>
                        <select id="waveform-select">
                            <option value="sine">Sine</option>
                            <option value="square">Square</option>
                            <option value="sawtooth">Sawtooth</option>
                            <option value="triangle">Triangle</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>Octave</label>
                        <div class="octave-controls">
                            <button id="octave-down">-</button>
                            <span id="octave-display">${this.currentOctave}</span>
                            <button id="octave-up">+</button>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Attack: <span id="attack-value">${this.attack}s</span></label>
                        <input type="range" id="attack-slider" min="0.001" max="1" step="0.001" value="${this.attack}">
                    </div>
                    
                    <div class="control-group">
                        <label>Release: <span id="release-value">${this.release}s</span></label>
                        <input type="range" id="release-slider" min="0.001" max="2" step="0.001" value="${this.release}">
                    </div>
                    
                    <div class="control-group">
                        <label>Filter: <span id="filter-value">${this.filterFrequency}Hz</span></label>
                        <input type="range" id="filter-slider" min="100" max="10000" step="10" value="${this.filterFrequency}">
                    </div>
                </div>
                
                <div class="synth-keyboard">
                    ${keysHtml}
                </div>
                
                <div class="synth-footer">
                    <div class="keyboard-hint">
                        Use computer keyboard: A-J (white keys) | W,E,T,Y,U (black keys) | Z/X (octave down/up)
                    </div>
                    <div class="touch-hint">
                        Touch/click keys to play | Drag on key to modulate
                    </div>
                </div>
            </div>
        `;
        
        this.addStyles();
    }
    
    attachEventListeners() {
        const keys = this.container.querySelectorAll('.synth-key');
        
        // Touch/Mouse events for keys
        keys.forEach(key => {
            // Mouse events
            key.addEventListener('mousedown', (e) => this.handleKeyDown(e));
            key.addEventListener('mouseup', (e) => this.handleKeyUp(e));
            key.addEventListener('mouseleave', (e) => this.handleKeyUp(e));
            key.addEventListener('mousemove', (e) => this.handleKeyMove(e));
            
            // Touch events
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyDown(e);
            });
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleKeyUp(e);
            });
            key.addEventListener('touchmove', (e) => {
                e.preventDefault();
                this.handleKeyMove(e);
            });
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboardDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyboardUp(e));
        
        // Controls
        const waveformSelect = document.getElementById('waveform-select');
        if (waveformSelect) {
            waveformSelect.value = this.waveform;
            waveformSelect.addEventListener('change', (e) => {
                this.waveform = e.target.value;
                this.updateInfo();
            });
        }
        
        const octaveUp = document.getElementById('octave-up');
        const octaveDown = document.getElementById('octave-down');
        if (octaveUp) octaveUp.addEventListener('click', () => this.changeOctave(1));
        if (octaveDown) octaveDown.addEventListener('click', () => this.changeOctave(-1));
        
        const attackSlider = document.getElementById('attack-slider');
        if (attackSlider) {
            attackSlider.addEventListener('input', (e) => {
                this.attack = parseFloat(e.target.value);
                document.getElementById('attack-value').textContent = this.attack.toFixed(3) + 's';
            });
        }
        
        const releaseSlider = document.getElementById('release-slider');
        if (releaseSlider) {
            releaseSlider.addEventListener('input', (e) => {
                this.release = parseFloat(e.target.value);
                document.getElementById('release-value').textContent = this.release.toFixed(3) + 's';
            });
        }
        
        const filterSlider = document.getElementById('filter-slider');
        if (filterSlider) {
            filterSlider.addEventListener('input', (e) => {
                this.filterFrequency = parseInt(e.target.value);
                document.getElementById('filter-value').textContent = this.filterFrequency + 'Hz';
            });
        }
    }
    
    handleKeyDown(event) {
        this.initAudioContext();
        const key = event.currentTarget;
        const note = key.dataset.note;
        const frequency = parseFloat(key.dataset.frequency);
        
        if (!this.activeNotes.has(note)) {
            key.classList.add('active');
            this.playNote(note, frequency);
        }
    }
    
    handleKeyUp(event) {
        const key = event.currentTarget;
        const note = key.dataset.note;
        
        key.classList.remove('active');
        this.stopNote(note);
    }
    
    handleKeyMove(event) {
        if (!this.activeNotes.has(event.currentTarget.dataset.note)) return;
        
        const key = event.currentTarget;
        const rect = key.getBoundingClientRect();
        
        // Vertical position controls filter (trackpad gesture)
        const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;
        const normalizedY = 1 - (y / rect.height); // 0 to 1, inverted
        
        const noteData = this.activeNotes.get(key.dataset.note);
        if (noteData && noteData.filter) {
            // Modulate filter frequency based on vertical position
            const minFreq = 200;
            const maxFreq = 8000;
            const targetFreq = minFreq + (normalizedY * (maxFreq - minFreq));
            noteData.filter.frequency.setTargetAtTime(targetFreq, this.audioContext.currentTime, 0.01);
        }
    }
    
    handleKeyboardDown(event) {
        if (event.repeat) return;
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;
        
        const key = event.key.toLowerCase();
        
        // Octave controls
        if (key === 'z') {
            this.changeOctave(-1);
            return;
        }
        if (key === 'x') {
            this.changeOctave(1);
            return;
        }
        
        // Note mapping
        if (this.keyMap[key]) {
            const note = `${this.keyMap[key]}${this.currentOctave}`;
            const keyElement = this.container.querySelector(`[data-note="${note}"]`);
            if (keyElement && !this.activeNotes.has(note)) {
                keyElement.classList.add('active');
                const frequency = parseFloat(keyElement.dataset.frequency);
                this.playNote(note, frequency);
            }
        }
    }
    
    handleKeyboardUp(event) {
        const key = event.key.toLowerCase();
        
        if (this.keyMap[key]) {
            const note = `${this.keyMap[key]}${this.currentOctave}`;
            const keyElement = this.container.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
                this.stopNote(note);
            }
        }
    }
    
    playNote(note, frequency) {
        if (this.activeNotes.has(note)) return;
        
        const now = this.audioContext.currentTime;
        
        // Create oscillator
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = this.waveform;
        oscillator.frequency.value = frequency;
        
        // Create filter
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = this.filterFrequency;
        filter.Q.value = this.filterQ;
        
        // Create envelope (gain node)
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0;
        
        // Connect: oscillator -> filter -> gain -> master
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Apply ADSR envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.8, now + this.attack); // Attack
        gainNode.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay); // Decay to sustain
        
        oscillator.start(now);
        
        this.activeNotes.set(note, {
            oscillator,
            gainNode,
            filter,
            startTime: now
        });
    }
    
    stopNote(note) {
        const noteData = this.activeNotes.get(note);
        if (!noteData) return;
        
        const now = this.audioContext.currentTime;
        
        // Apply release envelope
        noteData.gainNode.gain.cancelScheduledValues(now);
        noteData.gainNode.gain.setValueAtTime(noteData.gainNode.gain.value, now);
        noteData.gainNode.gain.linearRampToValueAtTime(0, now + this.release);
        
        // Stop oscillator after release
        noteData.oscillator.stop(now + this.release);
        
        this.activeNotes.delete(note);
    }
    
    changeOctave(delta) {
        this.currentOctave = Math.max(0, Math.min(8, this.currentOctave + delta));
        this.updateInfo();
        document.getElementById('octave-display').textContent = this.currentOctave;
    }
    
    updateInfo() {
        const info = this.container.querySelector('.synth-info');
        if (info) {
            info.textContent = `Octave ${this.currentOctave} | ${this.waveform}`;
        }
    }
    
    getFrequency(note, octave) {
        const A4 = 440;
        const notes = {
            'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4,
            'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2
        };
        
        const halfSteps = notes[note] + (octave - 4) * 12;
        return A4 * Math.pow(2, halfSteps / 12);
    }
    
    addStyles() {
        if (document.getElementById('synth-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'synth-styles';
        style.textContent = `
            .synthesizer-container {
                max-width: 1024px;
                margin: 20px auto;
                background: #1a1a1a;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                font-family: var(--font-mono);
            }
            
            .synth-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                margin-bottom: 20px;
            }
            
            .synth-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .synth-info {
                font-size: 12px;
                color: #888;
            }
            
            .synth-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
                padding: 15px;
                background: #0a0a0a;
                border-radius: 8px;
            }
            
            .control-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .control-group label {
                color: #aaa;
                font-size: 11px;
                text-transform: uppercase;
            }
            
            .control-group select,
            .control-group input[type="range"] {
                background: #222;
                color: #fff;
                border: 1px solid #333;
                padding: 5px;
                border-radius: 4px;
                font-family: var(--font-mono);
            }
            
            .octave-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .octave-controls button {
                background: #333;
                color: #fff;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }
            
            .octave-controls button:hover {
                background: #444;
            }
            
            .octave-controls span {
                color: #fff;
                min-width: 20px;
                text-align: center;
            }
            
            .synth-keyboard {
                display: flex;
                height: 200px;
                background: #0a0a0a;
                border-radius: 8px;
                padding: 10px;
                overflow-x: auto;
                position: relative;
            }
            
            .synth-key {
                position: relative;
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                transition: all 0.05s ease;
            }
            
            .synth-key.white {
                width: 40px;
                background: linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);
                border: 1px solid #000;
                border-radius: 0 0 4px 4px;
                margin-right: -1px;
                z-index: 1;
            }
            
            .synth-key.black {
                width: 28px;
                height: 120px;
                background: linear-gradient(to bottom, #000 0%, #222 100%);
                border: 1px solid #000;
                border-radius: 0 0 3px 3px;
                margin-left: -14px;
                margin-right: -14px;
                z-index: 2;
            }
            
            .synth-key.white.active {
                background: linear-gradient(to bottom, #4CAF50 0%, #45a049 100%);
                transform: translateY(2px);
            }
            
            .synth-key.black.active {
                background: linear-gradient(to bottom, #2196F3 0%, #1976D2 100%);
                transform: translateY(2px);
            }
            
            .synth-key.white:hover {
                background: linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%);
            }
            
            .synth-key.black:hover {
                background: linear-gradient(to bottom, #222 0%, #333 100%);
            }
            
            .note-label {
                font-size: 10px;
                margin-bottom: 5px;
                opacity: 0.4;
                transition: opacity 0.2s;
            }
            
            .synth-key.white .note-label {
                color: #000;
            }
            
            .synth-key.black .note-label {
                color: #fff;
            }
            
            .synth-key:hover .note-label {
                opacity: 1;
            }
            
            .synth-footer {
                margin-top: 15px;
                padding: 10px;
                background: #0a0a0a;
                border-radius: 8px;
            }
            
            .keyboard-hint,
            .touch-hint {
                color: #666;
                font-size: 10px;
                text-align: center;
                margin: 5px 0;
            }
            
            @media (max-width: 768px) {
                .synthesizer-container {
                    padding: 10px;
                }
                
                .synth-controls {
                    grid-template-columns: 1fr;
                }
                
                .synth-keyboard {
                    height: 150px;
                }
                
                .synth-key.white {
                    width: 35px;
                }
                
                .synth-key.black {
                    width: 24px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Synthesizer;
}
