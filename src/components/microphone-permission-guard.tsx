import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, Mic, Shield, CheckCircle } from 'lucide-react';
import { useSafeSpeech } from './safe-speech-wrapper';

interface MicrophonePermissionGuardProps {
  children: React.ReactNode;
  requiresPermission?: boolean;
  onPermissionGranted?: () => void;
  onPermissionDenied?: (error: string) => void;
}

export function MicrophonePermissionGuard({ 
  children, 
  requiresPermission = false,
  onPermissionGranted,
  onPermissionDenied
}: MicrophonePermissionGuardProps) {
  const { canUseMicrophone, isUserInteracted } = useSafeSpeech();
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'checking'>('unknown');
  const [error, setError] = useState<string | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  
  useEffect(() => {
    if (!requiresPermission || !canUseMicrophone) return;

    const checkPermissionStatus = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionStatus(permission.state as any);
          
          if (permission.state === 'granted') {
            onPermissionGranted?.();
          } else if (permission.state === 'denied') {
            const errorMsg = 'Microphone access was previously denied. Please reset permissions for this site.';
            setError(errorMsg);
            onPermissionDenied?.(errorMsg);
          }

          
          permission.addEventListener('change', () => {
            const newState = permission.state as any;
            setPermissionStatus(newState);
            
            if (newState === 'granted') {
              setError(null);
              onPermissionGranted?.();
            } else if (newState === 'denied') {
              const errorMsg = 'Microphone access denied.';
              setError(errorMsg);
              onPermissionDenied?.(errorMsg);
            }
          });
        }
      } catch (e) {
        console.log('Permission query not available:', e);
        setPermissionStatus('unknown');
      }
    };

    
    const timeoutId = setTimeout(checkPermissionStatus, 1000);
    return () => clearTimeout(timeoutId);
  }, [requiresPermission, canUseMicrophone, onPermissionGranted, onPermissionDenied]);

  const requestPermission = async () => {
    if (!canUseMicrophone) {
      const errorMsg = 'Please click a button first to enable microphone access.';
      setError(errorMsg);
      onPermissionDenied?.(errorMsg);
      return;
    }

    setIsCheckingPermission(true);
    setError(null);
    setPermissionStatus('checking');

    try {
      
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('Microphone requires HTTPS. Please use a secure connection.');
      }

      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone not supported in this browser. Please use Chrome, Edge, or Safari.');
      }

      console.log('🎤 Requesting microphone permission...');
      
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      console.log('🎤 Microphone permission granted');
      
      
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      setError(null);
      onPermissionGranted?.();

    } catch (err: any) {
      console.error('🎤 Permission request failed:', err);
      
      let errorMessage = 'Microphone access failed.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Microphone access denied. Please click "Allow" when your browser asks for permission. If you denied it previously, click the microphone icon in your browser address bar and select "Always allow" for this site.';
        setPermissionStatus('denied');
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
        setPermissionStatus('denied');
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application. Please close other apps using the microphone.';
        setPermissionStatus('denied');
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Microphone access blocked by browser security settings.';
        setPermissionStatus('denied');
      } else if (err.message.includes('HTTPS')) {
        errorMessage = err.message;
        setPermissionStatus('denied');
      } else {
        errorMessage = `Microphone access failed: ${err.message}`;
        setPermissionStatus('denied');
      }
      
      setError(errorMessage);
      onPermissionDenied?.(errorMessage);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  
  if (!requiresPermission) {
    return <>{children}</>;
  }

  
  if (!isUserInteracted) {
    return (
      <Card className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="font-medium text-gray-800 mb-2">User Interaction Required</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please click a button to enable microphone features. This is required for security.
        </p>
        <div className="text-xs text-gray-500">
          This ensures your microphone is only accessed when you explicitly allow it.
        </div>
      </Card>
    );
  }

  
  if (permissionStatus === 'granted') {
    return <>{children}</>;
  }

  
  if (permissionStatus === 'denied') {
    return (
      <Card className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-medium text-red-800 mb-2">Microphone Access Denied</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="space-y-3">
          <Button
            onClick={requestPermission}
            disabled={isCheckingPermission}
            className="w-full"
          >
            {isCheckingPermission ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Requesting Permission...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
            <div className="font-medium mb-2">💡 How to fix microphone access:</div>
            <div className="space-y-1 text-left">
              <div>1. Look for a microphone icon 🎤 in your browser address bar</div>
              <div>2. Click it and select "Always allow on this site"</div>
              <div>3. Refresh the page if needed</div>
              <div>4. Try the button above again</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  
  return (
    <Card className="p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
        <Mic className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-medium text-gray-800 mb-2">
        {permissionStatus === 'checking' ? 'Requesting Microphone Access' : 'Microphone Permission Required'}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {permissionStatus === 'checking' 
          ? 'Please respond to your browser\'s permission request...'
          : 'This feature requires microphone access to work properly.'
        }
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={requestPermission}
          disabled={isCheckingPermission || !canUseMicrophone}
          className="w-full"
        >
          {isCheckingPermission ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Requesting Access...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Request Microphone Access
            </>
          )}
        </Button>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
          <div className="font-medium mb-2">🔒 Privacy & Security:</div>
          <div className="space-y-1 text-left">
            <div>• Your browser will ask for permission first</div>
            <div>• You can revoke access anytime in browser settings</div>
            <div>• Audio is only processed locally for speech recognition</div>
            <div>• No recordings are stored or transmitted</div>
          </div>
        </div>
      </div>
    </Card>
  );
}


export function useMicrophonePermission() {
  const { canUseMicrophone } = useSafeSpeech();
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  useEffect(() => {
    if (!canUseMicrophone) return;

    const checkPermission = async () => {
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionStatus(permission.state as any);
          
          permission.addEventListener('change', () => {
            setPermissionStatus(permission.state as any);
          });
        } catch (e) {
          setPermissionStatus('unknown');
        }
      }
    };

    checkPermission();
  }, [canUseMicrophone]);

  const requestPermission = async (): Promise<boolean> => {
    if (!canUseMicrophone) {
      throw new Error('User interaction required first');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      return true;
    } catch (error) {
      setPermissionStatus('denied');
      throw error;
    }
  };

  return {
    permissionStatus,
    canRequestPermission: canUseMicrophone,
    requestPermission
  };
}