import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { X, Phone, Video, Bell, AlertTriangle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DoctorAlert {
  id: string;
  doctorName: string;
  doctorPhoto?: string;
  alertTitle: string;
  message: string;
  type: 'general' | 'call_request' | 'urgent' | 'reminder';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  callType?: 'audio' | 'video';
  expiresAt?: string;
}

interface NotificationPopupProps {
  alert?: DoctorAlert;
  onClose: () => void;
  onJoinCall?: (callType: 'audio' | 'video') => void;
  onSaveToNotifications: (alert: DoctorAlert) => void;
}

export function NotificationPopup({ 
  alert, 
  onClose, 
  onJoinCall,
  onSaveToNotifications 
}: NotificationPopupProps) {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setIsVisible(true);
      
      onSaveToNotifications(alert);
      
      
      if (alert.type !== 'call_request') {
        const timer = setTimeout(() => {
          handleClose();
        }, 10000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [alert, onSaveToNotifications]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  const handleJoinCall = (callType: 'audio' | 'video') => {
    if (onJoinCall) {
      onJoinCall(callType);
    }
    handleClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string, type: string) => {
    if (type === 'call_request') {
      return <Phone className="w-5 h-5 text-green-600" />;
    }
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium': return <Bell className="w-5 h-5 text-yellow-600" />;
      case 'low': return <Bell className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const severityText = {
      en: { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' },
      hi: { critical: 'गंभीर', high: 'उच्च', medium: 'मध्यम', low: 'कम' },
      pa: { critical: 'ਗੰਭੀਰ', high: 'ਉੱਚ', medium: 'ਮੱਧਮ', low: 'ਘੱਟ' }
    };
    
    return severityText[language]?.[severity] || severity;
  };

  const getTypeText = (type: string) => {
    const typeTexts = {
      en: { 
        call_request: 'Call Request', 
        urgent: 'Urgent Alert', 
        reminder: 'Reminder',
        general: 'Health Alert'
      },
      hi: { 
        call_request: 'कॉल अनुरोध', 
        urgent: 'तत्काल अलर्ट', 
        reminder: 'रिमाइंडर',
        general: 'स्वास्थ्य अलर्ट'
      },
      pa: { 
        call_request: 'ਕਾਲ ਬੇਨਤੀ', 
        urgent: 'ਤਤਕਾਲ ਅਲਰਟ', 
        reminder: 'ਰਿਮਾਈਂਡਰ',
        general: 'ਸਿਹਤ ਅਲਰਟ'
      }
    };
    
    return typeTexts[language]?.[type] || type;
  };

  if (!alert) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-4 right-4 z-50 flex justify-center"
        >
          <Card className={`max-w-md w-full border-2 shadow-lg ${getSeverityColor(alert.severity)}`}>
            <div className="p-4">
              {}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {}
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {alert.doctorPhoto ? (
                      <img 
                        src={alert.doctorPhoto} 
                        alt={alert.doctorName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  
                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-800 truncate">
                        Dr. {alert.doctorName}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {getTypeText(alert.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(alert.severity, alert.type)}
                      <span className="text-sm font-medium text-gray-700">
                        {alert.alertTitle}
                      </span>
                    </div>
                  </div>
                </div>
                
                {}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {}
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {getSeverityBadge(alert.severity)}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleTimeString(language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US')}
                </span>
              </div>

              {}
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                {alert.message}
              </p>

              {}
              <div className="flex space-x-2">
                {alert.type === 'call_request' && onJoinCall && (
                  <>
                    <Button
                      onClick={() => handleJoinCall('video')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Video Call' : language === 'hi' ? 'वीडियो कॉल' : 'ਵੀਡੀਓ ਕਾਲ'}
                    </Button>
                    <Button
                      onClick={() => handleJoinCall('audio')}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Audio Call' : language === 'hi' ? 'ऑडियो कॉल' : 'ਆਡੀਓ ਕਾਲ'}
                    </Button>
                  </>
                )}
                
                {alert.type !== 'call_request' && (
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    {language === 'en' ? 'Acknowledge' : language === 'hi' ? 'समझ गया' : 'ਸਮਝ ਗਿਆ'}
                  </Button>
                )}
              </div>

              {}
              {alert.type === 'call_request' && alert.expiresAt && (
                <div className="mt-3 text-xs text-orange-600 text-center">
                  {language === 'en' ? '⏰ This call request expires in 2 minutes' : 
                   language === 'hi' ? '⏰ यह कॉल अनुरोध 2 मिनट में समाप्त हो जाएगा' :
                   '⏰ ਇਹ ਕਾਲ ਬੇਨਤੀ 2 ਮਿਨਟ ਵਿੱਚ ਖਤਮ ਹੋ ਜਾਵੇਗੀ'}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}