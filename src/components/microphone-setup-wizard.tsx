import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Mic, 
  MicOff, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Globe, 
  Wifi,
  Volume2,
  Settings,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useSpeechRecognition } from './speech-recognition-context';
import { useLanguage } from './language-context';

interface MicrophoneSetupWizardProps {
  onComplete?: () => void;
  onClose?: () => void;
  autoStart?: boolean;
}

type SetupStep = 'check' | 'permission' | 'test' | 'complete';

export function MicrophoneSetupWizard({ 
  onComplete, 
  onClose,
  autoStart = false 
}: MicrophoneSetupWizardProps) {
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

  const [currentStep, setCurrentStep] = useState<SetupStep>('check');
  const [systemCheck, setSystemCheck] = useState<{
    browserSupport: boolean;
    httpsConnection: boolean;
    microphoneAPI: boolean;
    speechRecognition: boolean;
    userAgent: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTestedVoice, setHasTestedVoice] = useState(false);

  
  useEffect(() => {
    runSystemCheck();
  }, []);

  
  useEffect(() => {
    if (autoStart && systemCheck && permissionStatus === 'granted') {
      setCurrentStep('test');
    }
  }, [autoStart, systemCheck, permissionStatus]);

  const runSystemCheck = () => {
    const check = {
      browserSupport: !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition,
      httpsConnection: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      microphoneAPI: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      speechRecognition: !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition,
      userAgent: navigator.userAgent
    };
    setSystemCheck(check);
    
    
    if (!check.browserSupport || !check.httpsConnection || !check.microphoneAPI) {
      
      return;
    }
    
    
    if (permissionStatus === 'unknown' || permissionStatus === 'prompt') {
      setCurrentStep('permission');
    } else if (permissionStatus === 'granted') {
      setCurrentStep('test');
    } else if (permissionStatus === 'denied') {
      setCurrentStep('permission');
    }
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await requestMicrophonePermission();
      if (granted) {
        setCurrentStep('test');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTest = async () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setHasTestedVoice(true);
        setCurrentStep('complete');
      }
    } else {
      try {
        await startListening();
      } catch (error) {
        console.error('Voice test failed:', error);
      }
    }
  };

  const handleComplete = () => {
    onComplete?.();
    onClose?.();
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getStepStatus = (step: SetupStep) => {
    if (currentStep === step) return 'current';
    
    switch (step) {
      case 'check':
        return systemCheck && 
               systemCheck.browserSupport && 
               systemCheck.httpsConnection && 
               systemCheck.microphoneAPI ? 'complete' : 'pending';
      case 'permission':
        return permissionStatus === 'granted' ? 'complete' : 'pending';
      case 'test':
        return hasTestedVoice ? 'complete' : 'pending';
      case 'complete':
        return hasTestedVoice && permissionStatus === 'granted' ? 'complete' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      {}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mic className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t('microphoneSetup') || 'Microphone Setup'}
            </h2>
            <p className="text-sm text-gray-600">
              {t('setupMicrophoneForVoice') || 'Setup microphone for voice features'}
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      {}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(['check', 'permission', 'test', 'complete'] as SetupStep[]).map((step, index) => {
            const status = getStepStatus(step);
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    status === 'complete' 
                      ? 'bg-green-500 border-green-500 text-white'
                      : status === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}>
                    {status === 'complete' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center">
                    {step === 'check' && 'System Check'}
                    {step === 'permission' && 'Permission'}
                    {step === 'test' && 'Voice Test'}
                    {step === 'complete' && 'Complete'}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    getStepStatus(['check', 'permission', 'test', 'complete'][index + 1]) === 'complete'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {}
      <div className="space-y-6">
        {}
        {currentStep === 'check' && systemCheck && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">System Requirements</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Browser Support</span>
                <div className="flex items-center space-x-2">
                  {systemCheck.speechRecognition ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{getBrowserName(systemCheck.userAgent)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Secure Connection</span>
                <div className="flex items-center space-x-2">
                  {systemCheck.httpsConnection ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{systemCheck.httpsConnection ? 'HTTPS' : 'HTTP'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Microphone API</span>
                <div className="flex items-center space-x-2">
                  {systemCheck.microphoneAPI ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{systemCheck.microphoneAPI ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
            </div>

            {}
            {(!systemCheck.browserSupport || !systemCheck.httpsConnection || !systemCheck.microphoneAPI) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Setup Issues Detected</span>
                </div>
                <div className="text-sm text-red-700 space-y-1">
                  {!systemCheck.browserSupport && (
                    <p>• Speech recognition not supported. Please use Chrome, Edge, or Safari.</p>
                  )}
                  {!systemCheck.httpsConnection && (
                    <p>• Secure HTTPS connection required for microphone access.</p>
                  )}
                  {!systemCheck.microphoneAPI && (
                    <p>• Microphone API not available in this browser.</p>
                  )}
                </div>
              </div>
            )}

            {}
            <div className="flex space-x-3">
              <Button onClick={runSystemCheck} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-check System
              </Button>
              
              {systemCheck.browserSupport && systemCheck.httpsConnection && systemCheck.microphoneAPI && (
                <Button onClick={() => setCurrentStep('permission')}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Permission
                </Button>
              )}
            </div>
          </div>
        )}

        {}
        {currentStep === 'permission' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Microphone Permission</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Permission Required</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                To use voice features, we need access to your microphone. Your browser will ask for permission.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• Click "Allow" when prompted</div>
                <div>• Your voice data stays on your device</div>
                <div>• You can revoke permission anytime</div>
              </div>
            </div>

            {permissionStatus === 'denied' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MicOff className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Permission Denied</span>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  Microphone access was denied. Please follow these steps to fix it:
                </p>
                <div className="text-xs text-red-600 space-y-1">
                  <div>1. Look for a microphone icon 🎤 in your browser address bar</div>
                  <div>2. Click it and select "Always allow" for this site</div>
                  <div>3. Refresh the page if needed</div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button onClick={() => setCurrentStep('check')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={handleRequestPermission} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Requesting...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Request Permission
                  </>
                )}
              </Button>

              {permissionStatus === 'granted' && (
                <Button onClick={() => setCurrentStep('test')}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Test
                </Button>
              )}
            </div>
          </div>
        )}

        {}
        {currentStep === 'test' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Voice Test</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Volume2 className="w-4 h-4 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Test Your Voice</span>
              </div>
              <p className="text-sm text-green-700">
                Click the button below and say something to test if your microphone is working properly.
              </p>
            </div>

            {}
            <div className="text-center space-y-4">
              <Button
                onClick={handleVoiceTest}
                size="lg"
                className={`px-8 py-6 text-lg ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-3" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-3" />
                    Start Voice Test
                  </>
                )}
              </Button>

              {isListening && (
                <div className="text-sm text-gray-600">
                  🎤 Listening... Say something clearly
                </div>
              )}
            </div>

            {}
            {(transcript || isListening) && (
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">What you said:</span>
                  {transcript && (
                    <Button variant="ghost" size="sm" onClick={resetTranscript}>
                      Clear
                    </Button>
                  )}
                </div>
                <div className="min-h-[40px] p-3 bg-gray-50 rounded border">
                  {transcript ? (
                    <div className="space-y-2">
                      <p className="text-gray-800">"{transcript}"</p>
                      {confidence > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{Math.round(confidence * 100)}%</span>
                        </div>
                      )}
                    </div>
                  ) : isListening ? (
                    <p className="text-gray-500 italic">Waiting for speech...</p>
                  ) : (
                    <p className="text-gray-400 italic">Click "Start Voice Test" and speak</p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button onClick={() => setCurrentStep('permission')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {transcript && (
                <Button onClick={() => setCurrentStep('complete')}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        )}

        {}
        {currentStep === 'complete' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-medium text-gray-800">Setup Complete!</h3>
            <p className="text-gray-600">
              Your microphone is working correctly and ready for voice features.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-700 space-y-1">
                <div>✅ Browser supports speech recognition</div>
                <div>✅ Microphone permission granted</div>
                <div>✅ Voice test successful</div>
              </div>
            </div>

            <Button onClick={handleComplete} size="lg" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Start Using Voice Features
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}