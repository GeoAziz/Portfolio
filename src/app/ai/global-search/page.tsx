/**
 * Global Search / Command Palette Demo Page
 */

import { CommandPalette } from '@/components/CommandPalette';
import { SectionHeader } from '@/components/SectionHeader';
import { useSearchItems } from '@/hooks/use-search-items';
import { PageTransition } from '@/components/PageTransition';

export const metadata = {
  title: 'Global Search',
  description: 'Search across all projects, blog posts, and content with Fuse.js fuzzy search.',
};

// Client component to wrap the search functionality
function SearchPageClient() {
  // This will be moved to layout.tsx to be global
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageTransition>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionHeader title="Global Search" />
          <p className="text-slate-400 text-center max-w-2xl mx-auto mt-4">
            Press Cmd+K (or Ctrl+K) to search across all content
          </p>

          <div className="mt-12 space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">🔍 Search Features</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>Fuzzy search across projects, blog posts, hardware, and research</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>Keyboard shortcuts: Cmd+K or Ctrl+K to open</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>Arrow keys to navigate, Enter to select, Esc to close</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>Real-time search with smart ranking</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>Results grouped by type with icons</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">⌨️ Keyboard Shortcuts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded">
                  <code className="text-cyan-300 font-mono">Cmd+K / Ctrl+K</code>
                  <p className="text-sm text-slate-400 mt-2">Open search palette</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <code className="text-cyan-300 font-mono">↑ ↓</code>
                  <p className="text-sm text-slate-400 mt-2">Navigate results</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <code className="text-cyan-300 font-mono">↵ Enter</code>
                  <p className="text-sm text-slate-400 mt-2">Select result</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <code className="text-cyan-300 font-mono">Esc</code>
                  <p className="text-sm text-slate-400 mt-2">Close palette</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📊 Content Indexed</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• All main navigation pages</li>
                <li>• Projects and portfolio items</li>
                <li>• Hardware projects and components</li>
                <li>• AI experiments and research</li>
                <li>• Open source contributions</li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">💡 Try These Searches</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>• Search for technology: "React", "Python", "Arduino"</p>
                <p>• Search for project types: "AI", "Hardware", "Systems"</p>
                <p>• Search for specific projects: "CYGNUS", "NEURA-LINK", "Sensor"</p>
                <p>• Fuzzy search: Typos are tolerated (e.g., "sistems" → "systems")</p>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </div>
  );
}

// Export as default page component
export default SearchPageClient;
