import React from 'react';
import { highlightCode, isSupportedLanguage } from '@/lib/prism-config';
// Ensure Prism languages/plugins are loaded (side-effect import in prism-config)
import '@/lib/prism-config';
import CodeBlockClient from './CodeBlockClient';

interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

function CodeBlock({ children, className }: CodeProps) {
  const code = String(children ?? '').trim();
  const language = className?.replace(/language-/, '') || 'javascript';
  const safeLang = isSupportedLanguage(language) ? language : 'javascript';
  const highlighted = highlightCode(code, safeLang);

  return (
    <div className={`line-numbers-wrapper`}>
      <pre className={`language-${safeLang} line-numbers`}>
        <code
          className={`language-${safeLang}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      {/* Client component will hydrate and provide copy button + language label and initialize Prism plugins */}
      <CodeBlockClient code={code} language={safeLang} />
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="inline-code" style={{ background: 'rgba(0,0,0,0.4)', padding: '0.15rem 0.35rem', borderRadius: 4 }}>
      {children}
    </code>
  );
}

const MDXComponents = {
  pre: (props: any) => <div {...props} />,
  code: CodeBlock,
  inlineCode: InlineCode,
  a: (props: any) => <a {...props} />,
  img: (props: any) => <img {...props} style={{ maxWidth: '100%' }} />,
};

export default MDXComponents;
