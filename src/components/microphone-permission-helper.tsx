import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mic, MicOff, AlertCircle, CheckCircle, Shield, Globe, Wifi } from 'lucide-react';

interface MicrophonePermissionHelperProps {
  onPermissionGranted?: () => void;
  onClose?: () => void;
  compact?: boolean;
}

export function MicrophonePermissionHelper({ 
  onPermissionGranted, 
  onClose, 
  compact = false 
}: MicrophonePermissionHelperProps) {
  const [permissionState, setPermissionState] = useState<{
    status: 'unknown' | 'prompt' | 'granted' | 'denied';
    browser: string;
    isHttps: boolean;
    hasMediaDevices: boolean;
    hasSpeechRecognition: boolean;
    error?: string;
  }>({
    status: 'unknown',
    browser: 'Unknown',
    isHttps: false,
    hasMediaDevices: false,
    hasSpeechRecognition: false
  });
  
  const [isRequesting, setIsRequesting] = useState(false);

  
  useEffect(() => {
    const checkCapabilities = async () => {
      const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasSpeechRecognition = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
      
      let browser = 'Unknown';
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';

      let status: 'unknown' | 'prompt' | 'granted' | 'denied' = 'unknown';
      
      
      if (navigator.permissions && isHttps && hasMediaDevices) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          status = permission.state as any;
          console.log('🎤 Current permission status:', status);
        } catch (e) {
          console.log('🎤 Permission API not available for microphone');
        }
      }

      setPermissionState({
        status,
        browser,
        isHttps,
        hasMediaDevices,
        hasSpeechRecognition
      });
    };

    
    const timeoutId = setTimeout(checkCapabilities, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const requestPermission = async () => {
    setIsRequesting(true);
    
    try {
      console.log('🎤 Requesting microphone permission...');
      
      
      if (!permissionState.isHttps) {
        throw new Error('HTTPS connection required for microphone access');
      }
      
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }
      
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, 
          channelCount: 1     
        }
      });
      
      console.log('🎤 Microphone permission granted!');
      
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      
      
      setTimeout(() => {
        source.disconnect();
        audioContext.close();
      }, 100);
      
      
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState(prev => ({ ...prev, status: 'granted', error: undefined }));
      onPermissionGranted?.();
      
    } catch (error: any) {
      console.error('🎤 Microphone permission error:', error);
      
      let errorMessage = 'Microphone access failed';
      let status: 'denied' | 'unknown' = 'denied';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permission denied. Please click "Allow" when your browser asks for microphone access.';
        status = 'denied';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
        status = 'denied';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application. Please close other apps using the microphone.';
        status = 'denied';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Microphone constraints not supported. Trying with basic settings...';
        status = 'unknown';
        
        setTimeout(() => requestPermissionFallback(), 1000);
        return;
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security policy blocks microphone access. Please check your browser settings.';
        status = 'denied';
      } else if (error.message.includes('HTTPS')) {
        errorMessage = 'Microphone requires HTTPS connection. Please use a secure connection.';
        status = 'denied';
      } else if (error.message.includes('getUserMedia not supported')) {
        errorMessage = 'Your browser does not support microphone access. Please use Chrome, Edge, or Safari.';
        status = 'denied';
      }
      
      setPermissionState(prev => ({ 
        ...prev, 
        status,
        error: errorMessage
      }));
    } finally {
      setIsRequesting(false);
    }
  };

  
  const requestPermissionFallback = async () => {
    try {
      console.log('🎤 Retrying with basic audio constraints...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionState(prev => ({ ...prev, status: 'granted', error: undefined }));
      onPermissionGranted?.();
    } catch (error: any) {
      setPermissionState(prev => ({ 
        ...prev, 
        status: 'denied',
        error: 'Microphone access failed even with basic settings. Please check your microphone connection.'
      }));
    }
  };

  const getBrowserInstructions = () => {
    switch (permissionState.browser) {
      case 'Chrome':
      case 'Edge':
        return [
          'Look for the microphone icon 🎤 in your address bar',
          'Click it and select "Always allow" for this site',
          'Refresh the page if needed'
        ];
      case 'Firefox':
        return [
          'Look for the microphone icon in your address bar',
          'Click it and select "Allow" for this site',
          'Refresh the page if needed'
        ];
      case 'Safari':
        return [
          'Go to Safari > Settings for This Website',
          'Set Microphone to "Allow"',
          'Refresh the page'
        ];
      default:
        return [
          'Look for microphone permission settings in your browser',
          'Allow microphone access for this site',
          'Refresh the page'
        ];
    }
  };

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-2">
        <Button
          onClick={requestPermission}
          disabled={isRequesting || !permissionState.hasMediaDevices || !permissionState.isHttps}
          variant="outline"
          size="sm"
          className={`flex items-center space-x-1 ${
            permissionState.status === 'granted' ? 'text-green-600 bg-green-50' :
            permissionState.status === 'denied' ? 'text-red-600 bg-red-50' :
            'text-blue-600 bg-blue-50'
          }`}
        >
          {isRequesting ? (
            <>
              <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Requesting...</span>
            </>
          ) : permissionState.status === 'granted' ? (
            <>
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs">Mic Ready</span>
            </>
          ) : permissionState.status === 'denied' ? (
            <>
              <MicOff className="w-3 h-3" />
              <span className="text-xs">Mic Denied</span>
            </>
          ) : (
            <>
              <Mic className="w-3 h-3" />
              <span className="text-xs">Allow Mic</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">🎤 Microphone Setup</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        )}
      </div>

      {}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm">Browser Support</span>
          <div className="flex items-center space-x-1">
            {permissionState.hasSpeechRecognition ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">{permissionState.browser}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm">Secure Connection</span>
          <div className="flex items-center space-x-1">
            {permissionState.isHttps ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">{permissionState.isHttps ? 'HTTPS' : 'HTTP'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm">Microphone Permission</span>
          <div className="flex items-center space-x-1">
            {permissionState.status === 'granted' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : permissionState.status === 'denied' ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm capitalize">
              {permissionState.status === 'granted' ? 'Allowed' :
               permissionState.status === 'denied' ? 'Denied' :
               permissionState.status === 'prompt' ? 'Not Asked' : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {}
      {permissionState.status !== 'granted' && (
        <div className="mb-6">
          <Button
            onClick={requestPermission}
            disabled={isRequesting || !permissionState.hasMediaDevices || !permissionState.isHttps}
            className="w-full"
          >
            {isRequesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Requesting Permission...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Request Microphone Access
              </>
            )}
          </Button>
        </div>
      )}

      {}
      {permissionState.status === 'denied' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-medium text-red-800">Permission Denied</span>
          </div>
          {permissionState.error && (
            <p className="text-sm text-red-700 mb-3">{permissionState.error}</p>
          )}
          <div className="text-sm text-red-700">
            <p className="font-medium mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              {getBrowserInstructions().map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          <div className="mt-3 pt-3 border-t border-red-200">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="w-full text-red-700 border-red-300 hover:bg-red-100"
            >
              🔄 Refresh Page & Try Again
            </Button>
          </div>
        </div>
      )}

      {permissionState.status === 'granted' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Microphone Ready!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            You can now use voice features in the app.
          </p>
        </div>
      )}

      {}
      {(!permissionState.isHttps || !permissionState.hasMediaDevices || !permissionState.hasSpeechRecognition) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="font-medium text-yellow-800">Setup Issues</span>
          </div>
          
          {!permissionState.isHttps && (
            <p className="text-sm text-yellow-700 mb-2">
              • Microphone requires HTTPS connection
            </p>
          )}
          
          {!permissionState.hasMediaDevices && (
            <p className="text-sm text-yellow-700 mb-2">
              • Browser doesn't support microphone access
            </p>
          )}
          
          {!permissionState.hasSpeechRecognition && (
            <p className="text-sm text-yellow-700 mb-2">
              • Speech recognition not supported in {permissionState.browser}
            </p>
          )}
          
          <p className="text-xs text-yellow-600 mt-2">
            Try using Chrome or Edge for the best experience.
          </p>
        </div>
      )}
    </Card>
  );
}