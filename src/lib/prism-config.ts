/**
 * Prism Configuration
 * 
 * Setup for code syntax highlighting with support for 15+ languages
 */

import Prism from 'prismjs';

// Core languages
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';

// Plugins
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/line-highlight/prism-line-highlight';

/**
 * List of supported languages for syntax highlighting
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'javascript', label: 'JavaScript' },
  { code: 'typescript', label: 'TypeScript' },
  { code: 'python', label: 'Python' },
  { code: 'java', label: 'Java' },
  { code: 'csharp', label: 'C#' },
  { code: 'go', label: 'Go' },
  { code: 'rust', label: 'Rust' },
  { code: 'sql', label: 'SQL' },
  { code: 'bash', label: 'Bash' },
  { code: 'shell-session', label: 'Shell' },
  { code: 'json', label: 'JSON' },
  { code: 'yaml', label: 'YAML' },
  { code: 'xml', label: 'XML' },
  { code: 'html', label: 'HTML' },
  { code: 'css', label: 'CSS' },
];

/**
 * Highlight code string with Prism
 */
export function highlightCode(code: string, language: string = 'javascript'): string {
  // Validate language exists, fall back to javascript
  const lang = SUPPORTED_LANGUAGES.some(l => l.code === language) ? language : 'javascript';

  return Prism.highlight(code, Prism.languages[lang], lang);
}

/**
 * Get language label from code
 */
export function getLanguageLabel(languageCode: string): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
  return lang ? lang.label : languageCode;
}

/**
 * Check if language is supported
 */
export function isSupportedLanguage(language: string): boolean {
  return SUPPORTED_LANGUAGES.some(l => l.code === language);
}

/**
 * Initialize Prism (optional, mainly for plugins)
 */
export function initializePrism(): void {
  if (typeof window !== 'undefined') {
    Prism.highlightAll();
  }
}

export default Prism;
