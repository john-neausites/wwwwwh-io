class ColorPaletteBuilder {
    constructor(paletteInstance) {
        this.palette = paletteInstance;
        this.container = null;
        this.currentPaletteName = 'Spring';
        this.savedSwatch = null;
        
        // Define complete color palettes
        this.palettes = {
            Spring: {
                bases: ['#F8FAFC', '#FFFEF5', '#C7D2FE', '#93C5FD', '#5EEAD4', '#FED7E2', '#FEF08A', '#FDBA74'],
                neutrals: ['#71717A', '#78716C', '#78350F', '#A16207', '#292524', '#3F6212', '#581C87', '#134E4A', '#1E3A8A', '#1E40AF'],
                accents: ['#8B5CF6', '#A855F7', '#3B82F6', '#059669', '#10B981', '#84CC16', '#F87171', '#FB7185', '#F472B6', '#FB923C', '#F59E0B'],
                layers: ['#A5B4FC', '#0D9488', '#0891B2', '#06B6D4', '#00CED1', '#40E0D0', '#14B8A6', '#65A30D', '#FDE047', '#F9A8D4', '#FCA5A5', '#FDA4AF', '#FCD34D']
            },
            Neon: {
                bases: ['#000000', '#1A1A2E', '#0F0F23', '#16213E'],
                neutrals: ['#2D2D44', '#3E3E5C', '#4A4A6A', '#1C1C3A'],
                accents: ['#FF006E', '#00F5FF', '#39FF14', '#FFFF00', '#FF10F0', '#00FFD1', '#FF3131', '#FDFF00'],
                layers: ['#FF1493', '#00FFFF', '#7FFF00', '#FF4500', '#FF00FF', '#00FF00', '#FFD700', '#FF69B4']
            },
            California: {
                bases: ['#FFF8DC', '#FFFACD', '#FFE4B5', '#FFEFD5', '#F0E68C', '#EEE8AA'],
                neutrals: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#B8860B', '#DAA520'],
                accents: ['#FF6347', '#FF8C00', '#FFA500', '#FFD700', '#00CED1', '#4682B4', '#FF1493', '#9370DB'],
                layers: ['#FFA07A', '#FA8072', '#E9967A', '#F08080', '#87CEEB', '#87CEFA', '#DDA0DD', '#BA55D3']
            },
            Arctic: {
                bases: ['#F0F8FF', '#E0FFFF', '#F0FFFF', '#E6F3FF', '#EBF5FB'],
                neutrals: ['#2C3E50', '#34495E', '#546E7A', '#455A64', '#607D8B'],
                accents: ['#3498DB', '#2980B9', '#1ABC9C', '#16A085', '#5DADE2', '#48C9B0'],
                layers: ['#AED6F1', '#A9CCE3', '#85C1E2', '#7FB3D5', '#76D7C4', '#73C6B6']
            },
            Desert: {
                bases: ['#FAEBD7', '#FFE4C4', '#FFDEAD', '#F5DEB3', '#DEB887'],
                neutrals: ['#8B4513', '#A0522D', '#D2691E', '#BC8F8F', '#CD853F'],
                accents: ['#DC143C', '#B22222', '#8B0000', '#FF6347', '#CD5C5C', '#E74C3C'],
                layers: ['#F4A460', '#E9967A', '#FA8072', '#FFA07A', '#CD5555', '#C04000']
            },
            Primary: {
                bases: ['#FFFFFF', '#FFFFCC', '#FFE6E6', '#E6F2FF', '#FFF9E6'],
                neutrals: ['#000000', '#333333', '#4A4A4A', '#666666', '#808080'],
                accents: ['#FF0000', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#00FF00'],
                layers: ['#FF6B6B', '#4D96FF', '#FFE66D', '#FF6BFF', '#6BFFFF', '#6BFF6B']
            },
            Cathedral: {
                bases: ['#F5E6D3', '#E8D7C3', '#FFF8E7', '#F0E5D8', '#EBD9C5'],
                neutrals: ['#5C4033', '#8B6F47', '#6B5D52', '#4A3728', '#7A6A5A'],
                accents: ['#C9A55F', '#A67C52', '#8B7355', '#D4AF37', '#CD853F'],
                layers: ['#B8986B', '#9B8066', '#C5A572', '#A89176', '#DCC9A8']
            },
            Forest: {
                bases: ['#F0F4E8', '#E8F3E0', '#F5F9F0', '#EDF5E6', '#E0EDD5'],
                neutrals: ['#2C3E2F', '#3A5240', '#1E3A1E', '#4A5C4A', '#354935'],
                accents: ['#228B22', '#2E8B57', '#3CB371', '#66CD00', '#32CD32', '#00A86B'],
                layers: ['#90EE90', '#8FBC8F', '#98D98E', '#7CFC00', '#ADFF2F', '#9ACD32']
            },
            Ocean: {
                bases: ['#F0F8FF', '#E0F6FF', '#F5FCFF', '#EBF8FF', '#D9F2FF'],
                neutrals: ['#1C2833', '#1F4E78', '#154360', '#21618C', '#2E4053'],
                accents: ['#0080FF', '#1E90FF', '#00BFFF', '#4169E1', '#6495ED', '#5F9EA0'],
                layers: ['#87CEEB', '#87CEFA', '#B0E0E6', '#ADD8E6', '#AFEEEE', '#B0C4DE']
            },
            Sunset: {
                bases: ['#FFF5E6', '#FFE6CC', '#FFEEDD', '#FFE4B5', '#FFDAB9'],
                neutrals: ['#4A2511', '#663300', '#5C3317', '#704214', '#8B4513'],
                accents: ['#FF6347', '#FF4500', '#FF8C00', '#FFA500', '#FFB347', '#FF7F50'],
                layers: ['#FFCBA4', '#FFB88C', '#FFAA77', '#FF9966', '#FF8855', '#FFAB91']
            },
            Lavender: {
                bases: ['#F8F4FF', '#F3EBFF', '#FBF7FF', '#F0E6FF', '#EFE6F7'],
                neutrals: ['#4A3B5C', '#5A4A6A', '#3E2F4A', '#6B5B7B', '#52426A'],
                accents: ['#9B59B6', '#8E44AD', '#BA55D3', '#9370DB', '#DDA0DD', '#DA70D6'],
                layers: ['#E6D7F7', '#D8BFD8', '#E0B0FF', '#C39BD3', '#C8A2C8', '#B19CD9']
            },
            Monochrome: {
                bases: ['#FFFFFF', '#F5F5F5', '#EBEBEB', '#E0E0E0', '#D6D6D6'],
                neutrals: ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666'],
                accents: ['#808080', '#999999', '#B3B3B3', '#CCCCCC', '#A6A6A6', '#8C8C8C'],
                layers: ['#C0C0C0', '#D3D3D3', '#BEBEBE', '#A9A9A9', '#909090', '#7A7A7A']
            },
            Odyssey2001: {
                bases: ['#FFFFFF', '#F8F8F8', '#EFEFEF', '#E8E8E8', '#F0F0F0'],
                neutrals: ['#000000', '#0A0A0A', '#1A1A1A', '#2B2B2B', '#3C3C3C'],
                accents: ['#FF0000', '#DC143C', '#8B0000', '#B22222', '#CD5C5C', '#FF6B6B'],
                layers: ['#F5F5F5', '#DCDCDC', '#C0C0C0', '#A9A9A9', '#808080', '#696969']
            },
            Midnight: {
                bases: ['#0A0A0F', '#121218', '#1A1A24', '#1C1C28', '#252530'],
                neutrals: ['#8B8B9F', '#A0A0B5', '#B5B5CA', '#CACADF', '#E0E0F0'],
                accents: ['#4A90E2', '#5FA3E8', '#74B6EE', '#89C9F4', '#50C878', '#60D090'],
                layers: ['#2A2A3F', '#353548', '#404056', '#4B4B64', '#565672', '#616180']
            },
            Light: {
                bases: ['#FFFFFF', '#FEFEFE', '#FCFCFC', '#FAFAFA', '#F8F8F8'],
                neutrals: ['#E8E8E8', '#D0D0D0', '#B8B8B8', '#A0A0A0', '#888888'],
                accents: ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'],
                layers: ['#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575']
            },
            Autumn: {
                bases: ['#FFF8E7', '#FFEEC8', '#FFE5AA', '#FFD88C', '#FFCF70'],
                neutrals: ['#3E2723', '#4E342E', '#5D4037', '#6D4C41', '#795548'],
                accents: ['#D84315', '#E64A19', '#F4511E', '#FF5722', '#FF6F00', '#FF8F00'],
                layers: ['#FFAB91', '#FFCCBC', '#BCAAA4', '#A1887F', '#8D6E63', '#D7CCC8']
            },
            Coral: {
                bases: ['#FFF5F3', '#FFE8E5', '#FFDCD6', '#FFD0C8', '#FFC4B9'],
                neutrals: ['#2C1810', '#422418', '#583020', '#6E3C28', '#844830'],
                accents: ['#FF7F50', '#FF6347', '#FF4500', '#FF8C69', '#FFA07A', '#FFB6A3'],
                layers: ['#FFD4C4', '#FFE0D5', '#FFEAE6', '#F4C2C2', '#EAA8A8', '#E09090']
            },
            Emerald: {
                bases: ['#E8F8F5', '#D1F2EB', '#A9DFBF', '#7DCEA0', '#52BE80'],
                neutrals: ['#154360', '#1A5276', '#1F618D', '#2471A3', '#2980B9'],
                accents: ['#27AE60', '#229954', '#1E8449', '#196F3D', '#0E6655', '#117A65'],
                layers: ['#76D7C4', '#73C6B6', '#7DCEA0', '#82E0AA', '#ABEBC6', '#D5F4E6']
            },
            Ruby: {
                bases: ['#FFF0F0', '#FFE0E0', '#FFD0D0', '#FFC0C0', '#FFB0B0'],
                neutrals: ['#3D0814', '#530F1C', '#691624', '#7F1D2C', '#952434'],
                accents: ['#C0392B', '#E74C3C', '#EC7063', '#F1948A', '#922B21', '#A93226'],
                layers: ['#F5B7B1', '#FADBD8', '#F2D7D5', '#E6B0AA', '#D98880', '#CD6155']
            },
            Cyber: {
                bases: ['#0D0D0F', '#1A1A1F', '#27272F', '#34343F', '#41414F'],
                neutrals: ['#D0D0E0', '#B0B0D0', '#9090C0', '#7070B0', '#5050A0'],
                accents: ['#00FFFF', '#00E5FF', '#00CCFF', '#00B2FF', '#FF00FF', '#E600E6'],
                layers: ['#004D4D', '#006666', '#008080', '#009999', '#660066', '#800080']
            },
            PinkGreen: {
                bases: ['#FFF0F5', '#FFE4F0', '#F0FFF0', '#E8F8E8', '#F5F5F5'],
                neutrals: ['#4A4A4A', '#5C5C5C', '#6E6E6E', '#808080', '#929292'],
                accents: ['#FF69B4', '#FF1493', '#FF85C1', '#00FF00', '#32CD32', '#00D000'],
                layers: ['#FFB6D9', '#FFC0E0', '#90EE90', '#98FB98', '#7CFC00', '#ADFF2F']
            },
            BlueOrange: {
                bases: ['#E6F3FF', '#D9ECFF', '#FFF5E6', '#FFE8D1', '#F0F0F0'],
                neutrals: ['#3C3C3C', '#4F4F4F', '#626262', '#757575', '#888888'],
                accents: ['#0066CC', '#0080FF', '#4D94FF', '#FF8C00', '#FFA500', '#FF6600'],
                layers: ['#6BB6FF', '#87CEEB', '#FFB347', '#FFCC80', '#FFA07A', '#FF7F50']
            },
            RedBlue: {
                bases: ['#FFE6E6', '#FFD9D9', '#E6F0FF', '#D9E8FF', '#F2F2F2'],
                neutrals: ['#404040', '#535353', '#666666', '#797979', '#8C8C8C'],
                accents: ['#FF0000', '#DC143C', '#FF4444', '#0000FF', '#0066FF', '#4169E1'],
                layers: ['#FF6B6B', '#FF8080', '#6B9BD1', '#87CEEB', '#4D94FF', '#B0C4DE']
            },
            YellowPurple: {
                bases: ['#FFFEF0', '#FFF9CC', '#F5F0FF', '#EBE0FF', '#F8F8F8'],
                neutrals: ['#3A3A3A', '#4D4D4D', '#606060', '#737373', '#868686'],
                accents: ['#FFD700', '#FFC700', '#FFEB3B', '#9B59B6', '#8B008B', '#6A0DAD'],
                layers: ['#FFE680', '#FFEF99', '#D8BFD8', '#DDA0DD', '#BA55D3', '#E6E6FA']
            },
            MatteBlack: {
                bases: ['#1C1C1C', '#282828', '#333333', '#3D3D3D', '#474747'],
                neutrals: ['#5A5A5A', '#6D6D6D', '#808080', '#939393', '#A6A6A6'],
                accents: ['#404040', '#4D4D4D', '#595959', '#666666', '#737373', '#808080'],
                layers: ['#1A1A1A', '#262626', '#303030', '#3B3B3B', '#454545', '#505050']
            }
        };
        
        this.paletteNames = Object.keys(this.palettes);
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'color-app';
        
        const header = document.createElement('div');
        header.className = 'color-header';
        
        // Add palette selector buttons
        const paletteSelector = document.createElement('div');
        paletteSelector.className = 'palette-selector';
        
        this.paletteNames.forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'palette-btn';
            btn.dataset.palette = name;
            btn.title = name; // Tooltip shows palette name
            
            // Create sunburst visualization with all colors from the palette
            const pal = this.palettes[name];
            const allColors = [...pal.bases, ...pal.neutrals, ...pal.accents, ...pal.layers];
            
            // Create a conic gradient using all colors
            const totalColors = allColors.length;
            const segments = allColors.map((color, i) => {
                const startAngle = (i / totalColors) * 100;
                const endAngle = ((i + 1) / totalColors) * 100;
                return `${color} ${startAngle}% ${endAngle}%`;
            }).join(', ');
            
            btn.style.background = `conic-gradient(from 0deg, ${segments})`;
            btn.style.border = 'none';
            
            if (name === this.currentPaletteName) {
                btn.classList.add('active');
            }
            
            paletteSelector.appendChild(btn);
        });
        
        header.appendChild(paletteSelector);
        
        // Add saved swatch section
        const swatchSection = this.renderSavedSwatchSection();
        container.appendChild(header);
        container.appendChild(swatchSection);
        
        // Render each category for current palette
        const sections = ['bases', 'neutrals', 'accents', 'layers'];
        sections.forEach(section => {
            const sectionEl = this.renderSection(section);
            container.appendChild(sectionEl);
        });
        
        this.container = container;
        this.addStyles();
        
        return container;
    }
    
    renderSavedSwatchSection() {
        const section = document.createElement('div');
        section.className = 'saved-swatch-section';
        
        const title = document.createElement('h3');
        title.className = 'swatch-title';
        title.textContent = 'Current Theme';
        
        const swatchContainer = document.createElement('div');
        swatchContainer.className = 'current-swatch-container';
        
        // Create full-width color swatches
        const swatchGrid = document.createElement('div');
        swatchGrid.className = 'current-theme-grid';
        
        const roles = [
            { key: 'base', label: 'Base', class: 'base-swatch' },
            { key: 'neutral', label: 'Neutral', class: 'neutral-swatch' },
            { key: 'accent', label: 'Accent', class: 'accent-swatch' },
            { key: 'layer', label: 'Layer', class: 'layer-swatch' }
        ];
        
        roles.forEach(role => {
            const swatch = document.createElement('div');
            swatch.className = `current-theme-swatch ${role.class}`;
            swatch.dataset.role = role.key;
            swatch.innerHTML = `
                <div class="theme-swatch-label">${role.label}</div>
                <div class="theme-swatch-hex">-</div>
            `;
            swatchGrid.appendChild(swatch);
        });
        
        swatchContainer.appendChild(swatchGrid);
        
        // Actions section
        const actions = document.createElement('div');
        actions.className = 'swatch-actions';
        actions.innerHTML = `
            <button class="save-swatch-btn">Save Current Theme</button>
            <button class="download-brand-btn" disabled>Download Brand Template</button>
        `;
        swatchContainer.appendChild(actions);
        
        // Upload section
        const uploadSection = document.createElement('div');
        uploadSection.className = 'upload-section';
        uploadSection.innerHTML = `
            <div class="upload-dropzone">
                <div class="upload-icon">📁</div>
                <div class="upload-text">Drop brand template here</div>
                <div class="upload-subtext">or click to browse</div>
                <input type="file" class="upload-input" accept=".txt" style="display: none;">
            </div>
        `;
        swatchContainer.appendChild(uploadSection);
        
        section.appendChild(title);
        section.appendChild(swatchContainer);
        
        return section;
    }
    
    renderSection(category) {
        const section = document.createElement('div');
        section.className = 'color-section';
        section.dataset.category = category;
        
        const title = document.createElement('h3');
        title.className = 'section-title';
        title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        const grid = document.createElement('div');
        grid.className = 'color-grid';
        
        const currentPalette = this.palettes[this.currentPaletteName];
        currentPalette[category].forEach((hex, index) => {
            const chip = this.renderColorChip({ name: `${category}-${index}`, hex }, category);
            grid.appendChild(chip);
        });
        
        section.appendChild(title);
        section.appendChild(grid);
        
        return section;
    }
    
    renderColorChip(color, category) {
        const chip = document.createElement('div');
        chip.className = 'color-chip';
        chip.dataset.category = category;
        chip.dataset.hex = color.hex;
        
        const swatch = document.createElement('div');
        swatch.className = 'chip-swatch';
        swatch.style.backgroundColor = color.hex;
        
        const info = document.createElement('div');
        info.className = 'chip-info';
        
        const name = document.createElement('div');
        name.className = 'color-name';
        name.textContent = this.formatColorName(color.name);
        
        const codes = document.createElement('div');
        codes.className = 'color-codes';
        
        // Convert hex to RGB, CMYK, HSL
        const rgb = this.hexToRgb(color.hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        
        const hexRow = document.createElement('div');
        hexRow.className = 'code-row';
        hexRow.innerHTML = `<span class="code-label">HEX:</span><span>${color.hex}</span>`;
        
        const rgbRow = document.createElement('div');
        rgbRow.className = 'code-row';
        rgbRow.innerHTML = `<span class="code-label">RGB:</span><span>${rgb.r}, ${rgb.g}, ${rgb.b}</span>`;
        
        const cmykRow = document.createElement('div');
        cmykRow.className = 'code-row';
        cmykRow.innerHTML = `<span class="code-label">CMYK:</span><span>${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%</span>`;
        
        const hslRow = document.createElement('div');
        hslRow.className = 'code-row';
        hslRow.innerHTML = `<span class="code-label">HSL:</span><span>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</span>`;
        
        codes.appendChild(hexRow);
        codes.appendChild(rgbRow);
        codes.appendChild(cmykRow);
        codes.appendChild(hslRow);
        
        info.appendChild(name);
        info.appendChild(codes);
        
        chip.appendChild(swatch);
        chip.appendChild(info);
        
        return chip;
    }
    
    formatColorName(name) {
        // Convert camelCase to Title Case
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);
        
        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }
        
        c = Math.round(((c - k) / (1 - k)) * 100);
        m = Math.round(((m - k) / (1 - k)) * 100);
        y = Math.round(((y - k) / (1 - k)) * 100);
        k = Math.round(k * 100);
        
        return { c, m, y, k };
    }
    
    attachEventListeners() {
        if (!this.container) return;
        
        // Palette selector buttons
        const paletteButtons = this.container.querySelectorAll('.palette-btn');
        paletteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const paletteName = btn.dataset.palette;
                this.switchToPalette(paletteName);
            });
        });
        
        // Save swatch button
        const saveBtn = this.container.querySelector('.save-swatch-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCurrentSwatch();
            });
        }
        
        // Download brand template button
        const downloadBtn = this.container.querySelector('.download-brand-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadBrandTemplate();
            });
        }
        
        // Upload dropzone
        const dropzone = this.container.querySelector('.upload-dropzone');
        const fileInput = this.container.querySelector('.upload-input');
        
        if (dropzone && fileInput) {
            // Click to upload
            dropzone.addEventListener('click', () => {
                fileInput.click();
            });
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
            
            // Drag and drop
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
            
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('dragover');
            });
            
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                
                if (e.dataTransfer.files.length > 0) {
                    this.handleFileUpload(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Add click handlers to all color chips
        const chips = this.container.querySelectorAll('.color-chip');
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                const hex = chip.dataset.hex;
                const category = chip.dataset.category;
                this.applyColorToTheme(hex, category);
            });
        });
    }
    
    switchToPalette(paletteName) {
        this.currentPaletteName = paletteName;
        
        // Update active button state
        const paletteButtons = this.container.querySelectorAll('.palette-btn');
        paletteButtons.forEach(btn => {
            if (btn.dataset.palette === paletteName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Re-render all sections with new palette
        const sections = ['bases', 'neutrals', 'accents', 'layers'];
        sections.forEach(category => {
            const sectionEl = this.container.querySelector(`.color-section[data-category="${category}"]`);
            if (sectionEl) {
                const grid = sectionEl.querySelector('.color-grid');
                grid.innerHTML = '';
                
                const currentPalette = this.palettes[this.currentPaletteName];
                currentPalette[category].forEach((hex, index) => {
                    const chip = this.renderColorChip({ name: `${category}-${index}`, hex }, category);
                    grid.appendChild(chip);
                });
            }
        });
        
        // Re-attach event listeners to new chips
        const chips = this.container.querySelectorAll('.color-chip');
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                const hex = chip.dataset.hex;
                const category = chip.dataset.category;
                this.applyColorToTheme(hex, category);
            });
        });
        
        // Apply a smart palette from the new colors
        this.generateSmartPalette();
    }
    
    generateSmartPalette() {
        const currentPalette = this.palettes[this.currentPaletteName];
        const bgColor = this.randomFrom(currentPalette.bases);
        const textColor = this.randomFrom(currentPalette.neutrals);
        const accentColor = this.randomFrom(currentPalette.accents);
        const layerColor = this.randomFrom(currentPalette.layers);
        
        this.palette.applyPalette(bgColor, textColor, accentColor, layerColor);
        this.updateSwatchPreview(bgColor, textColor, accentColor, layerColor);
        
        // Update persistent state
        this.lastClickedColors = { bgColor, textColor, accentColor, layerColor };
    }
    
    applyColorToTheme(clickedColor, category) {
        const currentPalette = this.palettes[this.currentPaletteName];
        let bgColor, textColor, accentColor, layerColor;
        
        // Start with last clicked colors if available
        if (!this.lastClickedColors) {
            this.lastClickedColors = {
                bgColor: null,
                textColor: null,
                accentColor: null,
                layerColor: null
            };
        }
        
        // Use the clicked color in its appropriate role, preserve other clicked colors
        switch(category) {
            case 'bases':
                bgColor = clickedColor;
                textColor = this.lastClickedColors.textColor || this.randomFrom(currentPalette.neutrals);
                accentColor = this.lastClickedColors.accentColor || this.randomFrom(currentPalette.accents);
                layerColor = this.lastClickedColors.layerColor || this.randomFrom(currentPalette.layers);
                break;
            case 'neutrals':
                bgColor = this.lastClickedColors.bgColor || this.randomFrom(currentPalette.bases);
                textColor = clickedColor;
                accentColor = this.lastClickedColors.accentColor || this.randomFrom(currentPalette.accents);
                layerColor = this.lastClickedColors.layerColor || this.randomFrom(currentPalette.layers);
                break;
            case 'accents':
                bgColor = this.lastClickedColors.bgColor || this.randomFrom(currentPalette.bases);
                textColor = this.lastClickedColors.textColor || this.randomFrom(currentPalette.neutrals);
                accentColor = clickedColor;
                layerColor = this.lastClickedColors.layerColor || this.randomFrom(currentPalette.layers);
                break;
            case 'layers':
                bgColor = this.lastClickedColors.bgColor || this.randomFrom(currentPalette.bases);
                textColor = this.lastClickedColors.textColor || this.randomFrom(currentPalette.neutrals);
                accentColor = this.lastClickedColors.accentColor || this.randomFrom(currentPalette.accents);
                layerColor = clickedColor;
                break;
        }
        
        // Store the clicked colors for persistence
        this.lastClickedColors = { bgColor, textColor, accentColor, layerColor };
        
        this.palette.applyPalette(bgColor, textColor, accentColor, layerColor);
        this.updateSwatchPreview(bgColor, textColor, accentColor, layerColor);
    }
    
    randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    updateSwatchPreview(base, neutral, accent, layer) {
        const baseEl = this.container.querySelector('.base-swatch');
        const neutralEl = this.container.querySelector('.neutral-swatch');
        const accentEl = this.container.querySelector('.accent-swatch');
        const layerEl = this.container.querySelector('.layer-swatch');
        
        if (baseEl) {
            baseEl.style.backgroundColor = base;
            const hexEl = baseEl.querySelector('.theme-swatch-hex') || baseEl.querySelector('.swatch-hex');
            if (hexEl) hexEl.textContent = base;
            
            // Set text color for contrast
            const brightness = this.getBrightness(base);
            baseEl.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        }
        if (neutralEl) {
            neutralEl.style.backgroundColor = neutral;
            const hexEl = neutralEl.querySelector('.theme-swatch-hex') || neutralEl.querySelector('.swatch-hex');
            if (hexEl) hexEl.textContent = neutral;
            
            const brightness = this.getBrightness(neutral);
            neutralEl.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        }
        if (accentEl) {
            accentEl.style.backgroundColor = accent;
            const hexEl = accentEl.querySelector('.theme-swatch-hex') || accentEl.querySelector('.swatch-hex');
            if (hexEl) hexEl.textContent = accent;
            
            const brightness = this.getBrightness(accent);
            accentEl.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        }
        if (layerEl && layer) {
            layerEl.style.backgroundColor = layer;
            const hexEl = layerEl.querySelector('.theme-swatch-hex') || layerEl.querySelector('.swatch-hex');
            if (hexEl) hexEl.textContent = layer;
            
            const brightness = this.getBrightness(layer);
            layerEl.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        }
    }
    
    saveCurrentSwatch() {
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
        const secondary = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
        const layer = getComputedStyle(document.documentElement).getPropertyValue('--color-layer').trim();
        
        if (primary && secondary && accent && layer) {
            this.savedSwatch = {
                base: primary,
                neutral: secondary,
                accent: accent,
                layer: layer,
                paletteName: this.currentPaletteName,
                timestamp: new Date().toISOString()
            };
            
            const downloadBtn = this.container.querySelector('.download-brand-btn');
            if (downloadBtn) {
                downloadBtn.disabled = false;
            }
            
            alert('✓ Theme saved! Click "Download Brand Template" to export.');
        }
    }
    
    downloadBrandTemplate() {
        if (!this.savedSwatch) {
            alert('Please save a theme first!');
            return;
        }
        
        const { base, neutral, accent, layer, paletteName, timestamp } = this.savedSwatch;
        
        const template = `════════════════════════════════════════════════════════
                   BRAND COLOR TEMPLATE
════════════════════════════════════════════════════════

Palette: ${paletteName}
Generated: ${new Date(timestamp).toLocaleString()}

────────────────────────────────────────────────────────
                    PRIMARY COLORS
────────────────────────────────────────────────────────

BASE (Background/Primary)
HEX:  ${base}
RGB:  ${this.hexToRgbString(base)}
CMYK: ${this.hexToCmykString(base)}
HSL:  ${this.hexToHslString(base)}

NEUTRAL (Text/Secondary)
HEX:  ${neutral}
RGB:  ${this.hexToRgbString(neutral)}
CMYK: ${this.hexToCmykString(neutral)}
HSL:  ${this.hexToHslString(neutral)}

ACCENT (Highlights/CTAs)
HEX:  ${accent}
RGB:  ${this.hexToRgbString(accent)}
CMYK: ${this.hexToCmykString(accent)}
HSL:  ${this.hexToHslString(accent)}

LAYER (UI Elements/Borders)
HEX:  ${layer}
RGB:  ${this.hexToRgbString(layer)}
CMYK: ${this.hexToCmykString(layer)}
HSL:  ${this.hexToHslString(layer)}

────────────────────────────────────────────────────────
                    CSS VARIABLES
────────────────────────────────────────────────────────

:root {
  --color-base: ${base};
  --color-neutral: ${neutral};
  --color-accent: ${accent};
  --color-layer: ${layer};
}

────────────────────────────────────────────────────────
                  USAGE GUIDELINES
────────────────────────────────────────────────────────

BASE: Use for backgrounds, cards, containers
NEUTRAL: Use for body text, borders, subtle elements
ACCENT: Use for buttons, links, highlights, CTAs
LAYER: Use for menu items, borders, UI overlays

────────────────────────────────────────────────────────
                 ACCESSIBILITY NOTES
────────────────────────────────────────────────────────

• Always test color contrast ratios (WCAG AA minimum)
• Base/Neutral contrast: ${this.getContrastRatio(base, neutral).toFixed(2)}:1
• Base/Accent contrast: ${this.getContrastRatio(base, accent).toFixed(2)}:1
• Base/Layer contrast: ${this.getContrastRatio(base, layer).toFixed(2)}:1
• Neutral/Accent contrast: ${this.getContrastRatio(neutral, accent).toFixed(2)}:1

════════════════════════════════════════════════════════
             Generated by wwwwwh.io Color System
════════════════════════════════════════════════════════`;
        
        const blob = new Blob([template], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brand-template-${paletteName.toLowerCase()}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    hexToRgbString(hex) {
        const rgb = this.hexToRgb(hex);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    
    hexToCmykString(hex) {
        const rgb = this.hexToRgb(hex);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    }
    
    hexToHslString(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        return `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
    }
    
    getContrastRatio(hex1, hex2) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);
        
        const l1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    getBrightness(hex) {
        const rgb = this.hexToRgb(hex);
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    }
    
    handleFileUpload(file) {
        if (!file.name.endsWith('.txt')) {
            alert('Please upload a .txt brand template file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parseBrandTemplate(content);
        };
        reader.readAsText(file);
    }
    
    parseBrandTemplate(content) {
        try {
            // Extract HEX colors from the template
            const hexRegex = /#[0-9A-Fa-f]{6}/g;
            const colors = content.match(hexRegex);
            
            if (!colors || colors.length < 4) {
                alert('Could not find valid colors in template. Please ensure it contains HEX codes.');
                return;
            }
            
            // Extract the first 4 colors (BASE, NEUTRAL, ACCENT, LAYER)
            const base = colors[0];
            const neutral = colors[1];
            const accent = colors[2];
            const layer = colors[3];
            
            // Apply the colors
            this.palette.applyPalette(base, neutral, accent, layer);
            this.updateSwatchPreview(base, neutral, accent, layer);
            
            // Update persistent state
            this.lastClickedColors = { 
                bgColor: base, 
                textColor: neutral, 
                accentColor: accent,
                layerColor: layer
            };
            
            // Show success message
            const dropzone = this.container.querySelector('.upload-dropzone');
            if (dropzone) {
                const originalContent = dropzone.innerHTML;
                dropzone.innerHTML = '<div class="upload-success">✓ Colors loaded!</div>';
                setTimeout(() => {
                    dropzone.innerHTML = originalContent;
                }, 2000);
            }
            
            console.log(`🎨 Loaded colors from template: Base ${base}, Neutral ${neutral}, Accent ${accent}`);
        } catch (error) {
            console.error('Error parsing brand template:', error);
            alert('Error reading template file. Please check the format.');
        }
    }
    
    addStyles() {
        if (document.getElementById('palette-builder-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'palette-builder-styles';
        style.textContent = `
            .color-app {
                padding: 20px;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .color-header {
                margin-bottom: 40px;
                text-align: center;
                border-bottom: 2px solid var(--text-color, #e5e5e5);
                padding-bottom: 20px;
            }
            
            .color-header h2 {
                font-size: 28px;
                margin-bottom: 5px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }
            
            .palette-selector {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                justify-content: center;
                margin-top: 20px;
            }
            
            .palette-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                position: relative;
            }
            
            .palette-btn:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            }
            
            .palette-btn.active {
                transform: scale(1.25);
                box-shadow: 0 0 0 4px var(--color-primary, #fff), 0 6px 20px rgba(0,0,0,0.35);
            }
            
            .palette-btn.active::after {
                content: '';
                position: absolute;
                inset: -8px;
                border: 3px solid currentColor;
                border-radius: 50%;
                opacity: 0.5;
            }
            
            .saved-swatch-section {
                margin-bottom: 40px;
                padding: 0;
                border-bottom: 2px solid currentColor;
                padding-bottom: 30px;
            }
            
            .swatch-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-weight: 600;
                margin-bottom: 20px;
                text-align: center;
                opacity: 0.6;
            }
            
            .current-swatch-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .current-theme-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                margin-bottom: 20px;
            }
            
            .current-theme-swatch {
                min-height: 120px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            }
            
            .current-theme-swatch:hover {
                transform: scale(1.05);
                z-index: 10;
                box-shadow: 0 8px 24px rgba(0,0,0,0.25);
            }
            
            .theme-swatch-label {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-weight: 700;
                opacity: 0.9;
            }
            
            .theme-swatch-hex {
                font-size: 14px;
                font-family: 'Monaco', 'Courier New', monospace;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            
            .swatch-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            .save-swatch-btn,
            .download-brand-btn {
                padding: 12px 20px;
                border: 2px solid currentColor;
                background: transparent;
                color: inherit;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.2s;
            }
            
            .save-swatch-btn:hover,
            .download-brand-btn:hover:not(:disabled) {
                background: currentColor;
                color: var(--bg-color, white);
                transform: translateY(-2px);
            }
            
            .download-brand-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
            
            .upload-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px dashed var(--text-color, #ccc);
            }
            
            .upload-dropzone {
                border: 2px dashed var(--text-color, #999);
                border-radius: 8px;
                padding: 30px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                background: rgba(0,0,0,0.02);
            }
            
            .upload-dropzone:hover {
                border-color: currentColor;
                background: rgba(0,0,0,0.05);
                transform: translateY(-2px);
            }
            
            .upload-dropzone.dragover {
                border-color: currentColor;
                background: rgba(0,0,0,0.1);
                border-style: solid;
            }
            
            .upload-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .upload-text {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .upload-subtext {
                font-size: 11px;
                opacity: 0.6;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .upload-success {
                font-size: 18px;
                font-weight: 700;
                color: currentColor;
                padding: 30px;
            }
            
            .color-section {
                margin-bottom: 50px;
            }
            
            .section-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                font-weight: 600;
                margin-bottom: 15px;
                opacity: 0.8;
                border-left: 3px solid currentColor;
                padding-left: 12px;
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 15px;
            }
            
            .color-chip {
                border: 1px solid currentColor;
                border-radius: 4px;
                overflow: hidden;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                background: var(--color-primary, white);
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .color-chip:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                border-width: 2px;
            }
            
            .color-chip:active {
                transform: translateY(-1px);
                box-shadow: 0 3px 8px rgba(0,0,0,0.15);
            }
            
            .chip-swatch {
                height: 100px;
                position: relative;
            }
            
            .chip-info {
                padding: 10px;
                background: var(--color-secondary, rgba(0,0,0,0.05));
                color: var(--color-primary, #000);
            }
            
            .color-name {
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 12px;
                letter-spacing: 0.3px;
                color: var(--color-primary, #000);
            }
            
            .color-codes {
                font-size: 10px;
                line-height: 1.5;
                font-family: 'Monaco', 'Courier New', monospace;
                color: var(--color-primary, #000);
            }
            
            .code-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2px;
            }
            
            .code-label {
                font-weight: 600;
                opacity: 0.6;
                min-width: 45px;
                text-transform: uppercase;
            }
            
            @media (max-width: 768px) {
                .color-grid {
                    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                    gap: 12px;
                }
                
                .chip-swatch {
                    height: 80px;
                }
                
                .color-header h2 {
                    font-size: 24px;
                }
                
                .section-title {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorPaletteBuilder;
}
