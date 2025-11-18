class NGAGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            apiBase: 'https:
            itemsPerPage: options.itemsPerPage || 20,
            showImages: options.showImages !== false,
            ...options
        };
        this.currentPage = 1;
        this.isLoading = false;
        this.artworks = [];
        this.hasMorePages = true;
    }
    async loadFineArt(query = '', page = 1) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.showLoading();
        try {
            const allSampleArtworks = [
                {
                    id: 1,
                    title: "Girl with a Pearl Earring",
                    attribution: "Johannes Vermeer",
                    displaydate: "c. 1665",
                    medium: "Oil on canvas",
                    dimensions: "44.5 cm × 39 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "This masterpiece showcases Vermeer's exceptional ability to capture light and intimate human moments."
                },
                {
                    id: 2,
                    title: "The Starry Night",
                    attribution: "Vincent van Gogh",
                    displaydate: "1889",
                    medium: "Oil on canvas",
                    dimensions: "73.7 cm × 92.1 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "Van Gogh's swirling night sky over a French village, painted during his stay at an asylum."
                },
                {
                    id: 3,
                    title: "The Birth of Venus",
                    attribution: "Sandro Botticelli",
                    displaydate: "c. 1484–1486",
                    medium: "Tempera on canvas",
                    dimensions: "172.5 cm × 278.9 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "Botticelli's Renaissance masterpiece depicting the Roman goddess Venus emerging from the sea."
                },
                {
                    id: 4,
                    title: "Woman with a Parasol",
                    attribution: "Claude Monet",
                    displaydate: "1875",
                    medium: "Oil on canvas",
                    dimensions: "100 cm × 81 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "Monet's impressionist portrait of his wife Camille and their son Jean in a sunny field."
                },
                {
                    id: 5,
                    title: "The Great Wave off Kanagawa",
                    attribution: "Katsushika Hokusai",
                    displaydate: "c. 1831",
                    medium: "Woodblock print",
                    dimensions: "25.7 cm × 37.9 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "The iconic Japanese woodblock print depicting a great wave threatening boats."
                },
                {
                    id: 6,
                    title: "American Gothic",
                    attribution: "Grant Wood",
                    displaydate: "1930",
                    medium: "Oil on beaverboard",
                    dimensions: "78 cm × 65.3 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "Wood's famous depiction of a farmer and his daughter in front of their home."
                },
                {
                    id: 8,
                    title: "Liberty Leading the People",
                    attribution: "Eugène Delacroix",
                    displaydate: "1830",
                    medium: "Oil on canvas",
                    dimensions: "260 cm × 325 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "Delacroix's romantic painting commemorating the July Revolution of 1830."
                },
                {
                    id: 9,
                    title: "The Scream",
                    attribution: "Edvard Munch",
                    displaydate: "1893",
                    medium: "Oil, tempera, and pastel on cardboard",
                    dimensions: "91 cm × 73.5 cm",
                    images: {
                        web: { url: "https:
                    },
                    description: "Munch's expressionist masterpiece depicting a figure with an agonized expression."
                }
            ];
            const startIndex = (page - 1) * this.options.itemsPerPage;
            const endIndex = startIndex + this.options.itemsPerPage;
            let sampleArtworks = allSampleArtworks.slice(startIndex, endIndex);
            let filteredArtworks = sampleArtworks;
            if (query) {
                const allFilteredArtworks = allSampleArtworks.filter(artwork => 
                    artwork.title.toLowerCase().includes(query.toLowerCase()) ||
                    artwork.attribution.toLowerCase().includes(query.toLowerCase())
                );
                filteredArtworks = allFilteredArtworks.slice(startIndex, endIndex);
            }
            if (page === 1) {
                this.artworks = filteredArtworks;
            } else {
                if (filteredArtworks.length > 0) {
                    this.artworks = [...this.artworks, ...filteredArtworks];
                }
            }
            this.hasMorePages = endIndex < (query ? 
                allSampleArtworks.filter(artwork => 
                    artwork.title.toLowerCase().includes(query.toLowerCase()) ||
                    artwork.attribution.toLowerCase().includes(query.toLowerCase())
                ).length : 
                allSampleArtworks.length
            );
            this.currentPage = page;
            this.render();
        } catch (error) {
            console.error('Failed to load NGA artworks:', error);
            this.showError(`Failed to load artworks: ${error.message}`);
        } finally {
            this.isLoading = false;
        }
    }
    async loadMore() {
        if (!this.isLoading) {
            await this.loadFineArt('', this.currentPage + 1);
        }
    }
    render() {
        if (!this.artworks.length) {
            this.container.innerHTML = '<div class="nga-empty">No artworks found.</div>';
            return;
        }
        const artworksHtml = this.artworks.map(artwork => this.renderArtwork(artwork)).join('');
        const loadMoreHtml = this.hasMorePages ? `
            <div class="nga-load-more">
                <button onclick="window.ngaGallery.loadMore()" ${this.isLoading ? 'disabled' : ''}>
                    ${this.isLoading ? 'Loading...' : 'Load More Artworks'}
                </button>
            </div>
        ` : '';
        this.container.innerHTML = `
            <div class="nga-gallery">
                <div class="nga-header">
                    <h2>National Gallery of Art - Fine Art Collection</h2>
                    <p>Explore masterpieces from the National Gallery of Art's public domain collection</p>
                </div>
                <div class="nga-grid">
                    ${artworksHtml}
                </div>
                ${loadMoreHtml}
            </div>
        `;
        this.attachEventListeners();
        this.initializeFullScreenModal();
    }
    renderArtwork(artwork) {
        const imageUrl = artwork.images?.web?.url || artwork.images?.print?.url;
        const imageHtml = imageUrl ? 
            `<img src="${imageUrl}" alt="${artwork.title}" loading="lazy" class="nga-zoomable-image" data-artwork-id="${artwork.id}" />` : 
            '<div class="nga-no-image">No Image Available</div>';
        const artist = artwork.attribution || 'Unknown Artist';
        const date = artwork.displaydate || 'Date Unknown';
        const medium = artwork.medium || '';
        const dimensions = artwork.dimensions || '';
        return `
            <div class="nga-artwork" data-id="${artwork.id}">
                <div class="nga-image">
                    ${imageHtml}
                </div>
                <div class="nga-info">
                    <h3 class="nga-title">${artwork.title || 'Untitled'}</h3>
                    <p class="nga-artist">${artist}</p>
                    <p class="nga-date">${date}</p>
                    ${medium ? `<p class="nga-medium">${medium}</p>` : ''}
                    ${dimensions ? `<p class="nga-dimensions">${dimensions}</p>` : ''}
                    ${artwork.accessionnum ? `<p class="nga-accession">Accession: ${artwork.accessionnum}</p>` : ''}
                </div>
            </div>
        `;
    }
    attachEventListeners() {
        this.container.querySelectorAll('.nga-artwork').forEach(artwork => {
            artwork.addEventListener('click', (e) => {
                const artworkId = e.currentTarget.dataset.id;
                this.showArtworkDetail(artworkId);
            });
        });
    }
    async showArtworkDetail(artworkId) {
        try {
            const response = await fetch(`${this.options.apiBase}/artworks/${artworkId}`);
            const data = await response.json();
            if (data.data) {
                this.renderModal(data.data);
            }
        } catch (error) {
            console.error('Failed to load artwork details:', error);
        }
    }
    renderModal(artwork) {
        const modal = document.createElement('div');
        modal.className = 'nga-modal';
        modal.innerHTML = `
            <div class="nga-modal-content">
                <span class="nga-close">&times;</span>
                <div class="nga-modal-body">
                    ${artwork.images?.web?.url ? 
                        `<img src="${artwork.images.web.url}" alt="${artwork.title}" />` : 
                        '<div class="nga-no-image-large">No Image Available</div>'
                    }
                    <div class="nga-details">
                        <h2>${artwork.title || 'Untitled'}</h2>
                        <p><strong>Artist:</strong> ${artwork.attribution || 'Unknown'}</p>
                        <p><strong>Date:</strong> ${artwork.displaydate || 'Unknown'}</p>
                        ${artwork.medium ? `<p><strong>Medium:</strong> ${artwork.medium}</p>` : ''}
                        ${artwork.dimensions ? `<p><strong>Dimensions:</strong> ${artwork.dimensions}</p>` : ''}
                        ${artwork.creditline ? `<p><strong>Credit:</strong> ${artwork.creditline}</p>` : ''}
                        ${artwork.accessionnum ? `<p><strong>Accession Number:</strong> ${artwork.accessionnum}</p>` : ''}
                        ${artwork.description ? `<p><strong>Description:</strong> ${artwork.description}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.nga-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    showLoading() {
        this.container.innerHTML = `
            <div class="nga-loading">
                <div class="nga-spinner"></div>
                <p>Loading National Gallery of Art collection...</p>
            </div>
        `;
    }
    showError(message) {
        this.container.innerHTML = `
            <div class="nga-error">
                <h3>Unable to load collection</h3>
                <p>${message}</p>
                <button onclick="window.ngaGallery.loadFineArt()">Try Again</button>
            </div>
        `;
    }
    initializeFullScreenModal() {
        const modalHtml = `
            <div id="nga-fullscreen-modal" class="nga-fullscreen-modal" style="display: none;">
                <div class="nga-modal-backdrop"></div>
                <div class="nga-modal-container">
                    <div class="nga-modal-controls">
                        <button class="nga-zoom-in">+</button>
                        <button class="nga-zoom-out">-</button>
                        <button class="nga-close-modal">✕</button>
                    </div>
                    <div class="nga-modal-image-container">
                        <img id="nga-modal-image" class="nga-modal-image" />
                    </div>
                </div>
            </div>
        `;
        if (!document.getElementById('nga-fullscreen-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
        this.attachModalEventListeners();
    }
    attachModalEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nga-zoomable-image')) {
                const artworkId = e.target.dataset.artworkId;
                const artwork = this.artworks.find(a => a.id == artworkId);
                if (artwork) {
                    this.openFullScreenModal(artwork);
                }
            }
        });
        const modal = document.getElementById('nga-fullscreen-modal');
        const modalImage = document.getElementById('nga-modal-image');
        const closeBtn = document.querySelector('.nga-close-modal');
        const zoomInBtn = document.querySelector('.nga-zoom-in');
        const zoomOutBtn = document.querySelector('.nga-zoom-out');
        const backdrop = document.querySelector('.nga-modal-backdrop');
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';  
            scale = 1;
            translateX = 0;
            translateY = 0;
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        };
        closeBtn?.addEventListener('click', closeModal);
        backdrop?.addEventListener('click', closeModal);
        modalImage?.addEventListener('click', closeModal);
        zoomInBtn?.addEventListener('click', () => {
            scale = Math.min(scale * 1.2, 5);
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        });
        zoomOutBtn?.addEventListener('click', () => {
            scale = Math.max(scale / 1.2, 0.5);
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        });
        modalImage?.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            scale = Math.min(Math.max(scale * delta, 0.5), 5);
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        });
        modalImage?.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                modalImage.style.cursor = 'grabbing';
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging && scale > 1) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                this.updateImageTransform(modalImage, scale, translateX, translateY);
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (modalImage) modalImage.style.cursor = scale > 1 ? 'grab' : 'pointer';
        });
        let initialDistance = 0;
        let lastTouchX = 0;
        let lastTouchY = 0;
        modalImage?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            } else if (e.touches.length === 1) {
                const touch = e.touches[0];
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        });
        modalImage?.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                const scaleChange = currentDistance / initialDistance;
                scale = Math.min(Math.max(scale * scaleChange, 0.5), 5);
                initialDistance = currentDistance;
                this.updateImageTransform(modalImage, scale, translateX, translateY);
            } else if (e.touches.length === 1 && scale > 1) {
                const touch = e.touches[0];
                translateX += touch.clientX - lastTouchX;
                translateY += touch.clientY - lastTouchY;
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
                this.updateImageTransform(modalImage, scale, translateX, translateY);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (modal && modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case '+':
                    case '=':
                        scale = Math.min(scale * 1.2, 5);
                        this.updateImageTransform(modalImage, scale, translateX, translateY);
                        break;
                    case '-':
                        scale = Math.max(scale / 1.2, 0.5);
                        this.updateImageTransform(modalImage, scale, translateX, translateY);
                        break;
                }
            }
        });
    }
    openFullScreenModal(artwork) {
        const modal = document.getElementById('nga-fullscreen-modal');
        const modalImage = document.getElementById('nga-modal-image');
        const imageUrl = artwork.images?.web?.url || artwork.images?.print?.url;
        if (imageUrl && modal && modalImage) {
            modalImage.src = imageUrl;
            modalImage.alt = artwork.title;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
        }
    }
    updateImageTransform(image, scale, translateX, translateY) {
        if (image) {
            image.style.transform = `scale(${scale}) translate(${translateX/scale}px, ${translateY/scale}px)`;
            image.style.cursor = scale > 1 ? 'grab' : 'pointer';
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    window.ngaGallery = null;
});
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NGAGallery;
}