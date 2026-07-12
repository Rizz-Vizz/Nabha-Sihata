import React, { useEffect } from 'react';
import { useVoiceCommand } from './speech-recognition-context';
import { useLanguage } from './language-context';
import { toast } from 'sonner@2.0.3';

interface VoiceNavigationProps {
  onEmergency?: () => void;
  onSymptomCheck?: () => void;
  onTeleconsultation?: () => void;
  onHealthCard?: () => void;
  onAppointments?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  isActive?: boolean;
}

export function VoiceNavigation({
  onEmergency,
  onSymptomCheck,
  onTeleconsultation,
  onHealthCard,
  onAppointments,
  onSettings,
  onHelp,
  isActive = false
}: VoiceNavigationProps) {
  const { t, language } = useLanguage();

  
  const getVoiceCommands = () => {
    const commands: { [key: string]: () => void } = {};

    
    if (onEmergency) {
      commands[t('emergency') || 'emergency'] = () => {
        toast.success('🚨 Opening emergency panel...');
        onEmergency();
      };
      commands['help me'] = () => {
        toast.success('🚨 Opening emergency panel...');
        onEmergency();
      };
      
      
      if (language === 'hi') {
        commands['आपातकाल'] = onEmergency;
        commands['मदद'] = onEmergency;
        commands['emergency'] = onEmergency;
      } else if (language === 'pa') {
        commands['ਐਮਰਜੈਂਸੀ'] = onEmergency;
        commands['ਮਦਦ'] = onEmergency;
        commands['emergency'] = onEmergency;
      }
    }

    
    if (onSymptomCheck) {
      commands[t('checkSymptoms') || 'check symptoms'] = () => {
        toast.success('🤖 Opening symptom checker...');
        onSymptomCheck();
      };
      commands['symptoms'] = () => {
        toast.success('🤖 Opening symptom checker...');
        onSymptomCheck();
      };
      commands['health check'] = () => {
        toast.success('🤖 Opening symptom checker...');
        onSymptomCheck();
      };
    }

    
    if (onTeleconsultation) {
      commands[t('callDoctor') || 'call doctor'] = () => {
        toast.success('📞 Starting teleconsultation...');
        onTeleconsultation();
      };
      commands['doctor call'] = () => {
        toast.success('📞 Starting teleconsultation...');
        onTeleconsultation();
      };
      commands['consultation'] = () => {
        toast.success('📞 Starting teleconsultation...');
        onTeleconsultation();
      };
    }

    
    if (onHealthCard) {
      commands[t('healthCard') || 'health card'] = () => {
        toast.success('📋 Opening health card...');
        onHealthCard();
      };
      commands['my card'] = () => {
        toast.success('📋 Opening health card...');
        onHealthCard();
      };
      commands['health record'] = () => {
        toast.success('📋 Opening health card...');
        onHealthCard();
      };
    }

    
    if (onAppointments) {
      commands[t('appointments') || 'appointments'] = () => {
        toast.success('📅 Opening appointments...');
        onAppointments();
      };
      commands['schedule'] = () => {
        toast.success('📅 Opening appointments...');
        onAppointments();
      };
    }

    
    if (onSettings) {
      commands['settings'] = () => {
        toast.success('⚙️ Opening settings...');
        onSettings();
      };
      commands['preferences'] = () => {
        toast.success('⚙️ Opening settings...');
        onSettings();
      };
    }

    
    if (onHelp) {
      commands['help'] = () => {
        toast.success('❓ Opening help...');
        onHelp();
      };
      commands['instructions'] = () => {
        toast.success('❓ Opening help...');
        onHelp();
      };
    }

    return commands;
  };

  const {
    isActive: voiceActive,
    transcript,
    confidence,
    startVoiceCommands,
    stopVoiceCommands
  } = useVoiceCommand(getVoiceCommands(), {
    confidence: 0.6, 
    continuous: true
  });

  
  useEffect(() => {
    if (isActive && !voiceActive) {
      console.log('🎤 Starting voice navigation...');
      startVoiceCommands();
    } else if (!isActive && voiceActive) {
      console.log('🛑 Stopping voice navigation...');
      stopVoiceCommands();
    }
  }, [isActive, voiceActive, startVoiceCommands, stopVoiceCommands]);

  
  useEffect(() => {
    return () => {
      if (voiceActive) {
        stopVoiceCommands();
      }
    };
  }, [voiceActive, stopVoiceCommands]);

  
  return null;
}


export function VoiceCommandHelp({ className = '' }: { className?: string }) {
  const { t, language } = useLanguage();

  const commands = [
    { 
      command: t('emergency') || 'emergency', 
      description: t('openEmergencyPanel') || 'Open emergency panel',
      icon: '🚨'
    },
    { 
      command: t('checkSymptoms') || 'check symptoms', 
      description: t('openSymptomChecker') || 'Open symptom checker',
      icon: '🤖'
    },
    { 
      command: t('callDoctor') || 'call doctor', 
      description: t('startTeleconsultation') || 'Start teleconsultation',
      icon: '📞'
    },
    { 
      command: t('healthCard') || 'health card', 
      description: t('openHealthCard') || 'Open health card',
      icon: '📋'
    },
    { 
      command: t('appointments') || 'appointments', 
      description: t('openAppointments') || 'Open appointments',
      icon: '📅'
    },
    { 
      command: 'help', 
      description: t('openHelp') || 'Show help',
      icon: '❓'
    }
  ];

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h4 className="font-medium text-blue-800 mb-3 flex items-center">
        <span className="mr-2">🎤</span>
        {t('voiceCommands') || 'Voice Commands'}
      </h4>
      <div className="space-y-2">
        {commands.map((cmd, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span>{cmd.icon}</span>
              <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono text-xs">
                "{cmd.command}"
              </code>
            </div>
            <span className="text-blue-700 text-xs">{cmd.description}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-blue-600">
        💡 {language === 'hi' 
          ? 'आप हिंदी या अंग्रेजी में बोल सकते हैं' 
          : language === 'pa'
          ? 'ਤੁਸੀਂ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲ ਸਕਦੇ ਹੋ'
          : 'Speak clearly in English, Hindi, or Punjabi'
        }
      </div>
    </div>
  );
}