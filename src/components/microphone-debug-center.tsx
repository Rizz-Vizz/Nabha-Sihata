import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SimpleVoiceTest } from './simple-voice-test';
import { AdvancedMicrophoneDiagnostics } from './advanced-microphone-diagnostics';
import { MicrophoneTroubleshoot } from './microphone-troubleshoot';
import { MicrophonePermissionFix } from './microphone-permission-fix';
import { Badge } from './ui/badge';
import { 
  Mic, 
  MicOff, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Wifi, 
  Shield, 
  Volume2,
  RefreshCw,
  Smartphone,
  Monitor
} from 'lucide-react';

interface MicrophoneDebugCenterProps {
  onClose?: () => void;
}

export function MicrophoneDebugCenter({ onClose }: MicrophoneDebugCenterProps) {
  const [systemInfo, setSystemInfo] = useState<{
    browser: string;
    os: string;
    isHTTPS: boolean;
    isMobile: boolean;
    hasMediaDevices: boolean;
    hasSpeechRecognition: boolean;
    permissionStatus: string;
  } | null>(null);

  const [quickTestResult, setQuickTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: 'Click to test' });

  useEffect(() => {
    const detectSystem = async () => {
      const userAgent = navigator.userAgent;
      const browser = userAgent.includes('Chrome') ? 'Chrome' :
                     userAgent.includes('Firefox') ? 'Firefox' :
                     userAgent.includes('Safari') ? 'Safari' :
                     userAgent.includes('Edge') ? 'Edge' : 'Unknown';
      
      const os = userAgent.includes('Windows') ? 'Windows' :
                userAgent.includes('Mac') ? 'macOS' :
                userAgent.includes('Linux') ? 'Linux' :
                userAgent.includes('Android') ? 'Android' :
                userAgent.includes('iOS') ? 'iOS' : 'Unknown';

      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasSpeechRecognition = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;

      let permissionStatus = 'unknown';
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          permissionStatus = permission.state;
        } catch (e) {
          permissionStatus = 'unavailable';
        }
      }

      setSystemInfo({
        browser,
        os,
        isHTTPS,
        isMobile,
        hasMediaDevices,
        hasSpeechRecognition,
        permissionStatus
      });
    };

    detectSystem();
  }, []);

  const runQuickTest = async () => {
    setQuickTestResult({ status: 'testing', message: 'Testing microphone...' });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = stream.getAudioTracks();
      
      if (tracks.length > 0) {
        setQuickTestResult({ 
          status: 'success', 
          message: `✅ Microphone working! Device: ${tracks[0].label || 'Default'}` 
        });
      } else {
        setQuickTestResult({ 
          status: 'error', 
          message: '❌ No audio tracks found' 
        });
      }
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      let message = '❌ Microphone test failed';
      
      if (error.name === 'NotAllowedError') {
        message = '🚫 Permission denied - Use "Permission Fix" tab to resolve this automatically';
      } else if (error.name === 'NotFoundError') {
        message = '🔍 No microphone found - check device connection';
      } else if (error.name === 'NotReadableError') {
        message = '📱 Microphone in use by another application';
      } else {
        message = `❌ Error: ${error.message}`;
      }
      
      setQuickTestResult({ status: 'error', message });
    }
  };

  const getStatusBadge = (status: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="text-xs">
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🎤 Microphone Debug Center</h1>
          <p className="text-gray-600">Comprehensive microphone testing and troubleshooting for Nabha Sihata</p>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            ✕ Close
          </Button>
        )}
      </div>

      {}
      {systemInfo && (
        <Card className="p-4 mb-6">
          <h3 className="font-medium mb-3 flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            System Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Browser</div>
              <div className="font-medium">{systemInfo.browser}</div>
              {getStatusBadge(
                ['Chrome', 'Edge', 'Safari'].includes(systemInfo.browser),
                'Supported',
                'Limited'
              )}
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Platform</div>
              <div className="font-medium flex items-center justify-center">
                {systemInfo.isMobile ? <Smartphone className="w-4 h-4 mr-1" /> : <Monitor className="w-4 h-4 mr-1" />}
                {systemInfo.os}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Security</div>
              <div className="font-medium flex items-center justify-center">
                {systemInfo.isHTTPS ? <Shield className="w-4 h-4 mr-1 text-green-500" /> : <AlertCircle className="w-4 h-4 mr-1 text-red-500" />}
                {systemInfo.isHTTPS ? 'HTTPS' : 'HTTP'}
              </div>
              {getStatusBadge(systemInfo.isHTTPS, 'Secure', 'Insecure')}
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Permission</div>
              <div className="font-medium capitalize">{systemInfo.permissionStatus}</div>
              {getStatusBadge(
                systemInfo.permissionStatus === 'granted',
                'Granted',
                systemInfo.permissionStatus === 'denied' ? 'Denied' : 'Pending'
              )}
            </div>
          </div>
        </Card>
      )}

      {}
      <Card className="p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <Volume2 className="w-4 h-4 mr-2" />
            Quick Microphone Test
          </h3>
          <Button 
            onClick={runQuickTest} 
            disabled={quickTestResult.status === 'testing'}
            variant={quickTestResult.status === 'success' ? 'default' : 'outline'}
          >
            {quickTestResult.status === 'testing' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Test Now
              </>
            )}
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg border ${
          quickTestResult.status === 'success' ? 'bg-green-50 border-green-200' :
          quickTestResult.status === 'error' ? 'bg-red-50 border-red-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            {quickTestResult.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
             quickTestResult.status === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
             <Mic className="w-4 h-4 text-gray-500" />}
            <span className="text-sm">{quickTestResult.message}</span>
          </div>
        </div>
      </Card>

      {}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Test</TabsTrigger>
          <TabsTrigger value="fix">Permission Fix</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-4">
          <SimpleVoiceTest />
        </TabsContent>
        
        <TabsContent value="fix" className="mt-4">
          <MicrophonePermissionFix />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-4">
          <AdvancedMicrophoneDiagnostics />
        </TabsContent>
        
        <TabsContent value="troubleshoot" className="mt-4">
          <MicrophoneTroubleshoot />
        </TabsContent>
      </Tabs>

      {}
      <Card className="p-4 mt-6">
        <h3 className="font-medium mb-3">🔧 Common Issues & Quick Fixes</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <div className="font-medium text-red-800 mb-1">❌ Permission Denied</div>
              <div className="text-xs text-red-700">
                1. Click 🎤 icon in address bar<br/>
                2. Select "Always allow on this site"<br/>
                3. Refresh the page
              </div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="font-medium text-yellow-800 mb-1">⚠️ No Audio Input</div>
              <div className="text-xs text-yellow-700">
                1. Check microphone is not muted<br/>
                2. Try different microphone device<br/>
                3. Close other apps using microphone
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="font-medium text-blue-800 mb-1">🔄 Reset Everything</div>
              <div className="text-xs text-blue-700 space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(registrations => {
                        registrations.forEach(registration => registration.unregister());
                      });
                    }
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full"
                >
                  🔄 Clear Site Data & Reload
                </Button>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="font-medium text-green-800 mb-1">✅ Best Practices</div>
              <div className="text-xs text-green-700">
                • Use Chrome or Edge for best support<br/>
                • Ensure quiet environment<br/>
                • Speak clearly and close to microphone<br/>
                • Grant permissions when prompted
              </div>
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="p-4 mt-6 bg-gray-50">
        <div className="text-center">
          <h4 className="font-medium mb-2">Still Having Issues?</h4>
          <p className="text-sm text-gray-600 mb-3">
            If none of the above solutions work, there might be a deeper compatibility issue.
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const info = {
                  userAgent: navigator.userAgent,
                  url: window.location.href,
                  timestamp: new Date().toISOString(),
                  systemInfo: systemInfo,
                  quickTestResult: quickTestResult
                };
                console.log('🐛 Debug info for support:', info);
                alert('Debug information logged to console. Please copy and send to support.');
              }}
            >
              📋 Copy Debug Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/your-repo/issues', '_blank')}
            >
              🐛 Report Issue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}