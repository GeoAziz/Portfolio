/**
 * Hook for PWA installation prompt
 * Manages the install prompt event and provides install button
 */

import { useEffect, useState, useCallback } from 'react';
import { InstallPromptEvent } from '@/lib/pwa';

export interface UsePWAInstallPromptReturn {
  isPromptAvailable: boolean;
  isInstalled: boolean;
  prompt: () => Promise<void>;
  dismiss: () => void;
}

export function usePWAInstallPrompt(): UsePWAInstallPromptReturn {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isPromptAvailable, setIsPromptAvailable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = (window.navigator as any).standalone === true;
    const isDisplayMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone || isDisplayMode);

    // Handle install prompt
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setIsPromptAvailable(true);
    };

    const handleAppInstalled = () => {
      setIsPromptAvailable(false);
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const prompt = useCallback(async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const userChoice = await installPrompt.userChoice;

    if (userChoice.outcome === 'accepted') {
      console.log('PWA installed');
    } else {
      console.log('PWA installation dismissed');
    }

    setInstallPrompt(null);
    setIsPromptAvailable(false);
  }, [installPrompt]);

  const dismiss = useCallback(() => {
    setIsPromptAvailable(false);
  }, []);

  return {
    isPromptAvailable,
    isInstalled,
    prompt,
    dismiss,
  };
}
