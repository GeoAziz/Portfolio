'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CopyButton({ text, label, className, variant = 'outline', size = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button 
      onClick={handleCopy} 
      variant={variant} 
      size={size}
      className={cn('transition-all', className)}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          {label || 'Copy'}
        </>
      )}
    </Button>
  );
}
