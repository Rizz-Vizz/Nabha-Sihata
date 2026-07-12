import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useSpeechRecognition } from './speech-recognition-context';
import { MicrophoneTroubleshoot } from './microphone-troubleshoot';
import { MicrophonePermissionHelper } from './microphone-permission-helper';
import { MicrophoneSetupWizard } from './microphone-setup-wizard';
import { MicrophoneGuide } from './microphone-guide';
import { AdvancedMicrophoneDiagnostics } from './advanced-microphone-diagnostics';
import { MicrophonePermissionFix } from './microphone-permission-fix';
import { Mic, MicOff, AlertCircle, Settings, CheckCircle } from 'lucide-react';

export function SimpleVoiceTest() {
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
  
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [showPermissionHelper, setShowPermissionHelper] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAdvancedDiagnostics, setShowAdvancedDiagnostics] = useState(false);
  const [showPermissionFix, setShowPermissionFix] = useState(false);

  const handleToggle = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        console.log('🎤 Voice test starting...');
        await startListening();
      } catch (err) {
        console.error('🎤 Voice test failed:', err);
      }
    }
  };

  const handleRequestPermission = () => {
    setShowPermissionHelper(true);
  };

  if (showPermissionFix) {
    return <MicrophonePermissionFix onClose={() => setShowPermissionFix(false)} onPermissionFixed={() => setShowPermissionFix(false)} />;
  }

  if (showAdvancedDiagnostics) {
    return <AdvancedMicrophoneDiagnostics onClose={() => setShowAdvancedDiagnostics(false)} />;
  }

  if (showTroubleshoot) {
    return <MicrophoneTroubleshoot onClose={() => setShowTroubleshoot(false)} />;
  }

  if (showGuide) {
    return (
      <MicrophoneGuide 
        onClose={() => setShowGuide(false)}
        onTestMicrophone={() => {
          setShowGuide(false);
          setShowSetupWizard(true);
        }}
      />
    );
  }

  if (showSetupWizard) {
    return (
      <MicrophoneSetupWizard 
        onClose={() => setShowSetupWizard(false)}
        onComplete={() => {
          setShowSetupWizard(false);
        }}
      />
    );
  }

  if (showPermissionHelper) {
    return (
      <MicrophonePermissionHelper 
        onClose={() => setShowPermissionHelper(false)}
        onPermissionGranted={() => {
          setShowPermissionHelper(false);
          
          if (requestMicrophonePermission) {
            
          }
        }}
      />
    );
  }

  if (!isSupported) {
    return (
      <Card className="p-4 bg-gray-50">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Speech recognition not supported</span>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => setShowAdvancedDiagnostics(true)}
              variant="outline"
              size="sm"
              className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <Settings className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-blue-700">Advanced Diagnostics</span>
            </Button>
            <Button
              onClick={() => setShowTroubleshoot(true)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Basic Troubleshoot
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Voice Test</h3>
          <div className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-green-500 animate-pulse' : 
            permissionStatus === 'granted' ? 'bg-blue-400' : 'bg-gray-400'
          }`} />
        </div>

        {}
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Browser Support:</span>
            <span className={isSupported ? 'text-green-600' : 'text-red-600'}>
              {isSupported ? '✅ Supported' : '❌ Not Supported'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Microphone:</span>
            <span className={
              permissionStatus === 'granted' ? 'text-green-600' :
              permissionStatus === 'denied' ? 'text-red-600' :
              permissionStatus === 'prompt' ? 'text-yellow-600' : 'text-gray-600'
            }>
              {permissionStatus === 'granted' ? '✅ Allowed' :
               permissionStatus === 'denied' ? '❌ Denied' :
               permissionStatus === 'prompt' ? '⏳ Requesting' : '❓ Unknown'}
            </span>
          </div>
        </div>

        {}
        {permissionStatus !== 'granted' && isSupported && (
          <div className="space-y-3">
            <Button
              onClick={() => setShowGuide(true)}
              variant="outline"
              className="w-full bg-green-50 hover:bg-green-100 border-green-200"
            >
              <span className="text-green-700">📖 Learn How to Setup Microphone</span>
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setShowSetupWizard(true)}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <Mic className="w-4 h-4 mr-1 text-blue-600" />
                <span className="text-blue-700 text-xs">Guided Setup</span>
              </Button>
              
              <Button
                onClick={handleRequestPermission}
                variant="outline"
                size="sm"
              >
                {permissionStatus === 'denied' ? (
                  <>
                    <Settings className="w-4 h-4 mr-1 text-red-500" />
                    <span className="text-xs">Fix Access</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-1" />
                    <span className="text-xs">Quick Test</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
              <div className="font-medium mb-1">🎤 Microphone Setup Required</div>
              <div className="space-y-1">
                <div>• Click the button above to setup microphone access</div>
                <div>• Your browser will ask for permission</div>
                <div>• This only needs to be done once</div>
              </div>
            </div>
          </div>
        )}

        {}
        {permissionStatus === 'granted' && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center space-x-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Microphone Ready!</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              You can now use the voice test button below.
            </div>
          </div>
        )}

        {}
        {permissionStatus === 'granted' && (
          <Button
            onClick={handleToggle}
            disabled={!isSupported}
            className={`w-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Voice Test
              </>
            )}
          </Button>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Microphone Error</span>
            </div>
            <div className="text-sm text-red-700 mb-2">{error}</div>
            
            {(error.includes('NotAllowedError') || error.includes('Permission denied') || permissionStatus === 'denied') && (
              <div className="text-xs text-red-600 space-y-2">
                <div className="bg-red-100 p-2 rounded border">
                  <div className="font-medium mb-1">🚫 Permission Denied Error Detected</div>
                  <div className="text-xs text-red-600">
                    This is a common issue that can be fixed automatically using our permission repair tool.
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setShowPermissionFix(true)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      🔧 Fix Permission Issue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      🔄 Refresh
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {permissionStatus === 'denied' && !error.includes('NotAllowedError') && !error.includes('Permission denied') && (
              <div className="text-xs text-red-600 space-y-2">
                <div className="bg-red-100 p-2 rounded border">
                  <div className="font-medium mb-1">🔧 How to fix:</div>
                  <div className="space-y-1">
                    <div>1. Look for a microphone icon 🎤 in your browser address bar</div>
                    <div>2. Click it and select "Always allow" for this site</div>
                    <div>3. Refresh the page if needed</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTroubleshoot(true)}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Troubleshoot
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      🔄 Refresh
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {transcript && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm">
              <div className="font-medium text-blue-800 mb-1">You said:</div>
              <div className="text-blue-700 font-mono bg-white p-2 rounded border">
                "{transcript}"
              </div>
              {confidence > 0 && (
                <div className="text-xs text-blue-600 mt-1 flex items-center">
                  <span className="mr-2">Confidence:</span>
                  <div className="flex-1 bg-blue-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span>{Math.round(confidence * 100)}%</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTranscript}
              className="mt-2"
            >
              Clear
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div>Status: {
            !isSupported ? 'Browser not supported' :
            permissionStatus === 'denied' ? 'Microphone access denied' :
            permissionStatus !== 'granted' ? 'Microphone permission needed' :
            isListening ? 'Listening for speech...' : 'Ready to listen'
          }</div>
          {isSupported && (
            <div className="text-gray-400">
              🎤 Say something when listening starts. Works best in quiet environments.
            </div>
          )}
          
          {(error || permissionStatus === 'denied') && (
            <div className="flex justify-center space-x-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedDiagnostics(true)}
                className="text-green-600 hover:text-green-700 text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                🔧 Advanced Fix
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTroubleshoot(true)}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Basic Help
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}