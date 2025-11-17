import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  path: string;
  mimeType?: string;
  parentId?: string;
}

class FileService {
  private baseDirectory: string;

  constructor() {
    // Use a safe uploads directory in the project
    this.baseDirectory = path.resolve(process.cwd(), 'uploads');
    this.ensureBaseDirectory();
  }

  private async ensureBaseDirectory(): Promise<void> {
    try {
      await fs.access(this.baseDirectory);
    } catch {
      await fs.mkdir(this.baseDirectory, { recursive: true });
      logger.info(`Created uploads directory: ${this.baseDirectory}`);
    }
  }

  private sanitizePath(inputPath: string): string {
    // Remove any dangerous path components
    return inputPath
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/\/+/g, '/') // Normalize multiple slashes
      .replace(/^\//, ''); // Remove leading slash
  }

  private getFullPath(relativePath: string): string {
    const sanitized = this.sanitizePath(relativePath);
    return path.join(this.baseDirectory, sanitized);
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.json': 'application/json',
      '.zip': 'application/zip',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  public async listFiles(requestPath: string = ''): Promise<FileItem[]> {
    try {
      const fullPath = this.getFullPath(requestPath);
      
      // Ensure the path exists and is within our base directory
      const resolvedPath = path.resolve(fullPath);
      const resolvedBase = path.resolve(this.baseDirectory);
      
      if (!resolvedPath.startsWith(resolvedBase)) {
        throw new Error('Access denied: Path outside allowed directory');
      }

      await fs.access(fullPath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      const files: FileItem[] = [];
      
      for (const entry of entries) {
        const entryPath = path.join(fullPath, entry.name);
        const relativePath = path.relative(this.baseDirectory, entryPath);
        const stats = await fs.stat(entryPath);
        
        const fileItem: FileItem = {
          id: uuidv4(),
          name: entry.name,
          type: entry.isDirectory() ? 'folder' : 'file',
          size: entry.isFile() ? stats.size : undefined,
          modified: stats.mtime,
          path: '/' + relativePath.replace(/\\/g, '/'), // Normalize path separators
          mimeType: entry.isFile() ? this.getMimeType(entry.name) : undefined,
        };
        
        files.push(fileItem);
      }
      
      // Sort: folders first, then files, both alphabetically
      return files.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
    } catch (error) {
      logger.error(`Failed to list files in ${requestPath}:`, error);
      throw new Error(`Failed to access directory: ${requestPath}`);
    }
  }

  public async createFolder(folderName: string, parentPath: string = ''): Promise<FileItem> {
    try {
      const sanitizedName = folderName.replace(/[<>:"/\\|?*]/g, ''); // Remove invalid filename characters
      if (!sanitizedName) {
        throw new Error('Invalid folder name');
      }

      const parentFullPath = this.getFullPath(parentPath);
      const folderFullPath = path.join(parentFullPath, sanitizedName);
      const relativePath = path.relative(this.baseDirectory, folderFullPath);
      
      // Check if folder already exists
      try {
        await fs.access(folderFullPath);
        throw new Error('Folder already exists');
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      await fs.mkdir(folderFullPath, { recursive: true });
      const stats = await fs.stat(folderFullPath);
      
      const folderItem: FileItem = {
        id: uuidv4(),
        name: sanitizedName,
        type: 'folder',
        modified: stats.mtime,
        path: '/' + relativePath.replace(/\\/g, '/'),
      };
      
      logger.info(`Created folder: ${folderItem.path}`);
      return folderItem;
      
    } catch (error) {
      logger.error(`Failed to create folder ${folderName} in ${parentPath}:`, error);
      throw error;
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = this.getFullPath(filePath);
      
      // Security check
      const resolvedPath = path.resolve(fullPath);
      const resolvedBase = path.resolve(this.baseDirectory);
      
      if (!resolvedPath.startsWith(resolvedBase)) {
        throw new Error('Access denied: Path outside allowed directory');
      }

      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        // Remove directory and all contents
        await fs.rm(fullPath, { recursive: true, force: true });
      } else {
        // Remove file
        await fs.unlink(fullPath);
      }
      
      logger.info(`Deleted: ${filePath}`);
      
    } catch (error) {
      logger.error(`Failed to delete ${filePath}:`, error);
      throw new Error(`Failed to delete: ${filePath}`);
    }
  }

  public async saveUploadedFile(fileBuffer: Buffer, filename: string, targetPath: string = ''): Promise<FileItem> {
    try {
      const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, ''); // Remove invalid characters
      if (!sanitizedFilename) {
        throw new Error('Invalid filename');
      }

      const targetFullPath = this.getFullPath(targetPath);
      const fileFullPath = path.join(targetFullPath, sanitizedFilename);
      const relativePath = path.relative(this.baseDirectory, fileFullPath);
      
      // Ensure target directory exists
      await fs.mkdir(targetFullPath, { recursive: true });
      
      // Write file
      await fs.writeFile(fileFullPath, fileBuffer);
      const stats = await fs.stat(fileFullPath);
      
      const fileItem: FileItem = {
        id: uuidv4(),
        name: sanitizedFilename,
        type: 'file',
        size: stats.size,
        modified: stats.mtime,
        path: '/' + relativePath.replace(/\\/g, '/'),
        mimeType: this.getMimeType(sanitizedFilename),
      };
      
      logger.info(`Uploaded file: ${fileItem.path} (${fileItem.size} bytes)`);
      return fileItem;
      
    } catch (error) {
      logger.error(`Failed to save uploaded file ${filename}:`, error);
      throw new Error(`Failed to upload: ${filename}`);
    }
  }

  public async getFileStream(filePath: string): Promise<{ stream: NodeJS.ReadableStream; stats: any; mimeType: string }> {
    try {
      const fullPath = this.getFullPath(filePath);
      
      // Security check
      const resolvedPath = path.resolve(fullPath);
      const resolvedBase = path.resolve(this.baseDirectory);
      
      if (!resolvedPath.startsWith(resolvedBase)) {
        throw new Error('Access denied: Path outside allowed directory');
      }

      const stats = await fs.stat(fullPath);
      
      if (!stats.isFile()) {
        throw new Error('Path is not a file');
      }

      const { createReadStream } = await import('fs');
      const stream = createReadStream(fullPath);
      const mimeType = this.getMimeType(path.basename(filePath));
      
      return { stream, stats, mimeType };
      
    } catch (error) {
      logger.error(`Failed to get file stream for ${filePath}:`, error);
      throw new Error(`Failed to access file: ${filePath}`);
    }
  }

  public getBaseDirectory(): string {
    return this.baseDirectory;
  }
}

export const fileService = new FileService();