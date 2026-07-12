import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  Mic, 
  Shield, 
  Globe, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Volume2
} from 'lucide-react';

interface MicrophoneGuideProps {
  onClose?: () => void;
  onTestMicrophone?: () => void;
}

export function MicrophoneGuide({ onClose, onTestMicrophone }: MicrophoneGuideProps) {
  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const hasSpeechRecognition = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  const browserName = getBrowserName();

  return (
    <Card className="max-w-2xl mx-auto p-6">
      {}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Microphone Setup Guide</h2>
            <p className="text-sm text-gray-600">Learn how to enable voice features</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      {}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">System Requirements</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Secure Connection (HTTPS)</span>
            <div className="flex items-center space-x-2">
              {isHttps ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">{isHttps ? 'Required ✅' : 'Required ❌'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Browser Support</span>
            <div className="flex items-center space-x-2">
              {hasSpeechRecognition ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">{browserName} {hasSpeechRecognition ? '✅' : '❌'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Microphone API</span>
            <div className="flex items-center space-x-2">
              {hasMediaDevices ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">{hasMediaDevices ? 'Available ✅' : 'Not Available ❌'}</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">How to Enable Microphone</h3>
        
        <div className="space-y-4">
          {}
          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                1
              </div>
              <h4 className="font-medium text-gray-800">Click the Voice Test Button</h4>
            </div>
            <p className="text-sm text-gray-600 ml-9">
              When you're ready to test your microphone, click the voice test button. This will trigger your browser to ask for permission.
            </p>
          </div>

          {}
          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                2
              </div>
              <h4 className="font-medium text-gray-800">Grant Permission</h4>
            </div>
            <p className="text-sm text-gray-600 ml-9 mb-3">
              Your browser will show a permission prompt. Click "Allow" to grant microphone access.
            </p>
            
            {}
            <div className="ml-9 bg-gray-50 rounded p-3">
              <div className="text-xs text-gray-700">
                <div className="font-medium mb-2">{browserName} Instructions:</div>
                {browserName === 'Chrome' || browserName === 'Edge' ? (
                  <div className="space-y-1">
                    <div>• Look for microphone icon 🎤 in address bar</div>
                    <div>• Click it and select "Always allow" for this site</div>
                    <div>• Refresh the page if needed</div>
                  </div>
                ) : browserName === 'Firefox' ? (
                  <div className="space-y-1">
                    <div>• Look for microphone icon in address bar</div>
                    <div>• Click it and select "Allow" for this site</div>
                    <div>• Refresh the page if needed</div>
                  </div>
                ) : browserName === 'Safari' ? (
                  <div className="space-y-1">
                    <div>• Go to Safari &gt; Settings for This Website</div>
                    <div>• Set Microphone to "Allow"</div>
                    <div>• Refresh the page</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div>• Look for microphone permission in browser settings</div>
                    <div>• Allow microphone access for this site</div>
                    <div>• Refresh the page</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                3
              </div>
              <h4 className="font-medium text-gray-800">Test Your Voice</h4>
            </div>
            <p className="text-sm text-gray-600 ml-9">
              Once permission is granted, speak clearly into your microphone. You should see your words appear as text.
            </p>
          </div>
        </div>
      </div>

      {}
      {(!isHttps || !hasMediaDevices || !hasSpeechRecognition) && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Troubleshooting</h3>
          
          <div className="space-y-3">
            {!isHttps && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">HTTPS Required</span>
                </div>
                <p className="text-sm text-red-700">
                  Microphone access requires a secure connection. Please access this site using HTTPS.
                </p>
              </div>
            )}

            {!hasSpeechRecognition && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Browser Not Supported</span>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  Your browser doesn't support speech recognition. Please use:
                </p>
                <div className="text-xs text-red-600 ml-4">
                  <div>• Google Chrome (recommended)</div>
                  <div>• Microsoft Edge</div>
                  <div>• Safari (limited support)</div>
                </div>
              </div>
            )}

            {!hasMediaDevices && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Microphone API Not Available</span>
                </div>
                <p className="text-sm text-red-700">
                  Your browser doesn't support microphone access. Please update to a newer version or use a different browser.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Voice Features Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
            <span>🎤</span>
            <span className="text-sm">Voice symptom checker</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
            <span>🗣️</span>
            <span className="text-sm">Voice navigation</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
            <span>📞</span>
            <span className="text-sm">Voice teleconsultation</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
            <span>🌐</span>
            <span className="text-sm">Multi-language support</span>
          </div>
        </div>
      </div>

      {}
      <div className="flex space-x-3">
        {isHttps && hasMediaDevices && hasSpeechRecognition && onTestMicrophone && (
          <Button 
            onClick={onTestMicrophone}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Mic className="w-4 h-4 mr-2" />
            Test My Microphone
          </Button>
        )}
        
        <Button 
          onClick={() => window.open('https://support.google.com/chrome/answer/2693767', '_blank')}
          variant="outline"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Browser Help
        </Button>
        
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Guide
          </Button>
        )}
      </div>

      {}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center mb-1">
          <Shield className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">Privacy Protection</span>
        </div>
        <p className="text-xs text-green-700">
          Your voice data is processed locally on your device and is never stored or sent to external servers. 
          You can revoke microphone permission at any time through your browser settings.
        </p>
      </div>
    </Card>
  );
}