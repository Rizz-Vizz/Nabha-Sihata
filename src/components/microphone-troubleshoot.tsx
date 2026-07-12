import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle, Mic, MicOff, RefreshCw, ExternalLink } from 'lucide-react';

interface MicrophoneTroubleshootProps {
  onClose?: () => void;
}

export function MicrophoneTroubleshoot({ onClose }: MicrophoneTroubleshootProps) {
  const [diagnostics, setDiagnostics] = useState<{
    browserSupport: boolean;
    httpsConnection: boolean;
    microphoneAvailable: boolean;
    speechRecognitionAvailable: boolean;
    permissionStatus: string;
    userAgent: string;
    error?: string;
  } | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results = {
      browserSupport: false,
      httpsConnection: false,
      microphoneAvailable: false,
      speechRecognitionAvailable: false,
      permissionStatus: 'unknown',
      userAgent: navigator.userAgent,
    };

    try {
      
      results.httpsConnection = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

      
      results.browserSupport = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
      results.speechRecognitionAvailable = results.browserSupport;

      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        results.microphoneAvailable = true;
        
        
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            results.permissionStatus = permission.state;
          } catch (e) {
            results.permissionStatus = 'unavailable';
          }
        }
      }

    } catch (error: any) {
      console.error('Diagnostics error:', error);
      setDiagnostics({ ...results, error: error.message });
      setIsRunning(false);
      return;
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">🔧 Microphone Troubleshoot</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      {isRunning ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Running diagnostics...</p>
        </div>
      ) : diagnostics ? (
        <div className="space-y-6">
          {}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">System Information</h4>
            <div className="text-sm text-gray-600">
              <div>Browser: {getBrowserName(diagnostics.userAgent)}</div>
              <div>Connection: {diagnostics.httpsConnection ? 'HTTPS ✅' : 'HTTP ⚠️'}</div>
            </div>
          </div>

          {}
          <div className="space-y-3">
            <h4 className="font-medium">Diagnostic Results</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Secure Connection (HTTPS)</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(diagnostics.httpsConnection)}
                  <span className="text-sm">
                    {diagnostics.httpsConnection ? 'Required ✅' : 'Required for microphone access'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Speech Recognition API</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(diagnostics.speechRecognitionAvailable)}
                  <span className="text-sm">
                    {diagnostics.speechRecognitionAvailable ? 'Available' : 'Not supported'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Microphone API</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(diagnostics.microphoneAvailable)}
                  <span className="text-sm">
                    {diagnostics.microphoneAvailable ? 'Available' : 'Not available'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Permission Status</span>
                <div className="flex items-center space-x-2">
                  {diagnostics.permissionStatus === 'granted' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : diagnostics.permissionStatus === 'denied' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm capitalize">{diagnostics.permissionStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-3">
            <h4 className="font-medium">Solutions</h4>
            
            {!diagnostics.httpsConnection && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="font-medium text-red-800">HTTPS Required</span>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  Microphone access requires a secure connection. The site must be served over HTTPS.
                </p>
                <p className="text-xs text-red-600">
                  Contact the site administrator to enable HTTPS.
                </p>
              </div>
            )}

            {!diagnostics.speechRecognitionAvailable && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="font-medium text-red-800">Browser Not Supported</span>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  Your browser doesn't support the Speech Recognition API.
                </p>
                <div className="text-xs text-red-600">
                  <p className="mb-1">Supported browsers:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Google Chrome (recommended)</li>
                    <li>Microsoft Edge</li>
                    <li>Safari (limited support)</li>
                  </ul>
                </div>
              </div>
            )}

            {diagnostics.permissionStatus === 'denied' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="font-medium text-yellow-800">Permission Denied</span>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  You've denied microphone access. Here's how to fix it:
                </p>
                <div className="text-sm text-yellow-700 space-y-2">
                  <div className="bg-yellow-100 p-2 rounded">
                    <div className="font-medium mb-1">Chrome/Edge:</div>
                    <div className="text-xs">
                      1. Click the microphone icon 🎤 in the address bar<br />
                      2. Select "Always allow" and click "Done"<br />
                      3. Refresh the page
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded">
                    <div className="font-medium mb-1">Firefox:</div>
                    <div className="text-xs">
                      1. Click the microphone icon in the address bar<br />
                      2. Remove the block and allow access<br />
                      3. Refresh the page
                    </div>
                  </div>
                </div>
              </div>
            )}

            {diagnostics.permissionStatus === 'prompt' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Mic className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-800">Ready to Test</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your system looks good! Try the voice test button to request microphone permission.
                </p>
              </div>
            )}
          </div>

          {}
          <div className="flex space-x-3">
            <Button onClick={runDiagnostics} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Re-run Diagnostics</span>
            </Button>
            
            <Button 
              onClick={() => window.open('https://support.google.com/chrome/answer/2693767', '_blank')}
              variant="outline" 
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Browser Help</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Failed to run diagnostics</p>
          <Button onClick={runDiagnostics} className="mt-4">
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
}