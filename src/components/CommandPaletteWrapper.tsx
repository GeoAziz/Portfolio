/**
 * Command Palette Client Wrapper
 * 
 * Wraps the CommandPalette component with the useSearchItems hook
 */

'use client';

import { CommandPalette } from '@/components/CommandPalette';
import { useSearchItems } from '@/hooks/use-search-items';

export function CommandPaletteWrapper() {
  const items = useSearchItems();
  return <CommandPalette items={items} />;
}
