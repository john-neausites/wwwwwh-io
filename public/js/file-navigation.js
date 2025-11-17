/**
 * wwwwwh.io File Navigation System
 * TypeScript Component System for Modern File Management
 */
// Component Base Class
class Component {
    constructor(selector) {
        this.listeners = [];
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }
        this.element = element;
    }
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
    }
    removeEventListeners() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
    }
    destroy() {
        this.removeEventListeners();
    }
}
// File Manager Main Component
class FileManager extends Component {
    constructor(selector) {
        super(selector);
        this.state = {
            currentPath: '/',
            files: [],
            selectedFiles: [],
            viewMode: 'grid',
            sortBy: 'name',
            sortOrder: 'asc',
            searchQuery: '',
            loading: false
        };
        this.components = {};
        this.initializeComponents();
        this.loadInitialData();
    }
    initializeComponents() {
        this.components.breadcrumb = new BreadcrumbNavigation('.breadcrumb-container', this);
        this.components.searchBox = new SearchBox('.search-container', this);
        this.components.viewToggle = new ViewToggle('.view-toggle-container', this);
        this.components.fileGrid = new FileGrid('.file-grid-container', this);
        this.components.sidebar = new SidebarTree('.sidebar-tree-container', this);
        this.components.uploadZone = new UploadZone('.upload-zone-container', this);
    }
    async loadInitialData() {
        this.setState({ loading: true });
        try {
            const files = await this.fetchFiles(this.state.currentPath);
            this.setState({ files, loading: false });
        }
        catch (error) {
            console.error('Failed to load files:', error);
            this.setState({ loading: false });
        }
    }
    async fetchFiles(path) {
        const response = await fetch(`/api/v1/files?path=${encodeURIComponent(path)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }
        return response.json();
    }
    // State Management
    getState() {
        return Object.assign({}, this.state);
    }
    setState(newState) {
        this.state = Object.assign(Object.assign({}, this.state), newState);
        this.render();
        this.notifyComponents();
    }
    notifyComponents() {
        Object.values(this.components).forEach(component => {
            if (component && typeof component.onStateUpdate === 'function') {
                component.onStateUpdate(this.state);
            }
        });
    }
    // Public Methods
    async navigateToPath(path) {
        if (path === this.state.currentPath)
            return;
        this.setState({ loading: true, currentPath: path });
        try {
            const files = await this.fetchFiles(path);
            this.setState({ files, loading: false });
        }
        catch (error) {
            console.error('Navigation failed:', error);
            this.setState({ loading: false });
        }
    }
    selectFile(fileId, multiSelect = false) {
        let selectedFiles = [...this.state.selectedFiles];
        if (multiSelect) {
            if (selectedFiles.includes(fileId)) {
                selectedFiles = selectedFiles.filter(id => id !== fileId);
            }
            else {
                selectedFiles.push(fileId);
            }
        }
        else {
            selectedFiles = [fileId];
        }
        this.setState({ selectedFiles });
    }
    setViewMode(mode) {
        this.setState({ viewMode: mode });
    }
    setSorting(sortBy, sortOrder) {
        this.setState({ sortBy, sortOrder });
    }
    setSearchQuery(query) {
        this.setState({ searchQuery: query });
    }
    render() {
        // Render main layout - this would typically be handled by a template system
        // For now, we'll assume the HTML structure exists
    }
}
// Breadcrumb Navigation Component
class BreadcrumbNavigation extends Component {
    constructor(selector, fileManager) {
        super(selector);
        this.fileManager = fileManager;
        this.render();
    }
    onStateUpdate(state) {
        this.render();
    }
    render() {
        const state = this.fileManager.getState();
        const pathParts = state.currentPath.split('/').filter(part => part);
        let html = '<nav class="breadcrumb">';
        // Home breadcrumb
        html += `
      <a href="#" class="breadcrumb-item" data-path="/">
        <span>📁</span> Home
      </a>
    `;
        // Path parts
        let currentPath = '';
        pathParts.forEach((part, index) => {
            currentPath += `/${part}`;
            const isLast = index === pathParts.length - 1;
            html += '<span class="breadcrumb-separator">/</span>';
            html += `
        <a href="#" class="breadcrumb-item ${isLast ? 'current' : ''}" data-path="${currentPath}">
          ${part}
        </a>
      `;
        });
        html += '</nav>';
        this.element.innerHTML = html;
        this.bindEvents();
    }
    bindEvents() {
        this.removeEventListeners();
        const breadcrumbItems = this.element.querySelectorAll('.breadcrumb-item');
        breadcrumbItems.forEach(item => {
            this.addEventListener(item, 'click', (e) => {
                e.preventDefault();
                const path = item.dataset.path || '/';
                this.fileManager.navigateToPath(path);
            });
        });
    }
}
// Search Box Component
class SearchBox extends Component {
    constructor(selector, fileManager) {
        super(selector);
        this.fileManager = fileManager;
        this.render();
    }
    onStateUpdate(state) {
        const input = this.element.querySelector('.search-input');
        if (input && input.value !== state.searchQuery) {
            input.value = state.searchQuery;
        }
    }
    render() {
        this.element.innerHTML = `
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search files and folders..."
          value="${this.fileManager.getState().searchQuery}"
        >
      </div>
    `;
        this.bindEvents();
    }
    bindEvents() {
        this.removeEventListeners();
        const searchInput = this.element.querySelector('.search-input');
        if (searchInput) {
            this.addEventListener(searchInput, 'input', (e) => {
                const query = e.target.value;
                // Debounce search
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }
                this.debounceTimer = setTimeout(() => {
                    this.fileManager.setSearchQuery(query);
                }, 300);
            });
        }
    }
}
// View Toggle Component
class ViewToggle extends Component {
    constructor(selector, fileManager) {
        super(selector);
        this.fileManager = fileManager;
        this.render();
    }
    onStateUpdate(state) {
        this.render();
    }
    render() {
        const state = this.fileManager.getState();
        this.element.innerHTML = `
      <div class="view-toggle">
        <button class="view-toggle-item ${state.viewMode === 'grid' ? 'active' : ''}" data-view="grid">
          <span>⊞</span> Grid
        </button>
        <button class="view-toggle-item ${state.viewMode === 'list' ? 'active' : ''}" data-view="list">
          <span>☰</span> List
        </button>
      </div>
    `;
        this.bindEvents();
    }
    bindEvents() {
        this.removeEventListeners();
        const toggleItems = this.element.querySelectorAll('.view-toggle-item');
        toggleItems.forEach(item => {
            this.addEventListener(item, 'click', () => {
                const viewMode = item.dataset.view;
                this.fileManager.setViewMode(viewMode);
            });
        });
    }
}
// File Grid Component
class FileGrid extends Component {
    constructor(selector, fileManager) {
        super(selector);
        this.fileManager = fileManager;
        this.render();
    }
    onStateUpdate(state) {
        this.render();
    }
    render() {
        const state = this.fileManager.getState();
        if (state.loading) {
            this.renderLoading();
            return;
        }
        const filteredFiles = this.filterFiles(state.files, state.searchQuery);
        const sortedFiles = this.sortFiles(filteredFiles, state.sortBy, state.sortOrder);
        const containerClass = state.viewMode === 'grid' ? 'file-grid' : 'file-list';
        let html = `<div class="${containerClass}">`;
        sortedFiles.forEach(file => {
            html += this.renderFileItem(file, state.selectedFiles.includes(file.id));
        });
        html += '</div>';
        this.element.innerHTML = html;
        this.bindEvents();
    }
    renderLoading() {
        this.element.innerHTML = `
      <div class="flex items-center justify-center p-xl">
        <div class="loading-spinner"></div>
        <span class="ml-sm">Loading files...</span>
      </div>
    `;
    }
    renderFileItem(file, isSelected) {
        const icon = this.getFileIcon(file);
        const size = file.size ? this.formatFileSize(file.size) : '';
        const modified = this.formatDate(file.modified);
        return `
      <div class="file-item ${isSelected ? 'selected' : ''}" data-file-id="${file.id}">
        <div class="file-icon ${this.getFileIconClass(file)}">
          ${icon}
        </div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-meta">${size} • ${modified}</div>
        </div>
        <div class="file-actions">
          <button class="file-action" data-action="download" title="Download">
            ⬇
          </button>
          <button class="file-action" data-action="delete" title="Delete">
            🗑
          </button>
        </div>
      </div>
    `;
    }
    getFileIcon(file) {
        var _a;
        if (file.type === 'folder')
            return '📁';
        const ext = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || ''))
            return '🖼';
        if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || ''))
            return '🎬';
        if (['mp3', 'wav', 'flac', 'aac'].includes(ext || ''))
            return '🎵';
        if (['pdf', 'doc', 'docx', 'txt'].includes(ext || ''))
            return '📄';
        if (['zip', 'rar', '7z', 'tar'].includes(ext || ''))
            return '📦';
        return '📄';
    }
    getFileIconClass(file) {
        var _a;
        if (file.type === 'folder')
            return 'folder';
        const ext = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || ''))
            return 'image';
        if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || ''))
            return 'video';
        if (['mp3', 'wav', 'flac', 'aac'].includes(ext || ''))
            return 'audio';
        if (['pdf', 'doc', 'docx', 'txt'].includes(ext || ''))
            return 'document';
        if (['zip', 'rar', '7z', 'tar'].includes(ext || ''))
            return 'archive';
        return 'default';
    }
    filterFiles(files, query) {
        if (!query.trim())
            return files;
        const lowercaseQuery = query.toLowerCase();
        return files.filter(file => file.name.toLowerCase().includes(lowercaseQuery));
    }
    sortFiles(files, sortBy, sortOrder) {
        return [...files].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'size':
                    comparison = (a.size || 0) - (b.size || 0);
                    break;
                case 'modified':
                    comparison = a.modified.getTime() - b.modified.getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }
    formatFileSize(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }
    formatDate(date) {
        // Use a simpler date formatting approach
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0)
            return 'Today';
        if (diffDays === 1)
            return 'Yesterday';
        if (diffDays < 7)
            return `${diffDays} days ago`;
        return date.toLocaleDateString();
    }
    bindEvents() {
        this.removeEventListeners();
        // File item clicks
        const fileItems = this.element.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            this.addEventListener(item, 'click', (e) => {
                const fileId = item.dataset.fileId;
                const multiSelect = e.ctrlKey || e.metaKey;
                this.fileManager.selectFile(fileId, multiSelect);
            });
            this.addEventListener(item, 'dblclick', (e) => {
                const fileId = item.dataset.fileId;
                const file = this.fileManager.getState().files.find(f => f.id === fileId);
                if (file && file.type === 'folder') {
                    this.fileManager.navigateToPath(file.path);
                }
            });
        });
        // File action buttons
        const actionButtons = this.element.querySelectorAll('.file-action');
        actionButtons.forEach(button => {
            this.addEventListener(button, 'click', (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                const fileItem = button.closest('.file-item');
                const fileId = fileItem.dataset.fileId;
                this.handleFileAction(action, fileId);
            });
        });
    }
    handleFileAction(action, fileId) {
        const file = this.fileManager.getState().files.find(f => f.id === fileId);
        if (!file)
            return;
        switch (action) {
            case 'download':
                this.downloadFile(file);
                break;
            case 'delete':
                this.deleteFile(file);
                break;
        }
    }
    downloadFile(file) {
        const link = document.createElement('a');
        link.href = `/api/v1/files/download?path=${encodeURIComponent(file.path)}`;
        link.download = file.name;
        link.click();
    }
    async deleteFile(file) {
        if (!confirm(`Are you sure you want to delete "${file.name}"?`))
            return;
        try {
            const response = await fetch(`/api/v1/files?path=${encodeURIComponent(file.path)}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Refresh file list
                this.fileManager.navigateToPath(this.fileManager.getState().currentPath);
            }
        }
        catch (error) {
            console.error('Delete failed:', error);
        }
    }
}
// Sidebar Tree Component
class SidebarTree extends Component {
    constructor(selector, fileManager) {
        super(selector);
        this.fileManager = fileManager;
        this.render();
    }
    onStateUpdate(state) {
        // Update active path in tree
        this.updateActiveItem();
    }
    render() {
        // For now, render a simple folder tree
        this.element.innerHTML = `
      <div class="file-tree">
        <div class="file-tree-item">
          <button class="file-tree-toggle active" data-path="/">
            <span class="tree-icon">📁</span>
            Home
          </button>
        </div>
      </div>
    `;
        this.bindEvents();
    }
    updateActiveItem() {
        const currentPath = this.fileManager.getState().currentPath;
        const items = this.element.querySelectorAll('.file-tree-toggle');
        items.forEach(item => {
            const path = item.dataset.path;
            item.classList.toggle('active', path === currentPath);
        });
    }
    bindEvents() {
        this.removeEventListeners();
        const toggles = this.element.querySelectorAll('.file-tree-toggle');
        toggles.forEach(toggle => {
            this.addEventListener(toggle, 'click', () => {
                const path = toggle.dataset.path || '/';
                this.fileManager.navigateToPath(path);
            });
        });
    }
}
// Upload Zone Component
class UploadZone extends Component {
    constructor(selector, fileManager) {
        super(selector);
        this.fileManager = fileManager;
        this.render();
    }
    onStateUpdate(state) {
        // Update upload zone based on current path
    }
    render() {
        this.element.innerHTML = `
      <div class="upload-zone">
        <div class="upload-zone-content">
          <div class="upload-icon">📤</div>
          <div class="upload-text">Drop files here to upload</div>
          <div class="upload-subtext">or click to browse</div>
          <input type="file" multiple style="display: none;" class="file-input">
        </div>
        <div class="progress-bar hidden">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>
    `;
        this.bindEvents();
    }
    bindEvents() {
        this.removeEventListeners();
        const uploadZone = this.element.querySelector('.upload-zone');
        const fileInput = this.element.querySelector('.file-input');
        // Click to browse
        this.addEventListener(uploadZone, 'click', () => {
            fileInput.click();
        });
        // File input change
        this.addEventListener(fileInput, 'change', (e) => {
            const files = e.target.files;
            if (files) {
                this.handleFiles(Array.from(files));
            }
        });
        // Drag and drop
        this.addEventListener(uploadZone, 'dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        this.addEventListener(uploadZone, 'dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });
        this.addEventListener(uploadZone, 'drop', (e) => {
            var _a;
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            const files = Array.from(((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files) || []);
            this.handleFiles(files);
        });
    }
    async handleFiles(files) {
        const progressBar = this.element.querySelector('.progress-bar');
        const progressFill = this.element.querySelector('.progress-fill');
        progressBar.classList.remove('hidden');
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const progress = ((i + 1) / files.length) * 100;
            try {
                await this.uploadFile(file);
                progressFill.style.width = `${progress}%`;
            }
            catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
            }
        }
        // Hide progress bar and refresh file list
        setTimeout(() => {
            progressBar.classList.add('hidden');
            this.fileManager.navigateToPath(this.fileManager.getState().currentPath);
        }, 1000);
    }
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', this.fileManager.getState().currentPath);
        const response = await fetch('/api/v1/files/upload', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }
    }
}
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize file manager
    const fileManager = new FileManager('#file-manager');
    // Store global reference for debugging
    window.fileManager = fileManager;
});
// Export types and classes for potential module usage
export { FileManager, BreadcrumbNavigation, SearchBox, ViewToggle, FileGrid, SidebarTree, UploadZone };
