/**
 * Code Syntax Highlighting Demo Page
 * 
 * Showcase of syntax highlighting capabilities
 */

'use client';

import React from 'react';
import { PageHeader, PageSection } from '@/components/layouts';
import { SectionHeader } from '@/components/SectionHeader';
import { MotionFade } from '@/components/MotionFade';
import { CodeBlock, CodeBlockSelector, SUPPORTED_LANGUAGES } from '@/components/CodeBlock';

const pythonExample = `def fibonacci(n):
    """Calculate fibonacci sequence up to n."""
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b
    print()

fibonacci(1000)`;

const jsExample = `const fibonacci = (n) => {
  let [a, b] = [0, 1];
  while (a < n) {
    console.log(a);
    [a, b] = [b, a + b];
  }
};

fibonacci(1000);`;

const tsExample = `interface FibonacciOptions {
  limit: number;
  verbose?: boolean;
}

const fibonacci = (options: FibonacciOptions): number[] => {
  const { limit, verbose = false } = options;
  const result: number[] = [];
  let [a, b] = [0, 1];
  
  while (a < limit) {
    result.push(a);
    if (verbose) console.log(a);
    [a, b] = [b, a + b];
  }
  
  return result;
};`;

const rustExample = `fn fibonacci(n: u32) {
    let mut a = 0;
    let mut b = 1;
    
    while a < n {
        println!("{}", a);
        let temp = a + b;
        a = b;
        b = temp;
    }
}

fn main() {
    fibonacci(1000);
}`;

const jsonExample = `{
  "name": "portfolio",
  "version": "1.0.0",
  "description": "Advanced portfolio with syntax highlighting",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "prismjs": "^1.29.0"
  }
}`;

export default function SyntaxHighlightingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Header */}
      <PageHeader
        title="Code Syntax Highlighting"
        subtitle="Professional Code Display"
        description="Syntax highlighting with Prism.js supporting 15+ programming languages"
      />

      <PageSection>
        {/* Introduction */}
        <MotionFade delay={0.1}>
          <div className="mb-12">
            <SectionHeader title="Supported Languages" />
            <p className="text-slate-400 leading-relaxed max-w-2xl mt-3">
              This code block component provides professional syntax highlighting for over 15
              programming languages. Features include line numbers, copy-to-clipboard button,
              line highlighting, and language detection.
            </p>

            {/* Supported Languages Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
              {SUPPORTED_LANGUAGES.map(lang => (
                <div key={lang.code} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="text-sm font-medium text-slate-300">{lang.label}</div>
                  <div className="text-xs text-slate-500 font-mono">{lang.code}</div>
                </div>
              ))}
            </div>
          </div>
        </MotionFade>

        {/* Multi-language Example */}
        <MotionFade delay={0.2}>
          <div className="mb-12">
            <SectionHeader title="Fibonacci Implementation" />
            <p className="text-slate-400 leading-relaxed max-w-2xl mt-3 mb-6">
              Same algorithm implemented in different languages with full syntax highlighting
            </p>
            <CodeBlockSelector
              examples={[
                { language: 'javascript', code: jsExample, label: 'JavaScript' },
                { language: 'typescript', code: tsExample, label: 'TypeScript' },
                { language: 'python', code: pythonExample, label: 'Python' },
                { language: 'rust', code: rustExample, label: 'Rust' },
              ]}
            />
          </div>
        </MotionFade>

        {/* JSON Example */}
        <MotionFade delay={0.3}>
          <div className="mb-12">
            <SectionHeader title="Configuration Files" />
            <p className="text-slate-400 leading-relaxed max-w-2xl mt-3 mb-6">
              Package.json with syntax highlighting
            </p>
            <CodeBlock
              code={jsonExample}
              language="json"
              filename="package.json"
              lineNumbers={true}
              showCopyButton={true}
            />
          </div>
        </MotionFade>

        {/* Features */}
        <MotionFade delay={0.4}>
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">✨ Syntax Highlighting</h3>
                  <p className="text-sm text-slate-400">
                    Professional color-coded syntax for 15+ programming languages with Prism.js
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">📋 Copy Button</h3>
                  <p className="text-sm text-slate-400">
                    One-click copy to clipboard with visual feedback
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">🔢 Line Numbers</h3>
                  <p className="text-sm text-slate-400">
                    Optional line numbers for easy reference and line highlighting
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">📁 Filename Display</h3>
                  <p className="text-sm text-slate-400">
                    Show source file names or custom labels above code blocks
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">🎨 Dark Theme</h3>
                  <p className="text-sm text-slate-400">
                    Beautiful dark theme designed to match portfolio aesthetic
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">⌨️ Multi-Language Tabs</h3>
                  <p className="text-sm text-slate-400">
                    Switch between implementations of the same code in different languages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MotionFade>

        {/* Usage Guide */}
        <MotionFade delay={0.5}>
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-6">Usage</h2>
            <CodeBlock
              code={`import { CodeBlock, CodeBlockSelector } from '@/components/CodeBlock';

// Basic usage
<CodeBlock
  code="const hello = 'world';"
  language="javascript"
  filename="hello.js"
  lineNumbers={true}
  showCopyButton={true}
/>

// Multi-language selector
<CodeBlockSelector
  examples={[
    { language: 'javascript', code: jsCode, label: 'JS' },
    { language: 'python', code: pyCode, label: 'Python' }
  ]}
/>`}
              language="typescript"
              filename="usage.tsx"
              lineNumbers={true}
            />
          </div>
        </MotionFade>
      </PageSection>
    </main>
  );
}
