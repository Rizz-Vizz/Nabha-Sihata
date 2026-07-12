import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, Mic, RefreshCw, Settings, Shield, CheckCircle, X } from 'lucide-react';
import { useSafeSpeech } from './safe-speech-wrapper';

interface MicrophonePermissionFixProps {
  onClose?: () => void;
  onPermissionFixed?: () => void;
}

export function MicrophonePermissionFix({ onClose, onPermissionFixed }: MicrophonePermissionFixProps) {
  const { canUseMicrophone } = useSafeSpeech();
  const [currentStep, setCurrentStep] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'checking' | 'granted' | 'denied'>('unknown');
  const [isTestingPermission, setIsTestingPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [browserInfo, setBrowserInfo] = useState<{
    name: string;
    isSecure: boolean;
    hasMediaDevices: boolean;
    hasSpeechRecognition: boolean;
  } | null>(null);

  useEffect(() => {
    
    const userAgent = navigator.userAgent;
    const browserName = userAgent.includes('Chrome') ? 'Chrome' :
                       userAgent.includes('Firefox') ? 'Firefox' :
                       userAgent.includes('Safari') ? 'Safari' :
                       userAgent.includes('Edge') ? 'Edge' : 'Unknown';

    setBrowserInfo({
      name: browserName,
      isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      hasMediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasSpeechRecognition: !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
    });

    
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    if (!browserInfo?.hasMediaDevices) return;

    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(permission.state as any);
        
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state as any);
        });
      }
    } catch (e) {
      console.log('Permission query not available:', e);
      setPermissionStatus('unknown');
    }
  };

  const fixSteps = [
    {
      title: "Reset Browser Permissions",
      description: "Clear any cached permission denials",
      action: "reset"
    },
    {
      title: "Check Microphone Access",
      description: "Verify your microphone is working",
      action: "test"
    },
    {
      title: "Grant Fresh Permission", 
      description: "Request microphone access again",
      action: "grant"
    },
    {
      title: "Verify Everything Works",
      description: "Test speech recognition functionality",
      action: "verify"
    }
  ];

  const resetPermissions = async () => {
    try {
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      
      localStorage.removeItem('microphonePermission');
      localStorage.removeItem('speechRecognitionPermission');
      
      
      sessionStorage.removeItem('microphonePermission');
      sessionStorage.removeItem('speechRecognitionPermission');
      
      setPermissionStatus('granted');
      setCurrentStep(1);
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        
        setError('Permission is currently denied. Please follow the manual reset instructions.');
        setPermissionStatus('denied');
      } else {
        setError(`Reset failed: ${error.message}`);
      }
    }
  };

  const testMicrophone = async () => {
    setIsTestingPermission(true);
    setError(null);

    try {
      if (!canUseMicrophone) {
        throw new Error('User interaction required first');
      }

      console.log('🎤 Testing microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let hasAudio = false;

      
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        if (average > 0) {
          hasAudio = true;
        }
      };

      const audioCheckInterval = setInterval(checkAudio, 100);

      setTimeout(() => {
        clearInterval(audioCheckInterval);
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();

        if (hasAudio) {
          console.log('✅ Microphone test successful');
          setPermissionStatus('granted');
          setCurrentStep(2);
        } else {
          console.log('⚠️ Microphone accessible but no audio detected');
          setError('Microphone is accessible but no audio detected. Please check if your microphone is muted or being used by another application.');
        }

        setIsTestingPermission(false);
      }, 3000);

    } catch (error: any) {
      console.error('🎤 Microphone test failed:', error);
      setIsTestingPermission(false);
      
      if (error.name === 'NotAllowedError') {
        setError('Microphone access denied. Please manually reset permissions using the instructions below.');
        setPermissionStatus('denied');
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError') {
        setError('Microphone is being used by another application. Please close other apps using the microphone.');
      } else {
        setError(`Microphone test failed: ${error.message}`);
      }
    }
  };

  const grantPermission = async () => {
    setIsTestingPermission(true);
    setError(null);

    try {
      if (!canUseMicrophone) {
        throw new Error('Please click a button first to enable user interaction');
      }

      console.log('🎤 Requesting fresh microphone permission...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      console.log('✅ Fresh permission granted');
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      setCurrentStep(3);
      
    } catch (error: any) {
      console.error('🎤 Permission grant failed:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('Permission denied. Please manually reset using browser settings.');
        setPermissionStatus('denied');
      } else {
        setError(`Permission request failed: ${error.message}`);
      }
    } finally {
      setIsTestingPermission(false);
    }
  };

  const verifySpeechRecognition = async () => {
    setIsTestingPermission(true);
    setError(null);

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech Recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      await new Promise((resolve, reject) => {
        recognition.onstart = () => {
          console.log('✅ Speech recognition started successfully');
          setTimeout(() => {
            recognition.stop();
          }, 1000);
        };

        recognition.onend = () => {
          console.log('✅ Speech recognition ended successfully');
          resolve(true);
        };

        recognition.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            reject(new Error('Speech recognition permission denied'));
          } else {
            reject(new Error(`Speech recognition error: ${event.error}`));
          }
        };

        recognition.start();
      });

      console.log('🎉 All microphone features working!');
      onPermissionFixed?.();
      
    } catch (error: any) {
      console.error('🎤 Speech recognition test failed:', error);
      setError(`Speech recognition test failed: ${error.message}`);
    } finally {
      setIsTestingPermission(false);
    }
  };

  const executeStep = async () => {
    const step = fixSteps[currentStep];
    
    switch (step.action) {
      case 'reset':
        await resetPermissions();
        break;
      case 'test':
        await testMicrophone();
        break;
      case 'grant':
        await grantPermission();
        break;
      case 'verify':
        await verifySpeechRecognition();
        break;
    }
  };

  const getBrowserSpecificInstructions = () => {
    if (!browserInfo) return null;

    const instructions = {
      Chrome: [
        "1. Click the 🎤 icon in the address bar (next to the URL)",
        "2. Select 'Always allow microphone' from the dropdown",
        "3. Click 'Done' to save the setting",
        "4. Refresh this page (F5 or Ctrl+R)"
      ],
      Firefox: [
        "1. Click the 🎤 icon in the address bar",
        "2. Select 'Allow' from the permission popup",
        "3. Check 'Remember this decision' if available",
        "4. Refresh this page (F5 or Ctrl+R)"
      ],
      Safari: [
        "1. Go to Safari → Preferences → Websites",
        "2. Click 'Microphone' in the left sidebar",
        "3. Find this website and set it to 'Allow'",
        "4. Refresh this page (Cmd+R)"
      ],
      Edge: [
        "1. Click the 🎤 icon in the address bar",
        "2. Select 'Always allow on this site'",
        "3. Click outside the popup to close it",
        "4. Refresh this page (F5 or Ctrl+R)"
      ]
    };

    return instructions[browserInfo.name as keyof typeof instructions] || instructions.Chrome;
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">🔧 Fix Microphone Permission</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {}
      {browserInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-2">System Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Browser:</span>
              <span className="ml-2 font-medium">{browserInfo.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Security:</span>
              <span className={`ml-2 font-medium ${browserInfo.isSecure ? 'text-green-600' : 'text-red-600'}`}>
                {browserInfo.isSecure ? '🔒 HTTPS' : '⚠️ HTTP'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Media API:</span>
              <span className={`ml-2 font-medium ${browserInfo.hasMediaDevices ? 'text-green-600' : 'text-red-600'}`}>
                {browserInfo.hasMediaDevices ? '✅ Available' : '❌ Missing'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Speech API:</span>
              <span className={`ml-2 font-medium ${browserInfo.hasSpeechRecognition ? 'text-green-600' : 'text-red-600'}`}>
                {browserInfo.hasSpeechRecognition ? '✅ Available' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Current Permission Status</span>
          </div>
          <div className={`flex items-center space-x-2 ${
            permissionStatus === 'granted' ? 'text-green-600' :
            permissionStatus === 'denied' ? 'text-red-600' :
            permissionStatus === 'checking' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            {permissionStatus === 'granted' ? <CheckCircle className="w-4 h-4" /> :
             permissionStatus === 'denied' ? <AlertCircle className="w-4 h-4" /> :
             permissionStatus === 'checking' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
             <AlertCircle className="w-4 h-4" />}
            <span className="font-medium capitalize">{permissionStatus}</span>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Automated Fix Steps</h4>
        {fixSteps.map((step, index) => (
          <div key={index} className={`border rounded-lg p-4 ${
            index === currentStep ? 'border-blue-300 bg-blue-50' :
            index < currentStep ? 'border-green-300 bg-green-50' :
            'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentStep ? 'bg-blue-500 text-white' :
                  index < currentStep ? 'bg-green-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div>
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-gray-600">{step.description}</div>
                </div>
              </div>
              
              {index === currentStep && (
                <Button
                  onClick={executeStep}
                  disabled={isTestingPermission || !canUseMicrophone}
                  className="ml-4"
                >
                  {isTestingPermission ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Working...
                    </>
                  ) : (
                    'Start'
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="font-medium text-red-800">Error</span>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {}
      {permissionStatus === 'denied' && browserInfo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-yellow-800 mb-3">
            📋 Manual Fix for {browserInfo.name}
          </h4>
          <div className="text-sm text-yellow-700 space-y-1">
            {getBrowserSpecificInstructions()?.map((instruction, index) => (
              <div key={index}>{instruction}</div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-yellow-300">
            <p className="text-xs text-yellow-600 mb-2">
              <strong>Alternative method:</strong>
            </p>
            <div className="text-xs text-yellow-600 space-y-1">
              <div>• Right-click on this page → "Site settings"</div>
              <div>• Find "Microphone" and set to "Allow"</div>
              <div>• Refresh the page</div>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="flex space-x-3">
        <Button
          onClick={checkPermissionStatus}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Recheck Status</span>
        </Button>
        
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Page</span>
        </Button>

        {currentStep >= fixSteps.length - 1 && permissionStatus === 'granted' && (
          <Button
            onClick={() => {
              onPermissionFixed?.();
              onClose?.();
            }}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Done</span>
          </Button>
        )}
      </div>

      {}
      <div className="mt-6 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="font-medium mb-1">💡 Common solutions:</div>
        <div className="space-y-1">
          <div>• Make sure no other apps are using your microphone</div>
          <div>• Try closing and reopening your browser</div>
          <div>• Check if your microphone is muted in system settings</div>
          <div>• Ensure this site is using HTTPS (secure connection)</div>
        </div>
      </div>
    </Card>
  );
}