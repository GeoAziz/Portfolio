/**
 * Code Block Component with Syntax Highlighting
 * 
 * Displays code with Prism syntax highlighting, line numbers, and copy button
 */

'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  highlightCode,
  getLanguageLabel,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '@/lib/prism-config';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  lineNumbers?: boolean;
  highlightLines?: number[];
  maxHeight?: string;
  showCopyButton?: boolean;
  showLanguageLabel?: boolean;
}

export function CodeBlock({
  code,
  language = 'javascript',
  filename,
  lineNumbers = true,
  highlightLines = [],
  maxHeight = '600px',
  showCopyButton = true,
  showLanguageLabel = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const validLanguage = isSupportedLanguage(language) ? language : 'javascript';
  const languageLabel = getLanguageLabel(validLanguage);

  // Highlight the code
  const highlightedCode = highlightCode(code, validLanguage);

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden bg-slate-900 border border-slate-700/50"
    >
      {/* Header */}
      {(filename || showLanguageLabel || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            {filename && (
              <span className="text-sm text-slate-400">
                📄 <span className="text-slate-300">{filename}</span>
              </span>
            )}
            {showLanguageLabel && (
              <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300 font-mono">
                {languageLabel}
              </span>
            )}
          </div>

          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                copied
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span className="text-xs">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Code Content */}
      <div className="overflow-x-auto" style={{ maxHeight, overflowY: 'auto' }}>
        <table className="w-full">
          <tbody>
            {code.split('\n').map((line, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-800/30 last:border-b-0 transition-colors ${
                  highlightLines.includes(idx + 1)
                    ? 'bg-cyan-500/10 border-b border-cyan-500/20'
                    : 'hover:bg-slate-800/20'
                }`}
              >
                {lineNumbers && (
                  <td className="w-12 px-4 py-2 text-right text-slate-500 bg-slate-900/50 select-none user-select-none">
                    <span className="text-xs font-mono">{idx + 1}</span>
                  </td>
                )}
                <td className="flex-1 px-4 py-2">
                  <code
                    className={`text-sm font-mono whitespace-pre-wrap break-words language-${validLanguage}`}
                    dangerouslySetInnerHTML={{ __html: highlightedCode.split('\n')[idx] || '' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/**
 * Inline Code Component (for short snippets)
 */
interface InlineCodeProps {
  code: string;
  language?: string;
  className?: string;
}

export function InlineCode({ code, language = 'javascript', className = '' }: InlineCodeProps) {
  const validLanguage = isSupportedLanguage(language) ? language : 'javascript';
  const highlightedCode = highlightCode(code, validLanguage);

  return (
    <code
      className={`px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm font-mono text-slate-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}

/**
 * Code Block Selector Component
 * Allows switching between multiple code examples
 */
interface CodeExample {
  language: string;
  code: string;
  label: string;
}

interface CodeBlockSelectorProps {
  examples: CodeExample[];
  filename?: string;
  defaultIndex?: number;
}

export function CodeBlockSelector({
  examples,
  filename,
  defaultIndex = 0,
}: CodeBlockSelectorProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(
    Math.min(defaultIndex, examples.length - 1)
  );

  const selected = examples[selectedIndex];

  return (
    <div className="space-y-3">
      {/* Language selector tabs */}
      <div className="flex gap-2 flex-wrap">
        {examples.map((example, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedIndex === idx
                ? 'bg-cyan-500 text-black'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <CodeBlock
        code={selected.code}
        language={selected.language}
        filename={filename}
        lineNumbers={true}
        showCopyButton={true}
      />
    </div>
  );
}

export { SUPPORTED_LANGUAGES };
