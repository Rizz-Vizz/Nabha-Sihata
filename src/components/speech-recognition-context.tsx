import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useLanguage } from './language-context';
import { useSafeSpeech } from './safe-speech-wrapper';


interface SpeechRecognitionContextType {
  
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
  
  
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  requestMicrophonePermission: () => Promise<boolean>;
}


const speechLanguages = {
  en: 'en-US',
  hi: 'hi-IN',
  pa: 'pa-IN' 
};


const SpeechRecognitionContext = createContext<SpeechRecognitionContextType | null>(null);


const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export function SpeechRecognitionProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const { canUseMicrophone, isUserInteracted } = useSafeSpeech();
  
  
  const [isSupported] = useState(() => {
    try {
      const hasRecognition = getSpeechRecognition() !== null;
      console.log('🎤 Speech recognition supported:', hasRecognition);
      return hasRecognition;
    } catch {
      console.log('🎤 Speech recognition not supported');
      return false;
    }
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  
  
  React.useEffect(() => {
    const checkInitialPermission = async () => {
      if (!isSupported || !canUseMicrophone) {
        console.log('🎤 Skipping permission check - not supported or no user interaction');
        setPermissionStatus('unknown');
        return;
      }
      
      
      if (navigator.permissions) {
        try {
          console.log('🎤 Safely checking permission status...');
          
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          const currentState = permission.state as any;
          setPermissionStatus(currentState);
          console.log('🎤 Initial permission status (after user interaction):', currentState);
          
          
          permission.addEventListener('change', () => {
            const newState = permission.state as any;
            setPermissionStatus(newState);
            console.log('🎤 Permission status changed:', newState);
            
            
            if (newState === 'granted') {
              setError(null);
            }
          });
        } catch (e) {
          console.log('🎤 Permission query failed (this is normal):', e);
          
          setPermissionStatus('unknown');
        }
      } else {
        console.log('🎤 Permissions API not available');
        setPermissionStatus('unknown');
      }
    };
    
    
    if (isSupported && canUseMicrophone) {
      const timeoutId = setTimeout(checkInitialPermission, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isSupported, canUseMicrophone]);
  
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    
    
    
    if (!canUseMicrophone) {
      const interactionError = 'Microphone access requires user interaction and secure context. Please click a button first.';
      setError(interactionError);
      console.warn('🎤 Permission request blocked - no user interaction or insecure context');
      throw new Error(interactionError);
    }
    
    try {
      console.log('🎤 Requesting microphone permission (user-initiated, safe context)...');
      setError(null);
      setPermissionStatus('prompt');
      
      
      if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        const httpsError = 'Microphone requires HTTPS connection. Please use a secure URL.';
        setError(httpsError);
        setPermissionStatus('denied');
        throw new Error(httpsError);
      }
      
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const browserError = 'getUserMedia not supported in this browser. Please use Chrome, Edge, or Safari.';
        setError(browserError);
        setPermissionStatus('denied');
        throw new Error(browserError);
      }
      
      
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (permission.state === 'granted') {
            console.log('🎤 Permission already granted');
            setPermissionStatus('granted');
            return true;
          } else if (permission.state === 'denied') {
            const deniedError = 'Microphone access was previously denied. Please check your browser settings and allow microphone access for this site.';
            setError(deniedError);
            setPermissionStatus('denied');
            throw new Error(deniedError);
          }
        } catch (e) {
          console.log('🎤 Permission query failed, proceeding with getUserMedia:', e);
        }
      }
      
      
      console.log('🎤 Requesting getUserMedia with user gesture...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      });
      
      console.log('🎤 Microphone permission granted successfully');
      
      
      if (stream.getAudioTracks().length === 0) {
        stream.getTracks().forEach(track => track.stop());
        const trackError = 'No audio tracks available. Please check your microphone connection.';
        setError(trackError);
        setPermissionStatus('denied');
        throw new Error(trackError);
      }
      
      
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      setError(null);
      return true;
    } catch (err: any) {
      console.error('🎤 Microphone permission error:', err);
      
      let errorMessage = 'Microphone access failed.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Microphone access denied. Please click "Allow" when your browser asks for microphone permission.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application. Please close other apps using the microphone and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Microphone settings not supported. This device may not support the required audio features.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Microphone access blocked by security policy. Please check your browser settings.';
      } else if (err.message.includes('HTTPS')) {
        errorMessage = 'Microphone requires a secure HTTPS connection. Please use a secure URL.';
      } else if (err.message.includes('getUserMedia not supported')) {
        errorMessage = 'Your browser does not support microphone access. Please use Chrome, Edge, or Safari.';
      } else if (err.message.includes('No audio tracks')) {
        errorMessage = 'Microphone permission granted but no audio signal detected. Please check your microphone.';
      }
      
      setError(errorMessage);
      return false;
    }
  }, [canUseMicrophone]);

  
  const initializeRecognition = useCallback(() => {
    if (!isSupported || recognitionRef.current) return recognitionRef.current;

    
    if (!canUseMicrophone) {
      console.log('🎤 Cannot initialize recognition - no user interaction or insecure context');
      setError('Speech recognition requires user interaction and secure connection.');
      return null;
    }

    try {
      console.log('🎤 Initializing speech recognition (no auto-start)...');
      const SpeechRecognition = getSpeechRecognition();
      if (!SpeechRecognition) {
        console.error('🎤 Speech recognition not available');
        setError('Speech recognition not supported. Please use Chrome, Edge, or Safari.');
        return null;
      }

      const recognition = new SpeechRecognition();
      
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLanguages[language as keyof typeof speechLanguages] || 'en-US';
      recognition.maxAlternatives = 1;

      console.log('🎤 Speech recognition configured for language (ready but not started):', recognition.lang);

      
      recognition.onstart = () => {
        console.log('🎤 Speech recognition started successfully');
        setIsListening(true);
        setError(null);
        setPermissionStatus('granted');
      };

      recognition.onresult = (event: any) => {
        console.log('🎤 Speech recognition result:', event);
        let finalTranscript = '';
        let interimTranscript = '';
        let bestConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence || 0.5;

          if (result.isFinal) {
            finalTranscript += transcript;
            bestConfidence = Math.max(bestConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          console.log('🎤 Final transcript:', finalTranscript, 'Confidence:', bestConfidence);
          setTranscript(finalTranscript.trim());
          setConfidence(bestConfidence);
        } else if (interimTranscript) {
          console.log('🎤 Interim transcript:', interimTranscript);
          setTranscript(interimTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('🎤 Speech recognition error:', event.error, event);
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly.';
            
            console.log('🎤 No speech detected - this is normal if user didn\'t speak');
            setIsListening(false);
            return; 
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check your microphone connection and permissions.';
            setPermissionStatus('denied');
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please click "Allow" when your browser asks for microphone permission. If you already denied it, click the microphone icon in your browser address bar and select "Always allow" for this site, then refresh the page.';
            setPermissionStatus('denied');
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service blocked. Please check browser settings.';
            setPermissionStatus('denied');
            break;
          case 'bad-grammar':
            errorMessage = 'Speech recognition configuration error.';
            break;
          case 'language-not-supported':
            errorMessage = 'Selected language not supported for speech recognition.';
            break;
          case 'aborted':
            console.log('🎤 Speech recognition aborted by user');
            setIsListening(false);
            return; 
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }

        console.log('🎤 Setting error:', errorMessage);
        setError(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognition.onnomatch = () => {
        console.log('🎤 No match found');
        setError('No speech match found');
      };

      recognition.onsoundstart = () => {
        console.log('🎤 Sound detected');
      };

      recognition.onsoundend = () => {
        console.log('🎤 Sound ended');
      };

      recognition.onspeechstart = () => {
        console.log('🎤 Speech started');
      };

      recognition.onspeechend = () => {
        console.log('🎤 Speech ended');
      };

      recognitionRef.current = recognition;
      console.log('🎤 Speech recognition initialized successfully');
      return recognition;
    } catch (err) {
      console.error('🎤 Failed to initialize speech recognition:', err);
      setError('Failed to initialize speech recognition');
      return null;
    }
  }, [isSupported, language]);

  
  const startListening = useCallback(async () => {
    if (!isSupported) {
      console.error('🎤 Speech recognition not supported');
      setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!canUseMicrophone) {
      console.error('🎤 Cannot use microphone - no user interaction or insecure context');
      setError('Microphone access requires user interaction and secure connection. Please click a button first.');
      return;
    }

    
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Microphone requires HTTPS connection. Please use a secure URL.');
      return;
    }

    try {
      console.log('🎤 Starting speech recognition...');
      
      
      setError(null);
      
      
      if (isListening) {
        console.log('🎤 Already listening, stopping first...');
        stopListening();
        return;
      }
      
      
      if (!recognitionRef.current) {
        console.log('🎤 No recognition instance, initializing...');
        const recognition = initializeRecognition();
        if (!recognition) {
          setError('Failed to initialize speech recognition. Please try refreshing the page.');
          return;
        }
      }

      
      const currentLang = speechLanguages[language as keyof typeof speechLanguages] || 'en-US';
      if (recognitionRef.current.lang !== currentLang) {
        console.log('🎤 Updating language to:', currentLang);
        recognitionRef.current.lang = currentLang;
      }

      
      setTranscript('');
      setConfidence(0);

      console.log('🎤 Starting recognition (this will request microphone permission if needed)...');
      
      // Start recognition - this will automatically request microphone permission
      // if it hasn't been granted yet, but only if called from a user gesture
      recognitionRef.current.start();

      
      timeoutRef.current = setTimeout(() => {
        console.log('🎤 Speech recognition timeout after 30 seconds');
        stopListening();
        setError('Speech recognition timed out. Please try again.');
      }, 30000); 
      
    } catch (err: any) {
      console.error('🎤 Failed to start speech recognition:', err);
      
      
      if (err.name === 'InvalidStateError') {
        setError('Speech recognition is already active. Please wait a moment and try again.');
        
        try {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        } catch (stopErr) {
          console.warn('🎤 Error stopping recognition:', stopErr);
        }
      } else if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please click "Allow" when prompted, or check your browser settings.');
        setPermissionStatus('denied');
      } else if (err.name === 'ServiceNotAllowedError') {
        setError('Speech recognition blocked by browser settings. Please enable microphone access.');
        setPermissionStatus('denied');
      } else if (err.name === 'NetworkError') {
        setError('Network error during speech recognition. Please check your internet connection.');
      } else if (err.name === 'AbortError') {
        setError('Speech recognition was cancelled. Please try again.');
      } else if (err.message && err.message.includes('already started')) {
        setError('Speech recognition is already running. Please wait and try again.');
      } else {
        setError(`Speech recognition failed: ${err.message || 'Unknown error'}. Please try again.`);
      }
      setIsListening(false);
    }
  }, [isSupported, canUseMicrophone, initializeRecognition, language, isListening]);

  
  const stopListening = useCallback(() => {
    try {
      console.log('🎤 Stopping speech recognition...');
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      console.warn('🎤 Error stopping recognition:', err);
    }
    
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsListening(false);
  }, [isListening]);

  
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  const value: SpeechRecognitionContextType = {
    // State
    isSupported,
    isListening,
    transcript,
    confidence,
    error,
    permissionStatus,
    
    // Controls
    startListening,
    stopListening,
    resetTranscript,
    requestMicrophonePermission
  };

  return (
    <SpeechRecognitionContext.Provider value={value}>
      {children}
    </SpeechRecognitionContext.Provider>
  );
}

// Hook to use speech recognition
export function useSpeechRecognition() {
  const context = useContext(SpeechRecognitionContext);
  if (!context) {
    throw new Error('useSpeechRecognition must be used within a SpeechRecognitionProvider');
  }
  return context;
}


export function useVoiceCommand(commands: { [key: string]: () => void }) {
  const { transcript, confidence, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const [isActive, setIsActive] = useState(false);
  
  const startVoiceCommands = useCallback(async () => {
    try {
      setIsActive(true);
      await startListening();
    } catch (err: any) {
      console.warn('Failed to start voice commands:', err);
      setIsActive(false);
    }
  }, [startListening]);
  
  const stopVoiceCommands = useCallback(() => {
    setIsActive(false);
    stopListening();
    resetTranscript();
  }, [stopListening, resetTranscript]);
  
  return {
    isActive,
    transcript,
    confidence,
    startVoiceCommands,
    stopVoiceCommands
  };
}