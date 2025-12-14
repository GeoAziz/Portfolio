"use client";
import React, { useEffect, useState } from 'react';
import { initializePrism, getLanguageLabel } from '@/lib/prism-config';

interface Props {
  code: string;
  language: string;
}

export default function CodeBlockClient({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Ensure Prism runs on the client to apply plugins (line-numbers, copy, etc.)
    initializePrism();
  }, []);

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // fallback
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{getLanguageLabel(language)}</div>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.06)',
          color: 'inherit',
          padding: '0.25rem 0.5rem',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: '0.75rem',
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
