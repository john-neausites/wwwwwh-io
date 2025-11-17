/**
 * wwwwwh.io File Navigation System
 * TypeScript Component System for Modern File Management
 */

// Types and Interfaces
interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  path: string;
  mimeType?: string;
  parentId?: string;
}

interface FileSystemState {
  currentPath: string;
  files: FileItem[];
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'size' | 'modified';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  loading: boolean;
}

// Component Base Class
abstract class Component {
  protected element: HTMLElement;
  protected listeners: Array<{ element: Element, event: string, handler: EventListener }> = [];
  
  constructor(selector: string) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    this.element = element as HTMLElement;
  }
  
  protected addEventListener(element: Element, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }
  
  protected removeEventListeners(): void {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
  
  abstract render(): void;
  
  destroy(): void {
    this.removeEventListeners();
  }
}

// File Manager Main Component
class FileManager extends Component {
  private state: FileSystemState = {
    currentPath: '/',
    files: [],
    selectedFiles: [],
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    loading: false
  };
  
  private components: {
    breadcrumb?: BreadcrumbNavigation;
    searchBox?: SearchBox;
    viewToggle?: ViewToggle;
    fileGrid?: FileGrid;
    sidebar?: SidebarTree;
    uploadZone?: UploadZone;
  } = {};
  
  constructor(selector: string) {
    super(selector);
    this.initializeComponents();
    this.loadInitialData();
  }
  
  private initializeComponents(): void {
    this.components.breadcrumb = new BreadcrumbNavigation('.breadcrumb-container', this);
    this.components.searchBox = new SearchBox('.search-container', this);
    this.components.viewToggle = new ViewToggle('.view-toggle-container', this);
    this.components.fileGrid = new FileGrid('.file-grid-container', this);
    this.components.sidebar = new SidebarTree('.sidebar-tree-container', this);
    this.components.uploadZone = new UploadZone('.upload-zone-container', this);
  }
  
  private async loadInitialData(): Promise<void> {
    this.setState({ loading: true });
    try {
      const files = await this.fetchFiles(this.state.currentPath);
      this.setState({ files, loading: false });
    } catch (error) {
      console.error('Failed to load files:', error);
      this.setState({ loading: false });
    }
  }
  
  private async fetchFiles(path: string): Promise<FileItem[]> {
    const response = await fetch(`/api/v1/files?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    return response.json();
  }
  
  // State Management
  public getState(): FileSystemState {
    return { ...this.state };
  }
  
  public setState(newState: Partial<FileSystemState>): void {
    this.state = { ...this.state, ...newState };
    this.render();
    this.notifyComponents();
  }
  
  private notifyComponents(): void {
    Object.values(this.components).forEach(component => {
      if (component && typeof component.onStateUpdate === 'function') {
        component.onStateUpdate(this.state);
      }
    });
  }
  
  // Public Methods
  public async navigateToPath(path: string): Promise<void> {
    if (path === this.state.currentPath) return;
    
    this.setState({ loading: true, currentPath: path });
    try {
      const files = await this.fetchFiles(path);
      this.setState({ files, loading: false });
    } catch (error) {
      console.error('Navigation failed:', error);
      this.setState({ loading: false });
    }
  }
  
  public selectFile(fileId: string, multiSelect = false): void {
    let selectedFiles = [...this.state.selectedFiles];
    
    if (multiSelect) {
      if (selectedFiles.includes(fileId)) {
        selectedFiles = selectedFiles.filter(id => id !== fileId);
      } else {
        selectedFiles.push(fileId);
      }
    } else {
      selectedFiles = [fileId];
    }
    
    this.setState({ selectedFiles });
  }
  
  public setViewMode(mode: 'grid' | 'list'): void {
    this.setState({ viewMode: mode });
  }
  
  public setSorting(sortBy: FileSystemState['sortBy'], sortOrder: FileSystemState['sortOrder']): void {
    this.setState({ sortBy, sortOrder });
  }
  
  public setSearchQuery(query: string): void {
    this.setState({ searchQuery: query });
  }
  
  public render(): void {
    // Render main layout - this would typically be handled by a template system
    // For now, we'll assume the HTML structure exists
  }
}

// Breadcrumb Navigation Component
class BreadcrumbNavigation extends Component {
  constructor(selector: string, private fileManager: FileManager) {
    super(selector);
    this.render();
  }
  
  public onStateUpdate(state: FileSystemState): void {
    this.render();
  }
  
  public render(): void {
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
  
  private bindEvents(): void {
    this.removeEventListeners();
    
    const breadcrumbItems = this.element.querySelectorAll('.breadcrumb-item');
    breadcrumbItems.forEach(item => {
      this.addEventListener(item, 'click', (e) => {
        e.preventDefault();
        const path = (item as HTMLElement).dataset.path || '/';
        this.fileManager.navigateToPath(path);
      });
    });
  }
}

// Search Box Component
class SearchBox extends Component {
  private debounceTimer?: number;
  
  constructor(selector: string, private fileManager: FileManager) {
    super(selector);
    this.render();
  }
  
  public onStateUpdate(state: FileSystemState): void {
    const input = this.element.querySelector('.search-input') as HTMLInputElement;
    if (input && input.value !== state.searchQuery) {
      input.value = state.searchQuery;
    }
  }
  
  public render(): void {
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
  
  private bindEvents(): void {
    this.removeEventListeners();
    
    const searchInput = this.element.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      this.addEventListener(searchInput, 'input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        
        // Debounce search
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
          this.fileManager.setSearchQuery(query);
        }, 300) as any;
      });
    }
  }
}

// View Toggle Component
class ViewToggle extends Component {
  constructor(selector: string, private fileManager: FileManager) {
    super(selector);
    this.render();
  }
  
  public onStateUpdate(state: FileSystemState): void {
    this.render();
  }
  
  public render(): void {
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
  
  private bindEvents(): void {
    this.removeEventListeners();
    
    const toggleItems = this.element.querySelectorAll('.view-toggle-item');
    toggleItems.forEach(item => {
      this.addEventListener(item, 'click', () => {
        const viewMode = (item as HTMLElement).dataset.view as 'grid' | 'list';
        this.fileManager.setViewMode(viewMode);
      });
    });
  }
}

// File Grid Component
class FileGrid extends Component {
  constructor(selector: string, private fileManager: FileManager) {
    super(selector);
    this.render();
  }
  
  public onStateUpdate(state: FileSystemState): void {
    this.render();
  }
  
  public render(): void {
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
  
  private renderLoading(): void {
    this.element.innerHTML = `
      <div class="flex items-center justify-center p-xl">
        <div class="loading-spinner"></div>
        <span class="ml-sm">Loading files...</span>
      </div>
    `;
  }
  
  private renderFileItem(file: FileItem, isSelected: boolean): string {
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
  
  private getFileIcon(file: FileItem): string {
    if (file.type === 'folder') return '📁';
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return '🖼';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || '')) return '🎬';
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext || '')) return '🎵';
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return '📄';
    if (['zip', 'rar', '7z', 'tar'].includes(ext || '')) return '📦';
    
    return '📄';
  }
  
  private getFileIconClass(file: FileItem): string {
    if (file.type === 'folder') return 'folder';
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext || '')) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return 'document';
    if (['zip', 'rar', '7z', 'tar'].includes(ext || '')) return 'archive';
    
    return 'default';
  }
  
  private filterFiles(files: FileItem[], query: string): FileItem[] {
    if (!query.trim()) return files;
    
    const lowercaseQuery = query.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  private sortFiles(files: FileItem[], sortBy: string, sortOrder: string): FileItem[] {
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
  
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
  
  private formatDate(date: Date): string {
    // Use a simpler date formatting approach
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }
  
  private bindEvents(): void {
    this.removeEventListeners();
    
    // File item clicks
    const fileItems = this.element.querySelectorAll('.file-item');
    fileItems.forEach(item => {
      this.addEventListener(item, 'click', (e) => {
        const fileId = (item as HTMLElement).dataset.fileId!;
        const multiSelect = (e as MouseEvent).ctrlKey || (e as MouseEvent).metaKey;
        this.fileManager.selectFile(fileId, multiSelect);
      });
      
      this.addEventListener(item, 'dblclick', (e) => {
        const fileId = (item as HTMLElement).dataset.fileId!;
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
        const action = (button as HTMLElement).dataset.action;
        const fileItem = button.closest('.file-item') as HTMLElement;
        const fileId = fileItem.dataset.fileId!;
        
        this.handleFileAction(action!, fileId);
      });
    });
  }
  
  private handleFileAction(action: string, fileId: string): void {
    const file = this.fileManager.getState().files.find(f => f.id === fileId);
    if (!file) return;
    
    switch (action) {
      case 'download':
        this.downloadFile(file);
        break;
      case 'delete':
        this.deleteFile(file);
        break;
    }
  }
  
  private downloadFile(file: FileItem): void {
    const link = document.createElement('a');
    link.href = `/api/v1/files/download?path=${encodeURIComponent(file.path)}`;
    link.download = file.name;
    link.click();
  }
  
  private async deleteFile(file: FileItem): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;
    
    try {
      const response = await fetch(`/api/v1/files?path=${encodeURIComponent(file.path)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh file list
        this.fileManager.navigateToPath(this.fileManager.getState().currentPath);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
}

// Sidebar Tree Component
class SidebarTree extends Component {
  constructor(selector: string, private fileManager: FileManager) {
    super(selector);
    this.render();
  }
  
  public onStateUpdate(state: FileSystemState): void {
    // Update active path in tree
    this.updateActiveItem();
  }
  
  public render(): void {
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
  
  private updateActiveItem(): void {
    const currentPath = this.fileManager.getState().currentPath;
    const items = this.element.querySelectorAll('.file-tree-toggle');
    
    items.forEach(item => {
      const path = (item as HTMLElement).dataset.path;
      item.classList.toggle('active', path === currentPath);
    });
  }
  
  private bindEvents(): void {
    this.removeEventListeners();
    
    const toggles = this.element.querySelectorAll('.file-tree-toggle');
    toggles.forEach(toggle => {
      this.addEventListener(toggle, 'click', () => {
        const path = (toggle as HTMLElement).dataset.path || '/';
        this.fileManager.navigateToPath(path);
      });
    });
  }
}

// Upload Zone Component
class UploadZone extends Component {
  constructor(selector: string, private fileManager: FileManager) {
    super(selector);
    this.render();
  }
  
  public onStateUpdate(state: FileSystemState): void {
    // Update upload zone based on current path
  }
  
  public render(): void {
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
  
  private bindEvents(): void {
    this.removeEventListeners();
    
    const uploadZone = this.element.querySelector('.upload-zone') as HTMLElement;
    const fileInput = this.element.querySelector('.file-input') as HTMLInputElement;
    
    // Click to browse
    this.addEventListener(uploadZone, 'click', () => {
      fileInput.click();
    });
    
    // File input change
    this.addEventListener(fileInput, 'change', (e) => {
      const files = (e.target as HTMLInputElement).files;
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
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      
      const files = Array.from((e as DragEvent).dataTransfer?.files || []);
      this.handleFiles(files);
    });
  }
  
  private async handleFiles(files: File[]): Promise<void> {
    const progressBar = this.element.querySelector('.progress-bar') as HTMLElement;
    const progressFill = this.element.querySelector('.progress-fill') as HTMLElement;
    
    progressBar.classList.remove('hidden');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      
      try {
        await this.uploadFile(file);
        progressFill.style.width = `${progress}%`;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
    
    // Hide progress bar and refresh file list
    setTimeout(() => {
      progressBar.classList.add('hidden');
      this.fileManager.navigateToPath(this.fileManager.getState().currentPath);
    }, 1000);
  }
  
  private async uploadFile(file: File): Promise<void> {
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
  (window as any).fileManager = fileManager;
});

// Export types and classes for potential module usage
export {
  FileManager,
  BreadcrumbNavigation,
  SearchBox,
  ViewToggle,
  FileGrid,
  SidebarTree,
  UploadZone,
  type FileItem,
  type FileSystemState
};