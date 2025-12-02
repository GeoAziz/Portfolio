/**
 * Calculate estimated reading time based on word count
 * Average reading speed: 200-250 words per minute
 * @param text - The text content to calculate reading time for
 * @param wordsPerMinute - Reading speed (default: 225)
 * @returns Estimated reading time in minutes
 */
export function calculateReadTime(text: string, wordsPerMinute: number = 225): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Format reading time into a human-readable string
 * @param minutes - Number of minutes
 * @returns Formatted string like "5 min read" or "< 1 min read"
 */
export function formatReadTime(minutes: number): string {
  if (minutes < 1) return '< 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Calculate and format reading time in one go
 * @param text - The text content
 * @returns Formatted reading time string
 */
export function getReadTimeText(text: string): string {
  const minutes = calculateReadTime(text);
  return formatReadTime(minutes);
}
