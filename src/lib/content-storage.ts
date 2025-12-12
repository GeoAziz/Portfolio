import fs from 'fs';
import path from 'path';

/**
 * Content storage layer for managing blog posts, research entries, and projects
 * Provides file-based persistence with change history tracking
 */

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const BACKUPS_DIR = path.join(CONTENT_DIR, '.backups');

// Ensure backups directory exists
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

export interface ContentChange {
  type: 'create' | 'update' | 'delete';
  contentType: 'blog' | 'research' | 'project';
  slug: string;
  timestamp: string;
  changes?: Record<string, any>;
  previousValue?: any;
}

export interface StorageResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Create a timestamped backup before making changes
 */
function createBackup(fileName: string, content: any): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${fileName.replace('.json', '')}_${timestamp}.json`;
  const backupPath = path.join(BACKUPS_DIR, backupName);
  
  fs.writeFileSync(backupPath, JSON.stringify(content, null, 2));
  return backupPath;
}

/**
 * Log content changes to a history file
 */
function logChange(change: ContentChange): void {
  const historyFile = path.join(CONTENT_DIR, '.history.json');
  let history: ContentChange[] = [];
  
  if (fs.existsSync(historyFile)) {
    const contents = fs.readFileSync(historyFile, 'utf8');
    history = JSON.parse(contents);
  }
  
  history.push(change);
  // Keep last 1000 changes
  if (history.length > 1000) {
    history = history.slice(-1000);
  }
  
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

/**
 * Get all content items of a specific type
 */
export function getContentFile(type: 'blog' | 'research' | 'project'): any[] {
  const fileMap = {
    blog: 'blog-posts.json',
    research: 'research.json',
    project: 'projects.json',
  };
  
  const filePath = path.join(CONTENT_DIR, fileMap[type]);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const contents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    console.error(`Error reading ${fileMap[type]}:`, error);
    return [];
  }
}

/**
 * Update or create a content item
 */
export function updateContentItem(
  type: 'blog' | 'research' | 'project',
  slug: string,
  updates: Record<string, any>
): StorageResult {
  try {
    const fileMap = {
      blog: 'blog-posts.json',
      research: 'research.json',
      project: 'projects.json',
    };
    
    const filePath = path.join(CONTENT_DIR, fileMap[type]);
    let items = getContentFile(type);
    
    // Create backup before modifying
    createBackup(fileMap[type], items);
    
    // Find the item to update
    const itemIndex = items.findIndex((item: any) => {
      const itemSlug = item.slug || (item.name || item.title || '').toLowerCase().replace(/\s+/g, '-');
      return itemSlug === slug;
    });
    
    let changeType: 'create' | 'update' = 'update';
    const previousValue = itemIndex >= 0 ? items[itemIndex] : null;
    
    if (itemIndex >= 0) {
      // Update existing
      items[itemIndex] = { ...items[itemIndex], ...updates };
    } else {
      // Create new
      changeType = 'create';
      items.push({
        ...updates,
        slug,
        createdAt: new Date().toISOString(),
      });
    }
    
    // Write updated content
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    
    // Log change
    logChange({
      type: changeType,
      contentType: type,
      slug,
      timestamp: new Date().toISOString(),
      changes: updates,
      previousValue,
    });
    
    return {
      success: true,
      message: `${type} content ${changeType === 'create' ? 'created' : 'updated'} successfully`,
      data: items[itemIndex >= 0 ? itemIndex : items.length - 1],
    };
  } catch (error) {
    console.error('Error updating content:', error);
    return {
      success: false,
      message: `Failed to update content: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Delete a content item
 */
export function deleteContentItem(
  type: 'blog' | 'research' | 'project',
  slug: string
): StorageResult {
  try {
    const fileMap = {
      blog: 'blog-posts.json',
      research: 'research.json',
      project: 'projects.json',
    };
    
    const filePath = path.join(CONTENT_DIR, fileMap[type]);
    let items = getContentFile(type);
    
    // Create backup before modifying
    createBackup(fileMap[type], items);
    
    // Find and remove the item
    const itemIndex = items.findIndex((item: any) => {
      const itemSlug = item.slug || (item.name || item.title || '').toLowerCase().replace(/\s+/g, '-');
      return itemSlug === slug;
    });
    
    if (itemIndex === -1) {
      return {
        success: false,
        message: `${type} content with slug "${slug}" not found`,
      };
    }
    
    const deletedItem = items[itemIndex];
    items.splice(itemIndex, 1);
    
    // Write updated content
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    
    // Log change
    logChange({
      type: 'delete',
      contentType: type,
      slug,
      timestamp: new Date().toISOString(),
      previousValue: deletedItem,
    });
    
    return {
      success: true,
      message: `${type} content deleted successfully`,
      data: deletedItem,
    };
  } catch (error) {
    console.error('Error deleting content:', error);
    return {
      success: false,
      message: `Failed to delete content: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get change history
 */
export function getChangeHistory(
  type?: 'blog' | 'research' | 'project',
  limit = 100
): ContentChange[] {
  const historyFile = path.join(CONTENT_DIR, '.history.json');
  
  if (!fs.existsSync(historyFile)) {
    return [];
  }
  
  try {
    const contents = fs.readFileSync(historyFile, 'utf8');
    let history: ContentChange[] = JSON.parse(contents);
    
    if (type) {
      history = history.filter(h => h.contentType === type);
    }
    
    return history.slice(-limit).reverse();
  } catch (error) {
    console.error('Error reading change history:', error);
    return [];
  }
}

/**
 * Restore from backup
 */
export function restoreFromBackup(
  type: 'blog' | 'research' | 'project',
  backupTimestamp: string
): StorageResult {
  try {
    const fileMap = {
      blog: 'blog-posts.json',
      research: 'research.json',
      project: 'projects.json',
    };
    
    const backupName = `${fileMap[type].replace('.json', '')}_${backupTimestamp}.json`;
    const backupPath = path.join(BACKUPS_DIR, backupName);
    
    if (!fs.existsSync(backupPath)) {
      return {
        success: false,
        message: `Backup not found: ${backupName}`,
      };
    }
    
    const backupContents = fs.readFileSync(backupPath, 'utf8');
    const backupData = JSON.parse(backupContents);
    
    // Create backup of current state before restoring
    createBackup(fileMap[type], getContentFile(type));
    
    // Restore the backup
    const filePath = path.join(CONTENT_DIR, fileMap[type]);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
    
    logChange({
      type: 'update',
      contentType: type,
      slug: `restore-${backupTimestamp}`,
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      message: `Restored from backup: ${backupName}`,
      data: backupData,
    };
  } catch (error) {
    console.error('Error restoring backup:', error);
    return {
      success: false,
      message: `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get list of available backups
 */
export function listBackups(type?: 'blog' | 'research' | 'project'): string[] {
  try {
    const files = fs.readdirSync(BACKUPS_DIR);
    let backups = files.filter(f => f.endsWith('.json'));
    
    if (type) {
      const prefix = type === 'blog' ? 'blog-posts' : type;
      backups = backups.filter(f => f.startsWith(prefix));
    }
    
    return backups.sort().reverse();
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}
