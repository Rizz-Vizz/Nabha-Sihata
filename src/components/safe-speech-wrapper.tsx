import React, { createContext, useContext, useState } from 'react';

interface SafeSpeechContextType {
  isUserInteracted: boolean;
  setUserInteracted: (value: boolean) => void;
  canUseMicrophone: boolean;
}

const SafeSpeechContext = createContext<SafeSpeechContextType | null>(null);

export function SafeSpeechProvider({ children }: { children: React.ReactNode }) {
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  
  
  const canUseMicrophone = React.useMemo(() => {
    try {
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasSpeechRecognition = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
      
      return isUserInteracted && isSecure && hasMediaDevices && hasSpeechRecognition;
    } catch (error) {
      console.warn('Error checking microphone capabilities:', error);
      return false;
    }
  }, [isUserInteracted]);

  
  React.useEffect(() => {
    const handleUserInteraction = () => {
      try {
        if (!isUserInteracted) {
          console.log('🎤 User interaction detected - microphone access now allowed');
          setIsUserInteracted(true);
        }
      } catch (error) {
        console.warn('Error handling user interaction:', error);
      }
    };

    try {
      
      document.addEventListener('click', handleUserInteraction, { once: false });
      document.addEventListener('touchstart', handleUserInteraction, { once: false });
      document.addEventListener('keydown', handleUserInteraction, { once: false });

      return () => {
        try {
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
          document.removeEventListener('keydown', handleUserInteraction);
        } catch (error) {
          console.warn('Error removing event listeners:', error);
        }
      };
    } catch (error) {
      console.warn('Error setting up event listeners:', error);
      return () => {}; 
    }
  }, [isUserInteracted]);

  const value: SafeSpeechContextType = {
    isUserInteracted,
    setUserInteracted: setIsUserInteracted,
    canUseMicrophone
  };

  return (
    <SafeSpeechContext.Provider value={value}>
      {children}
    </SafeSpeechContext.Provider>
  );
}

export function useSafeSpeech() {
  const context = useContext(SafeSpeechContext);
  if (!context) {
    throw new Error('useSafeSpeech must be used within a SafeSpeechProvider');
  }
  return context;
}