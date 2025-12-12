'use client';

import { Moon, Sun, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        disabled
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative">
      {/* Main toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100"
        title="Theme settings"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Theme menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50"
          >
            <div className="p-2 space-y-1">
              {/* Light mode option */}
              <button
                onClick={() => {
                  setTheme('light');
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                  theme === 'light'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
                {theme === 'light' && <span className="ml-auto">✓</span>}
              </button>

              {/* Dark mode option */}
              <button
                onClick={() => {
                  setTheme('dark');
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
                {theme === 'dark' && <span className="ml-auto">✓</span>}
              </button>

              {/* System preference option */}
              <button
                onClick={() => {
                  setTheme('system');
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                  theme === 'system'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="h-4 w-4" />
                System
                {theme === 'system' && <span className="ml-auto">✓</span>}
              </button>

              {/* Divider */}
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

              {/* Info text */}
              <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                Current: <span className="font-medium capitalize">{resolvedTheme}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
