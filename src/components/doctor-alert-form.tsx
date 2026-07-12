import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { X, Send, AlertTriangle, Phone, Video, Bell, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DoctorAlertFormProps {
  onClose: () => void;
  onSendAlert: (alert: {
    doctorName: string;
    alertTitle: string;
    message: string;
    type: 'general' | 'call_request' | 'urgent' | 'reminder';
    severity: 'low' | 'medium' | 'high' | 'critical';
    callType?: 'audio' | 'video';
  }) => void;
}

export function DoctorAlertForm({ onClose, onSendAlert }: DoctorAlertFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    alertTitle: '',
    message: '',
    type: 'general' as 'general' | 'call_request' | 'urgent' | 'reminder',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    callType: 'video' as 'audio' | 'video'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.alertTitle.trim() || !formData.message.trim()) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 
                  language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' :
                  'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਲੋੜੀਂਦੇ ਖੇਤਰ ਭਰੋ');
      return;
    }

    onSendAlert({
      doctorName: 'Dr. Preet Kaur', 
      alertTitle: formData.alertTitle,
      message: formData.message,
      type: formData.type,
      severity: formData.severity,
      callType: formData.type === 'call_request' ? formData.callType : undefined
    });

    toast.success(language === 'en' ? 'Alert sent to all patients!' : 
                  language === 'hi' ? 'सभी मरीजों को अलर्ट भेजा गया!' :
                  'ਸਾਰੇ ਮਰੀਜ਼ਾਂ ਨੂੰ ਅਲਰਟ ਭੇਜਿਆ ਗਿਆ!');
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call_request': return <Phone className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      en: { general: 'General Alert', call_request: 'Call Request', urgent: 'Urgent Alert', reminder: 'Reminder' },
      hi: { general: 'सामान्य अलर्ट', call_request: 'कॉल अनुरोध', urgent: 'तत्काल अलर्ट', reminder: 'रिमाइंडर' },
      pa: { general: 'ਆਮ ਅਲਰਟ', call_request: 'ਕਾਲ ਬੇਨਤੀ', urgent: 'ਤਤਕਾਲ ਅਲਰਟ', reminder: 'ਰਿਮਾਈਂਡਰ' }
    };
    return labels[language]?.[type] || type;
  };

  const getSeverityLabel = (severity: string) => {
    const labels = {
      en: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
      hi: { low: 'कम', medium: 'मध्यम', high: 'उच्च', critical: 'गंभीर' },
      pa: { low: 'ਘੱਟ', medium: 'ਮੱਧਮ', high: 'ਉੱਚ', critical: 'ਗੰਭੀਰ' }
    };
    return labels[language]?.[severity] || severity;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {t('sendHealthAlert')}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {}
          <form onSubmit={handleSubmit} className="space-y-4">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('alertTitle')} *
              </label>
              <Input
                value={formData.alertTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, alertTitle: e.target.value }))}
                placeholder={language === 'en' ? 'Enter alert title...' : 
                           language === 'hi' ? 'अलर्ट शीर्षक दर्ज करें...' :
                           'ਅਲਰਟ ਸਿਰਲੇਖ ਦਰਜ ਕਰੋ...'}
                required
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectAlertType')}
              </label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'general' | 'call_request' | 'urgent' | 'reminder') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon('general')}
                      <span>{getTypeLabel('general')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="call_request">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon('call_request')}
                      <span>{getTypeLabel('call_request')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon('urgent')}
                      <span>{getTypeLabel('urgent')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reminder">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon('reminder')}
                      <span>{getTypeLabel('reminder')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {}
            {formData.type === 'call_request' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Call Type' : language === 'hi' ? 'कॉल प्रकार' : 'ਕਾਲ ਕਿਸਮ'}
                </label>
                <Select 
                  value={formData.callType} 
                  onValueChange={(value: 'audio' | 'video') => 
                    setFormData(prev => ({ ...prev, callType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span>{t('videoCall')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="audio">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{t('audioCall')}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectSeverity')}
              </label>
              <Select 
                value={formData.severity} 
                onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                  setFormData(prev => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="text-blue-600">{getSeverityLabel('low')}</span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="text-yellow-600">{getSeverityLabel('medium')}</span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="text-orange-600">{getSeverityLabel('high')}</span>
                  </SelectItem>
                  <SelectItem value="critical">
                    <span className="text-red-600">{getSeverityLabel('critical')}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('alertMessage')} *
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder={language === 'en' ? 'Enter your message to patients...' : 
                           language === 'hi' ? 'मरीजों के लिए अपना संदेश दर्ज करें...' :
                           'ਮਰੀਜ਼ਾਂ ਲਈ ਆਪਣਾ ਸੰਦੇਸ਼ ਦਰਜ ਕਰੋ...'}
                rows={4}
                required
              />
            </div>

            {}
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                {language === 'en' ? 'Cancel' : language === 'hi' ? 'रद्द करें' : 'ਰੱਦ ਕਰੋ'}
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                {t('sendAlert')}
              </Button>
            </div>
          </form>

          {}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {t('sendToAllPatients')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}