'use client';

import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Command } from 'lucide-react';

export function KeyboardHints() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <div className="fixed bottom-20 left-8 z-30 hidden lg:flex flex-col gap-2 text-xs text-muted-foreground">
      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
        <Command className="h-3 w-3 mr-1" />
        {isMac ? '⌘' : 'Ctrl'}+K: Search
      </Badge>
      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
        ↑: Back to top
      </Badge>
    </div>
  );
}
