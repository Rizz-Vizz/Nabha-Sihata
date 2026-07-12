import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  pendingSync: any[];
  addPendingSync: (data: any) => void;
  clearPendingSync: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      if (pendingSync.length > 0) {
        console.log('Syncing pending data...', pendingSync);
        
        setTimeout(() => {
          setPendingSync([]);
        }, 2000);
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSync]);

  const addPendingSync = (data: any) => {
    if (!isOnline) {
      setPendingSync(prev => [...prev, { ...data, timestamp: Date.now() }]);
    }
  };

  const clearPendingSync = () => {
    setPendingSync([]);
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      pendingSync,
      addPendingSync,
      clearPendingSync
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}