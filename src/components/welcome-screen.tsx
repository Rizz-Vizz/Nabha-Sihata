import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, User, Stethoscope, ArrowRight } from 'lucide-react';
import { useAuth } from './auth-context';
import { useLanguage } from './language-context';
import { LanguageSwitcher } from './language-switcher';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();

  if (!userProfile) {
    return null;
  }

  const isPatient = userProfile.user_type === 'patient';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
      {}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      
      <Card className="max-w-lg w-full p-8 text-center">
        {}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {t('welcomeToNabhaSihata') || 'Welcome to Nabha Sihata!'}
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {isPatient ? (
              <User className="w-8 h-8 text-blue-600" />
            ) : (
              <Stethoscope className="w-8 h-8 text-green-600" />
            )}
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-800">
                {userProfile.name}
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {userProfile.user_type === 'patient' ? 'Patient' : 'Doctor'}
              </p>
            </div>
          </div>
          
          {isPatient && (
            <div className="text-sm text-gray-600">
              <p><strong>Health Card:</strong> {userProfile.health_card_id}</p>
              <p><strong>Village:</strong> {userProfile.village}</p>
              {userProfile.medcoins && (
                <p><strong>Med Coins:</strong> 🪙 {userProfile.medcoins}</p>
              )}
            </div>
          )}
          
          {!isPatient && (
            <div className="text-sm text-gray-600">
              <p><strong>Specialty:</strong> {userProfile.specialty}</p>
              <p><strong>License:</strong> {userProfile.license_number}</p>
              <p><strong>Hospital:</strong> {userProfile.hospital}</p>
            </div>
          )}
        </div>

        {}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>🎮 Demo Account:</strong> You're using a demo account to explore Nabha Sihata's features. 
            All data is for demonstration purposes only.
          </p>
        </div>

        {}
        <div className="text-left bg-white rounded-lg p-4 mb-6 border">
          <h4 className="font-semibold text-gray-800 mb-3">
            {isPatient ? '🏥 Patient Features Available:' : '👩‍⚕️ Doctor Features Available:'}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {isPatient ? (
              <>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>Teleconsultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🤖</span>
                  <span>AI Symptom Checker</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📋</span>
                  <span>Health Records</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚨</span>
                  <span>Emergency Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>Environmental Surveys</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🪙</span>
                  <span>Med Coins Rewards</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Patient Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Health Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💊</span>
                  <span>Prescriptions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>Appointments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚨</span>
                  <span>Emergency Response</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>Community Health</span>
                </div>
              </>
            )}
          </div>
        </div>

        {}
        <Button 
          onClick={onContinue}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          size="lg"
        >
          <span>Enter {isPatient ? 'Patient' : 'Doctor'} Dashboard</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {}
        <div className="mt-6 text-xs text-gray-500 text-center">
          💡 <strong>Tip:</strong> This is a fully functional demo. Try {isPatient ? 'booking an appointment or checking symptoms' : 'managing patients or viewing health analytics'}.
        </div>
      </Card>
    </div>
  );
};