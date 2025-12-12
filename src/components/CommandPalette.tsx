/**
 * Command Palette / Global Search Component
 * 
 * Keyboard-accessible search with Cmd/Ctrl+K shortcut
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchableItem,
  createSearchIndex,
  searchItems,
  groupResultsByType,
  getTypeLabel,
  getTypeIcon,
  truncateText,
} from '@/lib/search';
import Fuse from 'fuse.js';

interface CommandPaletteProps {
  items: SearchableItem[];
  onSelect?: (item: SearchableItem) => void;
}

export function CommandPalette({ items, onSelect }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchIndexRef = useRef<Fuse<SearchableItem> | null>(null);
  const [results, setResults] = useState<(SearchableItem & { score: number })[]>([]);

  // Initialize search index
  useEffect(() => {
    searchIndexRef.current = createSearchIndex(items);
  }, [items]);

  // Handle keyboard shortcut (Cmd/Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!searchIndexRef.current) return;

    if (query.trim()) {
      const searchResults = searchItems(searchIndexRef.current, query);
      setResults(searchResults.slice(0, 20)); // Limit to 20 results
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length || 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length || 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
    }
  };

  const handleSelectResult = (item: SearchableItem) => {
    onSelect?.(item);
    // Navigate to the item
    window.location.href = item.url;
    setIsOpen(false);
    setQuery('');
  };

  const grouped = groupResultsByType(results);
  const allTypes = Object.keys(grouped);

  return (
    <>
      {/* Keyboard Shortcut Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors text-sm"
        title="Search (Cmd+K)"
      >
        <span>🔍</span>
        <span className="hidden lg:inline">Search...</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 ml-auto">
          {typeof window !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
        </span>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
            >
              <div className="mx-4 rounded-lg bg-slate-900 border border-slate-700/50 shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50">
                  <span className="text-xl">🔍</span>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search projects, blog posts, and more..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:outline-none text-sm"
                  />
                  <span className="text-xs text-slate-500">
                    {results.length > 0 && `${selectedIndex + 1}/${results.length}`}
                  </span>
                </div>

                {/* Results */}
                {results.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {allTypes.map(type => (
                      <div key={type}>
                        {/* Type Header */}
                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/50 border-t border-slate-700/50">
                          {getTypeLabel(type)}
                        </div>

                        {/* Type Results */}
                        {grouped[type].map((item, idx) => {
                          const globalIdx = results.indexOf(item);
                          const isSelected = selectedIndex === globalIdx;

                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full px-4 py-3 text-left transition-colors border-b border-slate-700/30 last:border-b-0 ${
                                isSelected
                                  ? 'bg-cyan-500/20 text-white'
                                  : 'hover:bg-slate-800/50 text-slate-300'
                              }`}
                              whileHover={{ x: 4 }}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-lg mt-0.5">{getTypeIcon(item.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-white truncate">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-1 truncate">
                                    {truncateText(item.description, 100)}
                                  </div>
                                  {item.category && (
                                    <div className="text-xs text-slate-500 mt-1">
                                      📁 {item.category}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="px-4 py-8 text-center text-slate-400">
                    <div className="text-2xl mb-2">🔍</div>
                    <p className="text-sm">No results found for "{query}"</p>
                    <p className="text-xs text-slate-500 mt-2">Try different keywords</p>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-slate-400">
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-sm">Start typing to search</p>
                  </div>
                )}

                {/* Footer */}
                <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30 text-xs text-slate-500 flex items-center justify-between">
                  <div className="flex gap-3">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>Esc Close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
