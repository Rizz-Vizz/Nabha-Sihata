import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { useOffline } from './offline-context';
import { LanguageSwitcher } from './language-switcher';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Droplets, 
  AlertTriangle,
  Pill,
  FileText,
  Download,
  Share,
  Camera
} from 'lucide-react';

interface HealthCardProps {
  onBack: () => void;
  selectedMember?: {
    name: string;
    gender: 'male' | 'female';
    age: number;
    emoji: string;
  } | null;
}

export function HealthCard({ onBack, selectedMember }: HealthCardProps) {
  const { t } = useLanguage();
  const { isOnline, addPendingSync } = useOffline();

  
  const getPatientData = () => {
    if (selectedMember) {
      return {
        name: selectedMember.name,
        nameEn: selectedMember.name,
        photo: selectedMember.emoji,
        id: `NS00${selectedMember.name.slice(0,4).toUpperCase()}`,
        age: selectedMember.age,
        bloodGroup: selectedMember.gender === 'female' ? "O+" : "B+",
        village: "Nabha, Punjab",
        phone: "+91 98765 43210",
        emergencyContact: "+91 98765 43211",
        allergies: selectedMember.gender === 'female' ? ["None Known"] : ["Penicillin"],
        currentMedications: selectedMember.showPregnancy ? [
          { name: "Folic Acid", dosage: "5mg", frequency: "Once daily" },
          { name: "Iron Supplement", dosage: "200mg", frequency: "Twice daily" }
        ] : selectedMember.age > 40 ? [
          { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
        ] : [
          { name: "Vitamin D", dosage: "1000IU", frequency: "Once daily" }
        ],
        lastVisit: "15 Dec 2024",
        conditions: selectedMember.showPregnancy ? ["Pregnancy - 2nd Trimester"] : 
                   selectedMember.age > 40 ? ["Type 2 Diabetes", "Hypertension"] : ["No chronic conditions"],
        vaccinations: [
          { name: "COVID-19", date: "Mar 2024", status: "Complete" },
          { name: "Tetanus", date: "Jan 2023", status: "Due 2033" }
        ]
      };
    }
    
    
    return {
      name: "ਸਤਨਾਮ ਸਿੰਘ",
      nameEn: "Satnam Singh",
      photo: "👤",
      id: "NS001234",
      age: 45,
      bloodGroup: "B+",
      village: "Nabha, Punjab",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 43211",
      allergies: ["Penicillin", "Peanuts"],
      currentMedications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
      ],
      lastVisit: "15 Dec 2024",
      conditions: ["Type 2 Diabetes", "Hypertension"],
      vaccinations: [
        { name: "COVID-19", date: "Mar 2024", status: "Complete" },
        { name: "Tetanus", date: "Jan 2023", status: "Due 2033" }
      ]
    };
  };

  const patientData = getPatientData();

  const updatePhoto = () => {
    addPendingSync({
      action: 'updatePhoto',
      patientId: patientData.id,
      timestamp: Date.now()
    });
    alert('Photo update queued for sync');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-gray-800">{t('myHealthCard')}</h1>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl relative">
                {patientData.photo}
                <button 
                  onClick={updatePhoto}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patientData.name}</h2>
                <p className="text-lg opacity-90">{patientData.nameEn}</p>
                <p className="opacity-75">{patientData.village}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">{t('patientId')}</p>
              <p className="font-mono text-lg">{patientData.id}</p>
              <div className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs ${
                isOnline ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isOnline ? 'bg-white' : 'bg-white animate-pulse'
                }`}></div>
                {isOnline ? 'Synced' : 'Offline'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <User className="w-6 h-6 mx-auto mb-2 opacity-75" />
              <p className="text-sm opacity-75">{t('age')}</p>
              <p className="font-bold text-lg">{patientData.age}</p>
            </div>
            <div>
              <Droplets className="w-6 h-6 mx-auto mb-2 opacity-75" />
              <p className="text-sm opacity-75">{t('bloodGroup')}</p>
              <p className="font-bold text-lg">{patientData.bloodGroup}</p>
            </div>
            <div>
              <Calendar className="w-6 h-6 mx-auto mb-2 opacity-75" />
              <p className="text-sm opacity-75">{t('lastVisit')}</p>
              <p className="font-bold text-lg">{patientData.lastVisit}</p>
            </div>
          </div>
        </Card>

        {}
        <div className="grid md:grid-cols-2 gap-6">
          {}
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-orange-500" />
              {t('medications')}
            </h3>
            <div className="space-y-3">
              {patientData.currentMedications.map((med, index) => (
                <div key={index} className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800">{med.name}</h4>
                    <span className="text-sm text-orange-600 bg-orange-200 px-2 py-1 rounded">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{med.frequency}</p>
                </div>
              ))}
            </div>
          </Card>

          {}
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              {t('allergies')}
            </h3>
            <div className="space-y-2">
              {patientData.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-3" />
                  <span className="font-medium text-red-800">{allergy}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Medical Conditions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {patientData.conditions.map((condition, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800">{condition}</h4>
                <p className="text-sm text-blue-600 mt-1">Diagnosed 2022</p>
              </div>
            ))}
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-green-500" />
            Vaccination Records
          </h3>
          <div className="space-y-3">
            {patientData.vaccinations.map((vaccine, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-green-800">{vaccine.name}</h4>
                  <p className="text-sm text-green-600">{vaccine.date}</p>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                  {vaccine.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Emergency Contacts
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Primary</span>
              <span className="text-blue-600 font-mono">{patientData.phone}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Emergency</span>
              <span className="text-red-600 font-mono">{patientData.emergencyContact}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}