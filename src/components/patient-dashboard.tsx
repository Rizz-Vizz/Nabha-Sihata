import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { useAuth } from './auth-context';
import { HealthCard } from './health-card';
import { OurDoctors } from './our-doctors';
import { SymptomChecker } from './symptom-checker';
import { EmergencyPanel } from './emergency-panel';
import { VoiceSymptomChecker } from './voice-symptom-checker';
import { Appointments } from './appointments';
import { HospitalFinder } from './hospital-finder';
import { PharmacyFinder } from './pharmacy-finder';
import { OfflineMedicalRecords } from './offline-medical-records';
import { EnvironmentalSurvey } from './environmental-survey';
import { NotificationCenter } from './notification-center';
import { MedCoins } from './med-coins';
import { PeriodCare } from './period-care-restored';
import { LanguageSwitcher } from './language-switcher';
import { MentalHealthAwareness } from './mental-health-awareness';

import { SimplePharmacyWallet } from './simple-pharmacy-wallet';


import { PregnancyDashboard } from './pregnancy-dashboard';
import { 
  ArrowLeft, 
  CreditCard, 
  Video, 
  Brain, 
  Bot, 
  AlertTriangle, 
  Pill, 
  Calendar,
  Mic,
  LogOut,
  MapPin,
  Shield,
  Bell,
  FileText,
  Building2,
  Heart,
  Wallet,
  CreditCard
} from 'lucide-react';
import emergencyIcon from '@/assets/8ee6850e4652ec7e70c14a069845b51d4d91cfed.png';
import consultationIcon from '@/assets/b7f41f1a17075196391d0be4c6f70303dfa34c07.png';
import medbotIcon from '@/assets/8feea50d19adacf7309cbe12afdcb46d3362883c.png';

type ActivePanel = 'dashboard' | 'healthcard' | 'consultation' | 'symptoms' | 'voice-symptoms' | 'emergency' | 'appointments' | 'hospitals' | 'pharmacies' | 'medical-records' | 'survey' | 'notifications' | 'pregnancy' | 'medcoins' | 'period-care' | 'mental-health' | 'pharmacy-wallet';

interface PatientDashboardProps {
  onBack: () => void;
  selectedMember?: {
    name: string;
    gender: 'male' | 'female';
    age: number;
    showPregnancy: boolean;
    emoji: string;
  };
}

export function PatientDashboard({ onBack, selectedMember }: PatientDashboardProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');
  const [symptomData, setSymptomData] = useState<any>(null);
  const [medCoinsBalance, setMedCoinsBalance] = useState(187); 
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();

  if (activePanel === 'healthcard') {
    return <HealthCard onBack={() => setActivePanel('dashboard')} selectedMember={selectedMember} />;
  }

  if (activePanel === 'consultation') {
    return <OurDoctors 
      onBack={() => {
        setActivePanel('dashboard');
        setSymptomData(null); 
      }} 
      symptomData={symptomData}
    />;
  }

  if (activePanel === 'symptoms') {
    return <SymptomChecker 
      onBack={() => setActivePanel('dashboard')}
      onConsultDoctor={(data) => {
        setSymptomData(data);
        setActivePanel('consultation');
      }}
    />;
  }

  if (activePanel === 'voice-symptoms') {
    return <VoiceSymptomChecker 
      onBack={() => setActivePanel('dashboard')}
      onConsultDoctor={(data) => {
        setSymptomData(data);
        setActivePanel('consultation');
      }}
    />;
  }

  if (activePanel === 'emergency') {
    return <EmergencyPanel onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'appointments') {
    return <Appointments onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'hospitals') {
    return <HospitalFinder onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'pharmacies') {
    return <PharmacyFinder onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'medical-records') {
    return <OfflineMedicalRecords onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'survey') {
    return <EnvironmentalSurvey onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'notifications') {
    return <NotificationCenter onBack={() => setActivePanel('dashboard')} />;
  }





  if (activePanel === 'pregnancy') {
    return <PregnancyDashboard onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'medcoins') {
    return <MedCoins onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'period-care') {
    return <PeriodCare onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'mental-health') {
    return <MentalHealthAwareness onBack={() => setActivePanel('dashboard')} />;
  }



  if (activePanel === 'pharmacy-wallet') {
    return <SimplePharmacyWallet onBack={() => setActivePanel('dashboard')} />;
  }





  const baseMenuItems = [
    
    {
      id: 'emergency',
      icon: AlertTriangle,
      label: t('emergencyHelp'),
      bgColor: 'bg-red-500',
      emoji: '🚨',
      customImage: emergencyIcon,
      priority: 1
    },
    
    {
      id: 'consultation',
      icon: Video,
      label: t('talkToDoctor'),
      bgColor: 'bg-green-500',
      emoji: '👨‍⚕️',
      customImage: consultationIcon,
      priority: 2
    },
    {
      id: 'symptoms',
      icon: Bot,
      label: t('checkSymptoms'),
      bgColor: 'bg-violet-500',
      emoji: '🤖',
      customImage: medbotIcon,
      priority: 3
    },
    {
      id: 'voice-symptoms',
      icon: Mic,
      label: language === 'en' ? 'Voice Symptoms' : language === 'hi' ? 'वॉयस लक्षण चेकर' : 'ਵਾਇਸ ਲੱਛਣ ਚੈਕਰ',
      bgColor: 'bg-pink-500',
      emoji: '🎤',
      customImage: null,
      priority: 4
    },
    
    {
      id: 'healthcard',
      icon: CreditCard,
      label: t('myHealthCard'),
      bgColor: 'bg-blue-500',
      emoji: '🏥',
      customImage: null,
      priority: 5
    },
    {
      id: 'appointments',
      icon: Calendar,
      label: t('appointments'),
      bgColor: 'bg-indigo-500',
      emoji: '📅',
      customImage: null,
      priority: 6
    },
    {
      id: 'medical-records',
      icon: FileText,
      label: language === 'en' ? 'Medical Records' : language === 'hi' ? 'चिकित्सा रिकॉर्ड' : 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ',
      bgColor: 'bg-slate-500',
      emoji: '📋',
      customImage: null,
      priority: 7
    },
    
    {
      id: 'hospitals',
      icon: MapPin,
      label: t('findHospitals') || 'Find Hospitals',
      bgColor: 'bg-teal-500',
      emoji: '🏥',
      customImage: null,
      priority: 8
    },
    {
      id: 'pharmacies',
      icon: Building2,
      label: language === 'en' ? 'Nearby Pharmacies' : language === 'hi' ? 'नजदीकी दवाखाने' : 'ਨਜ਼ਦੀਕੀ ਦਵਾਖਾਨੇ',
      bgColor: 'bg-cyan-500',
      emoji: '💊',
      customImage: null,
      priority: 9
    },
    {
      id: 'pharmacy-wallet',
      icon: Wallet,
      label: t('pharmacyWallet'),
      bgColor: 'bg-green-500',
      emoji: '💰',
      customImage: null,
      priority: 10
    },
    
    {
      id: 'notifications',
      icon: Bell,
      label: language === 'en' ? 'Health Alerts' : language === 'hi' ? 'स्वास्थ्य अलर्ट' : 'ਸਿਹਤ ਅਲਰਟ',
      bgColor: 'bg-amber-500',
      emoji: '🔔',
      customImage: null,
      priority: 11
    },
    {
      id: 'survey',
      icon: Shield,
      label: language === 'en' ? 'Health Survey' : language === 'hi' ? 'स्वास्थ्य सर्वेक्षण' : 'ਸਿਹਤ ਸਰਵੇ',
      bgColor: 'bg-emerald-500',
      emoji: '🌱',
      customImage: null,
      priority: 12
    },
    {
      id: 'mental-health',
      icon: Brain,
      label: language === 'en' ? 'Mental Health' : language === 'hi' ? 'मानसिक स्वास्थ्य' : 'ਮਾਨਸਿਕ ਸਿਹਤ',
      bgColor: 'bg-purple-500',
      emoji: '🧠',
      customImage: null,
      priority: 13
    }
  ];

  
  const shouldShowPeriodCare = selectedMember?.gender === 'female' && 
                              selectedMember?.age >= 10 && 
                              selectedMember?.age <= 60;

  
  let menuItems = selectedMember?.showPregnancy 
    ? [...baseMenuItems, {
        id: 'pregnancy',
        icon: Shield,
        label: language === 'en' ? 'Pregnancy Care' : language === 'hi' ? 'गर्भावस्था देखभाल' : 'ਗਰਭ ਅਵਸਥਾ ਦੇਖਭਾਲ',
        bgColor: 'bg-pink-500',
        emoji: '🤰',
        customImage: null,
        priority: 12
      }]
    : baseMenuItems;

  
  if (shouldShowPeriodCare) {
    menuItems = [...menuItems, {
      id: 'period-care',
      icon: Heart,
      label: language === 'en' ? 'Period Care' : language === 'hi' ? 'पीरियड केयर' : 'ਪੀਰੀਅਡ ਦੇਖਭਾਲ',
      bgColor: 'bg-pink-500',
      emoji: '💖',
      customImage: null,
      priority: 13
    }];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">{selectedMember?.emoji || '👤'}</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">
                {selectedMember?.name || userProfile?.name || t('patient')}
              </h1>
              <p className="text-sm text-gray-600">
                {selectedMember ? `${selectedMember.age} years old` : `ID: ${userProfile?.health_card_id || 'Loading...'}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {}
            <LanguageSwitcher />
            
            {}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePanel('medcoins')}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200 hover:border-orange-300 px-3 py-2"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-orange-700 text-sm">{medCoinsBalance}</div>
                <div className="text-xs text-orange-600">
                  {language === 'en' ? 'Med Coins' : language === 'hi' ? 'मेड कॉइन्स' : 'ਮੇਡ ਕੋਇਨਸ'}
                </div>
              </div>
              <div className="text-orange-500 text-sm">✨</div>
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {}
        <div className="text-center mb-8">
          <h2 className="text-2xl text-gray-800 mb-2">
            {t('welcomeBack')}, {selectedMember?.name || userProfile?.name || t('patient')}!
          </h2>
          <p className="text-gray-600">{t('chooseHealthcareService')}</p>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className="p-6 text-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 group min-h-[160px] flex flex-col justify-center border-2 border-transparent hover:border-blue-200"
              onClick={() => setActivePanel(item.id as ActivePanel)}
            >
              <div className="flex-1">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {item.customImage ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all bg-gradient-to-br from-green-100 to-green-200">
                      <img 
                        src={item.customImage} 
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-all`}>
                      {item.emoji}
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-gray-800 mb-3">{item.label}</h4>
              </div>
            </Card>
          ))}
        </div>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            {t('recentActivity')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Dr. Preet Kaur</p>
                  <p className="text-sm text-gray-600">{t('consultationCompleted')}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2 {t('hoursAgo')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{t('nextAppointment')}</p>
                  <p className="text-sm text-gray-600">{t('drSinghCheckup')}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">8:00 AM</span>
            </div>
          </div>
        </Card>

        {}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {t('allDataSynced')}
          </p>
        </div>
      </div>
    </div>
  );
}