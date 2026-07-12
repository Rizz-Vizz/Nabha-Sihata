import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useSpeechRecognition } from './speech-recognition-context';
import { useLanguage } from './language-context';

interface VoiceIndicatorProps {
  compact?: boolean;
  showTranscript?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  className?: string;
}

export function VoiceIndicator({ 
  compact = false, 
  showTranscript = false,
  onStartListening,
  onStopListening,
  className = ''
}: VoiceIndicatorProps) {
  const { t } = useLanguage();
  const {
    isSupported,
    isListening,
    transcript,
    confidence,
    error,
    permissionStatus,
    startListening,
    stopListening,
    resetTranscript,
    requestMicrophonePermission
  } = useSpeechRecognition();

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
      onStopListening?.();
    } else {
      // Only start listening if we have permission
      if (permissionStatus === 'granted') {
        try {
          await startListening();
          onStartListening?.();
        } catch (err: any) {
          console.warn('Failed to start listening:', err);
        }
      } else {
        
        try {
          const granted = await requestMicrophonePermission();
          if (granted) {
            await startListening();
            onStartListening?.();
          }
        } catch (err: any) {
          console.warn('Failed to request permission or start listening:', err);
        }
      }
    }
  };

  
  if (compact) {
    const needsPermission = isSupported && permissionStatus !== 'granted';
    
    const handleSafeClick = async () => {
      
      if (permissionStatus === 'granted') {
        await handleToggleListening();
      } else if (permissionStatus === 'denied') {
        
        alert('Microphone access was denied. Please click the microphone icon in your browser address bar and allow access for this site, then refresh the page.');
      } else {
        
        try {
          const granted = await requestMicrophonePermission();
          if (granted) {
            
            await handleToggleListening();
          }
        } catch (err) {
          console.warn('Permission request failed:', err);
        }
      }
    };
    
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSafeClick}
          disabled={!isSupported}
          className={`flex items-center space-x-1 ${
            isListening 
              ? 'text-green-600 bg-green-50 hover:bg-green-100' 
              : permissionStatus === 'denied'
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : permissionStatus === 'granted'
              ? 'text-green-600 bg-green-50 hover:bg-green-100'
              : needsPermission
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : error 
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {!isSupported ? (
            <AlertCircle className="w-4 h-4" />
          ) : permissionStatus === 'denied' ? (
            <MicOff className="w-4 h-4" />
          ) : isListening ? (
            <Mic className="w-4 h-4 animate-pulse" />
          ) : permissionStatus === 'granted' ? (
            <Mic className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          
          <span className="text-xs">
            {!isSupported 
              ? 'No Voice'
              : permissionStatus === 'denied'
              ? 'Mic Denied' 
              : permissionStatus === 'granted'
              ? (isListening ? 'Listening...' : 'Voice Ready')
              : 'Setup Voice'
            }
          </span>
        </Button>
        
        {(error && permissionStatus !== 'denied') && (
          <div className="text-xs text-red-600 max-w-xs truncate" title={error}>
            {error}
          </div>
        )}
        
        {permissionStatus === 'denied' && (
          <div className="text-xs text-red-600 max-w-xs truncate" title="Click the microphone button for help">
            Check browser settings
          </div>
        )}
      </div>
    );
  }

  
  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-800">
              {t('voiceControl') || 'Voice Control'}
            </h3>
          </div>
          
          {}
          <div className={`w-3 h-3 rounded-full ${
            !isSupported 
              ? 'bg-gray-400'
              : isListening 
              ? 'bg-green-400 animate-pulse'
              : 'bg-yellow-400'
          }`} />
        </div>

        {}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {}
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleToggleListening}
            disabled={!isSupported}
            className={`flex items-center space-x-2 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>{t('stopListening') || 'Stop Listening'}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{t('startListening') || 'Start Listening'}</span>
              </>
            )}
          </Button>
        </div>

        {}
        <div className="text-sm text-gray-600">
          {!isSupported && (
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{t('speechNotSupported') || 'Speech recognition not supported in this browser'}</span>
            </div>
          )}
          
          {isSupported && !isListening && !error && (
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-green-500" />
              <span>{t('readyToListen') || 'Ready to listen. Click to start voice commands.'}</span>
            </div>
          )}
          
          {isListening && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              <span>{t('listening') || 'Listening... Speak now.'}</span>
            </div>
          )}
        </div>

        {}
        {showTranscript && (transcript || isListening) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                {t('transcript') || 'Transcript'}
              </h4>
              {transcript && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetTranscript}
                  className="text-xs"
                >
                  {t('clear') || 'Clear'}
                </Button>
              )}
            </div>
            
            <div className="bg-gray-50 border rounded-lg p-3 min-h-[60px]">
              {transcript ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-800">{transcript}</p>
                  {confidence > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {t('confidence') || 'Confidence'}:
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              ) : isListening ? (
                <p className="text-sm text-gray-500 italic">
                  {t('waitingForSpeech') || 'Waiting for speech...'}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {t('noTranscript') || 'No speech detected yet'}
                </p>
              )}
            </div>
          </div>
        )}

        {}
        {isListening && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              {t('voiceCommands') || 'Voice Commands'}
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• "{t('emergency') || 'emergency'}" - {t('openEmergencyPanel') || 'Open emergency panel'}</p>
              <p>• "{t('checkSymptoms') || 'check symptoms'}" - {t('openSymptomChecker') || 'Open symptom checker'}</p>
              <p>• "{t('callDoctor') || 'call doctor'}" - {t('startTeleconsultation') || 'Start teleconsultation'}</p>
              <p>• "{t('healthCard') || 'health card'}" - {t('openHealthCard') || 'Open health card'}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}


export function VoiceStatus({ className = '' }: { className?: string }) {
  const { isSupported, isListening, error, permissionStatus } = useSpeechRecognition();
  
  // This component is purely visual and never triggers any microphone access
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {!isSupported ? (
        <AlertCircle className="w-4 h-4 text-gray-400" />
      ) : isListening ? (
        <Mic className="w-4 h-4 text-green-500 animate-pulse" />
      ) : permissionStatus === 'denied' ? (
        <MicOff className="w-4 h-4 text-red-500" />
      ) : error ? (
        <AlertCircle className="w-4 h-4 text-red-500" />
      ) : permissionStatus === 'granted' ? (
        <Mic className="w-4 h-4 text-green-500" />
      ) : (
        <Mic className="w-4 h-4 text-gray-400" />
      )}
      
      <span className="text-xs text-gray-600">
        {!isSupported 
          ? 'No Voice'
          : permissionStatus === 'denied'
          ? 'Mic Denied'
          : permissionStatus === 'granted'
          ? (isListening ? 'Listening' : 'Voice Ready')
          : error
          ? 'Voice Error'
          : 'Voice Available'
        }
      </span>
    </div>
  );
}