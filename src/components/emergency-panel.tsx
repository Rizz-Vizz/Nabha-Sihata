import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { LanguageSwitcher } from './language-switcher';
import { HealthTip } from './health-tip';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Shield, 
  Users, 
  AlertTriangle,
  Navigation,
  Clock
} from 'lucide-react';

interface EmergencyPanelProps {
  onBack: () => void;
}

export function EmergencyPanel({ onBack }: EmergencyPanelProps) {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useLanguage();

  const emergencyServices = [
    {
      id: 'ambulance',
      title: t('callAmbulance'),
      number: '108',
      icon: '🚑',
      color: 'bg-red-500',
      description: 'Free Emergency Medical Service'
    },
    {
      id: 'hospital',
      title: t('nearestHospital'),
      number: '+91-1234567890',
      icon: '🏥',
      color: 'bg-blue-500',
      description: 'Civil Hospital Nabha'
    },
    {
      id: 'police',
      title: t('policHelp'),
      number: '100',
      icon: '👮‍♂️',
      color: 'bg-indigo-500',
      description: 'Police Emergency'
    },
    {
      id: 'fire',
      title: 'Fire Emergency',
      number: '101',
      icon: '🚒',
      color: 'bg-orange-500',
      description: 'Fire & Rescue Services'
    }
  ];

  const emergencyContacts = [
    { name: 'Dr. Simran Kaur', role: 'Family Doctor', number: '+91 73490 10621' },
    { name: 'Jasbir Singh', role: 'Emergency Contact', number: '+91-9876543211' },
    { name: 'ASHA Worker', role: 'Local Health Worker', number: '+91-9876543212' },
  ];

  const handleEmergencyCall = (number: string, service: string) => {
    setEmergencyActive(true);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEmergencyActive(false);
          
          window.open(`tel:${number}`, '_self');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelEmergencyCall = () => {
    setEmergencyActive(false);
    setCountdown(0);
  };

  if (emergencyActive) {
    return (
      <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Emergency Call</h2>
          <div className="text-6xl font-bold text-red-500 mb-4">{countdown}</div>
          <p className="text-gray-600 mb-6">Calling emergency services in {countdown} seconds...</p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={cancelEmergencyCall}
            className="w-full"
          >
            Cancel Call
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {}
      <div className="bg-red-500 text-white p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-red-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-xl">{t('emergencyHelp')}</h1>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher variant="ghost" className="text-white border-white hover:bg-red-600" />
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-800 mb-2">Medical Emergency</h3>
              <p className="text-sm text-red-700">
                In case of life-threatening emergency, call 108 immediately. 
                Your location will be shared automatically with emergency services.
              </p>
            </div>
          </div>
        </Card>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyServices.map((service) => (
            <Card 
              key={service.id}
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
              onClick={() => handleEmergencyCall(service.number, service.title)}
            >
              <div className={`w-16 h-16 ${service.color} rounded-full mx-auto mb-4 flex items-center justify-center text-2xl`}>
                {service.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-2xl font-bold text-gray-600 mb-1">{service.number}</p>
              <p className="text-xs text-gray-500">{service.description}</p>
            </Card>
          ))}
        </div>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-500" />
            Your Current Location
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Nabha, Punjab, India</span>
              <Button size="sm" variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Share Location
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Coordinates: 30.3753° N, 76.1499° E
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Location accuracy: ~5 meters • Updated 2 minutes ago
            </p>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Nearest Hospitals
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-800">Civil Hospital Nabha</h4>
                <p className="text-sm text-blue-600">2.1 km away • 5 min drive</p>
              </div>
              <Button size="sm" onClick={() => handleEmergencyCall('+91-1234567890', 'Civil Hospital')}>
                <Phone className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-800">Govt Hospital Patiala</h4>
                <p className="text-sm text-blue-600">25 km away • 30 min drive</p>
              </div>
              <Button size="sm" onClick={() => handleEmergencyCall('+91-1234567891', 'Govt Hospital Patiala')}>
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            {t('emergencyContacts')}
          </h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-green-800">{contact.name}</h4>
                  <p className="text-sm text-green-600">{contact.role}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => window.open(`tel:${contact.number}`, '_self')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Medical Alert Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Blood Group:</span>
              <span className="text-red-600 font-bold">B+</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Allergies:</span>
              <span className="text-red-600">Penicillin, Peanuts</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Current Medications:</span>
              <span className="text-blue-600">Metformin, Lisinopril</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Medical Conditions:</span>
              <span className="text-orange-600">Diabetes, Hypertension</span>
            </div>
          </div>
        </Card>

        {}
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <span className="font-medium text-gray-800">Stay Safe</span>
          </div>
          <p className="text-sm text-gray-600">
            Emergency services have been notified of your medical information and current location.
          </p>
        </div>

        {}
        <HealthTip featureId="emergency" />
      </div>
    </div>
  );
}