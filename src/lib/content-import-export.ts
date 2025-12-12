import fs from 'fs';
import path from 'path';
import { getContentFile, updateContentItem, deleteContentItem } from '@/lib/content-storage';

/**
 * Bulk import/export operations for content management
 * Supports JSON, CSV, and programmatic formats
 */

export interface ExportOptions {
  types: ('blog' | 'research' | 'project')[];
  format: 'json' | 'csv' | 'jsonl';
  includeMetadata?: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  details?: any[];
}

/**
 * Export content to various formats
 */
export function exportContent(options: ExportOptions): string {
  const { types, format, includeMetadata = true } = options;
  const data: any[] = [];

  types.forEach((type) => {
    const items = getContentFile(type);
    items.forEach((item: any) => {
      data.push({
        type,
        ...item,
        ...(includeMetadata && {
          _exported: new Date().toISOString(),
          _contentType: type,
        }),
      });
    });
  });

  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);

    case 'jsonl':
      return data.map((item) => JSON.stringify(item)).join('\n');

    case 'csv':
      return contentToCSV(data);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Convert content data to CSV format
 */
function contentToCSV(items: any[]): string {
  if (items.length === 0) return '';

  // Get all unique keys across all items
  const keys = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!key.startsWith('_') && typeof item[key] !== 'object') {
        keys.add(key);
      }
    });
  });

  const header = Array.from(keys).join(',');
  const rows = items.map((item) => {
    return Array.from(keys)
      .map((key) => {
        const value = item[key];
        if (value === undefined || value === null) return '';
        const stringValue = String(value);
        // Escape CSV special characters
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Import content from JSON format
 */
export function importContent(jsonData: string): ImportResult {
  const result: ImportResult = {
    success: false,
    imported: 0,
    failed: 0,
    errors: [],
    details: [],
  };

  try {
    const items = JSON.parse(jsonData);
    const itemArray = Array.isArray(items) ? items : [items];

    itemArray.forEach((item: any, index: number) => {
      try {
        const type = item.type as 'blog' | 'research' | 'project';
        if (!['blog', 'research', 'project'].includes(type)) {
          throw new Error(`Invalid content type: ${type}`);
        }

        const slug = item.slug || (item.title || `item-${index}`).toLowerCase().replace(/\s+/g, '-');

        // Remove internal fields
        const { type: _, _exported, _contentType, ...updates } = item;

        const importResult = updateContentItem(type, slug, updates);

        if (importResult.success) {
          result.imported++;
          result.details?.push({
            index,
            slug,
            status: 'success',
            message: 'Imported successfully',
          });
        } else {
          result.failed++;
          result.errors.push(`Item ${index}: ${importResult.message}`);
          result.details?.push({
            index,
            slug,
            status: 'failed',
            message: importResult.message,
          });
        }
      } catch (error) {
        result.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Item ${index}: ${errorMsg}`);
        result.details?.push({
          index,
          status: 'failed',
          message: errorMsg,
        });
      }
    });

    result.success = result.failed === 0;
    return result;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
    return result;
  }
}

/**
 * Bulk delete content by criteria
 */
export function bulkDelete(options: {
  type?: 'blog' | 'research' | 'project';
  slugs?: string[];
  olderThan?: Date;
  confirm?: boolean;
}): ImportResult {
  const result: ImportResult = {
    success: false,
    imported: 0,
    failed: 0,
    errors: [],
  };

  const types: ('blog' | 'research' | 'project')[] = options.type
    ? [options.type]
    : ['blog', 'research', 'project'];

  types.forEach((type) => {
    const items = getContentFile(type);

    items.forEach((item: any) => {
      let shouldDelete = false;

      // Check slug criteria
      if (options.slugs && options.slugs.length > 0) {
        shouldDelete = options.slugs.includes(item.slug);
      }

      // Check date criteria
      if (options.olderThan) {
        const itemDate = new Date(item.date || item.createdAt || 0);
        shouldDelete = itemDate < options.olderThan;
      }

      if (shouldDelete && options.confirm) {
        const slug = item.slug || (item.title || '').toLowerCase().replace(/\s+/g, '-');
        const deleteResult = deleteContentItem(type, slug);

        if (deleteResult.success) {
          result.imported++;
        } else {
          result.failed++;
          result.errors.push(deleteResult.message);
        }
      }
    });
  });

  result.success = result.failed === 0;
  return result;
}

/**
 * Get import/export statistics
 */
export function getContentStats(): Record<string, any> {
  const stats: Record<string, any> = {
    blog: { count: 0, featured: 0 },
    research: { count: 0, categories: new Set() },
    project: { count: 0, featured: 0, technologies: new Set() },
  };

  const types: ('blog' | 'research' | 'project')[] = ['blog', 'research', 'project'];

  types.forEach((type) => {
    const items = getContentFile(type);
    stats[type].count = items.length;

    if (type === 'blog' || type === 'project') {
      stats[type].featured = items.filter((item: any) => item.featured).length;
    }

    if (type === 'research') {
      items.forEach((item: any) => {
        if (item.category) {
          stats[type].categories.add(item.category);
        }
      });
      stats[type].categories = Array.from(stats[type].categories);
    }

    if (type === 'project') {
      items.forEach((item: any) => {
        if (item.tech && Array.isArray(item.tech)) {
          item.tech.forEach((t: string) => stats[type].technologies.add(t));
        }
      });
      stats[type].technologies = Array.from(stats[type].technologies);
    }
  });

  return stats;
}
