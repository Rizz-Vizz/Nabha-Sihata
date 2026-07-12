import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle, Mic, MicOff, RefreshCw, Settings, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';

interface AdvancedMicrophoneDiagnosticsProps {
  onClose?: () => void;
}

interface DiagnosticResult {
  step: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: string;
  solution?: string;
}

interface MediaDeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
  groupId: string;
}

export function AdvancedMicrophoneDiagnostics({ onClose }: AdvancedMicrophoneDiagnosticsProps) {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runComprehensiveDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Test 1: Basic environment check
    setCurrentTest('Checking environment...');
    const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    addResult({
      step: 'Environment',
      status: isHTTPS ? 'success' : 'error',
      message: isHTTPS ? 'Secure context available' : 'HTTPS required',
      details: `Protocol: ${window.location.protocol}, Host: ${window.location.hostname}`,
      solution: !isHTTPS ? 'Site must be served over HTTPS for microphone access' : undefined
    });

    
    setCurrentTest('Checking APIs...');
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasSpeechRecognition = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
    
    addResult({
      step: 'MediaDevices API',
      status: hasMediaDevices ? 'success' : 'error',
      message: hasMediaDevices ? 'getUserMedia available' : 'getUserMedia not supported',
      solution: !hasMediaDevices ? 'Update your browser to a modern version' : undefined
    });

    addResult({
      step: 'Speech Recognition API',
      status: hasSpeechRecognition ? 'success' : 'warning',
      message: hasSpeechRecognition ? 'Speech Recognition available' : 'Speech Recognition not supported',
      details: hasSpeechRecognition ? 'Web Speech API detected' : 'Consider using Chrome or Edge',
      solution: !hasSpeechRecognition ? 'Use Chrome, Edge, or Safari for best speech recognition support' : undefined
    });

    
    setCurrentTest('Checking permissions...');
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        addResult({
          step: 'Permission Status',
          status: permission.state === 'granted' ? 'success' : permission.state === 'denied' ? 'error' : 'warning',
          message: `Permission ${permission.state}`,
          details: `Browser permission state: ${permission.state}`,
          solution: permission.state === 'denied' ? 'Click the microphone icon in the address bar and select "Allow"' : undefined
        });
      } catch (e) {
        addResult({
          step: 'Permission Status',
          status: 'warning',
          message: 'Permission API not available',
          details: 'Cannot check permission status directly'
        });
      }
    }

    
    setCurrentTest('Enumerating devices...');
    if (hasMediaDevices) {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = deviceList.filter(device => device.kind === 'audioinput');
        setDevices(audioInputs);
        
        addResult({
          step: 'Audio Devices',
          status: audioInputs.length > 0 ? 'success' : 'error',
          message: `Found ${audioInputs.length} audio input device(s)`,
          details: audioInputs.map(d => d.label || 'Unnamed device').join(', ') || 'No devices found'
        });

        if (audioInputs.length > 0 && !selectedDevice) {
          setSelectedDevice(audioInputs[0].deviceId);
        }
      } catch (e: any) {
        addResult({
          step: 'Audio Devices',
          status: 'error',
          message: 'Failed to enumerate devices',
          details: e.message,
          solution: 'Try refreshing permissions or restarting the browser'
        });
      }
    }

    
    setCurrentTest('Testing microphone access...');
    if (hasMediaDevices) {
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({ 
          audio: selectedDevice ? { deviceId: selectedDevice } : true 
        });
        
        addResult({
          step: 'Microphone Access',
          status: 'success',
          message: 'Microphone access granted',
          details: `Active tracks: ${testStream.getAudioTracks().length}`
        });

        
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(testStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let hasAudio = false;
        
        
        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          
          if (average > 10) {
            hasAudio = true;
          }
        };

        const audioCheckInterval = setInterval(checkAudio, 100);
        
        setTimeout(() => {
          clearInterval(audioCheckInterval);
          
          addResult({
            step: 'Audio Input Test',
            status: hasAudio ? 'success' : 'warning',
            message: hasAudio ? 'Audio input detected' : 'No audio input detected',
            details: hasAudio ? 'Microphone is receiving audio' : 'Try speaking or check microphone position',
            solution: !hasAudio ? 'Ensure microphone is not muted and speak near the device' : undefined
          });

          testStream.getTracks().forEach(track => track.stop());
          audioContext.close();
          setCurrentTest('');
          setIsRunning(false);
        }, 2000);

      } catch (e: any) {
        addResult({
          step: 'Microphone Access',
          status: 'error',
          message: 'Microphone access failed',
          details: e.message,
          solution: e.name === 'NotAllowedError' ? 
            'Click the microphone icon in address bar and select "Allow"' :
            e.name === 'NotFoundError' ?
            'No microphone found - check if device is connected' :
            'Try refreshing the page or restarting the browser'
        });
        setCurrentTest('');
        setIsRunning(false);
      }
    } else {
      setCurrentTest('');
      setIsRunning(false);
    }
  };

  const testSpecificDevice = async (deviceId: string) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } }
      });
      
      setStream(newStream);
      setIsListening(true);

      // Set up audio level monitoring
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(newStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (isListening) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
      
    } catch (e: any) {
      console.error('Device test failed:', e);
      alert(`Failed to test device: ${e.message}`);
    }
  };

  const stopDeviceTest = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsListening(false);
    setAudioLevel(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  useEffect(() => {
    runComprehensiveDiagnostics();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">🔧 Advanced Microphone Diagnostics</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      {}
      {isRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700 font-medium">{currentTest}</span>
          </div>
          {currentTest.includes('microphone access') && (
            <div className="mt-2 text-sm text-blue-600">
              Please speak into your microphone to test audio levels...
            </div>
          )}
        </div>
      )}

      {}
      {isListening && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-medium">🎤 Audio Level Test</span>
            <Button size="sm" variant="outline" onClick={stopDeviceTest}>
              Stop Test
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {audioLevel > 10 ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-150"
                style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
              />
            </div>
            <span className="text-sm text-green-600">{Math.round(audioLevel)}</span>
          </div>
          <div className="text-xs text-green-600 mt-1">
            {audioLevel > 10 ? '✅ Audio detected - microphone is working!' : '🔇 Speak into your microphone to test'}
          </div>
        </div>
      )}

      {}
      {devices.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Available Microphones</h4>
          <div className="space-y-2">
            {devices.map((device, index) => (
              <div key={device.deviceId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {device.label || `Microphone ${index + 1}`}
                  </span>
                  {selectedDevice === device.deviceId && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Current</span>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDevice(device.deviceId)}
                    disabled={selectedDevice === device.deviceId}
                  >
                    Select
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => testSpecificDevice(device.deviceId)}
                    disabled={isRunning || isListening}
                  >
                    Test This Device
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium">Diagnostic Results</h4>
        {results.map((result, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.step}</span>
              </div>
              <span className="text-sm">{result.message}</span>
            </div>
            {result.details && (
              <div className="text-xs opacity-75 mb-2">{result.details}</div>
            )}
            {result.solution && (
              <div className="text-xs bg-white bg-opacity-50 p-2 rounded border">
                <strong>💡 Solution:</strong> {result.solution}
              </div>
            )}
          </div>
        ))}
      </div>

      {}
      <div className="space-y-4">
        <h4 className="font-medium">Quick Fixes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                  stream.getTracks().forEach(track => track.stop());
                  alert('✅ Permission granted! Try the voice test now.');
                })
                .catch(e => alert(`❌ Permission failed: ${e.message}`));
            }}
            className="flex items-center space-x-2"
          >
            <Mic className="w-4 h-4" />
            <span>Request Fresh Permission</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Page</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then(stream => {
                    const track = stream.getAudioTracks()[0];
                    console.log('🎤 Current settings:', track.getSettings());
                    console.log('🎤 Capabilities:', track.getCapabilities());
                    stream.getTracks().forEach(track => track.stop());
                    alert('Check browser console for detailed microphone info');
                  })
                  .catch(e => console.error('Debug failed:', e));
              }
            }}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Debug Settings</span>
          </Button>

          <Button
            variant="outline"
            onClick={runComprehensiveDiagnostics}
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-run All Tests</span>
          </Button>
        </div>
      </div>

      {}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium mb-2">Browser-Specific Instructions</h5>
        <div className="text-xs space-y-2">
          <div><strong>Chrome/Edge:</strong> Click the 🎤 icon in address bar → "Always allow on this site" → Refresh</div>
          <div><strong>Firefox:</strong> Click 🎤 in address bar → "Allow" → Check "Remember this decision"</div>
          <div><strong>Safari:</strong> Safari menu → Preferences → Websites → Microphone → Allow for this site</div>
        </div>
      </div>
    </Card>
  );
}