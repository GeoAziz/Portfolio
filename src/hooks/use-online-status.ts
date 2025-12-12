/**
 * Hook for online/offline status
 * Detects network connectivity and provides real-time updates
 */

import { useEffect, useState } from 'react';

export interface UseOnlineStatusReturn {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    // Handle online event
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
    };

    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
