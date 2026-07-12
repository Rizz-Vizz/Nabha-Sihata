import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useLanguage } from './language-context';
import { Phone, MessageCircle, Video, Stethoscope, Heart, Baby, Bone, Users } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  institution: string;
  phone: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const doctors: Doctor[] = [
  {
    id: 'dr-simran',
    name: 'Dr. Simran Kaur',
    department: 'General Medicine',
    qualification: 'MBBS',
    institution: 'AIIMS New Delhi',
    phone: '+91 73490 10621',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'dr-sukhjeet',
    name: 'Dr. Sukhjeet Singh',
    department: 'Pediatrics',
    qualification: 'MD Pediatrics',
    institution: 'PGIMER Chandigarh',
    phone: '+91 70192 39695',
    icon: Baby,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    id: 'dr-arshpreet',
    name: 'Dr. Arshpreet Kaur',
    department: 'Gynecology & Obstetrics',
    qualification: 'MS Obstetrics & Gynecology',
    institution: 'CMC Vellore',
    phone: '+91 86188 58079',
    icon: Users,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'dr-rajveer',
    name: 'Dr. Rajveer Singh',
    department: 'Orthopedics',
    qualification: 'MS Orthopedics',
    institution: 'KMC Manipal',
    phone: '+91 79880 84697',
    icon: Bone,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 'dr-amarjeet',
    name: 'Dr. Amarjeet Singh',
    department: 'Cardiology',
    qualification: 'DM Cardiology',
    institution: 'AIIMS New Delhi',
    phone: '+91 75260 42995',
    icon: Heart,
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 'dr-anmolpreet',
    name: 'Dr. Anmolpreet Kaur',
    department: 'Dermatology',
    qualification: 'MD Dermatology',
    institution: 'JIPMER Puducherry',
    phone: '+91 94483 29285',
    icon: Stethoscope,
    color: 'bg-green-100 text-green-600'
  }
];

interface ConsultationNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: any;
  recommendedDoctorId: string;
}

export function ConsultationNavigator({ 
  isOpen, 
  onClose, 
  diagnosis, 
  recommendedDoctorId 
}: ConsultationNavigatorProps) {
  const { t, language } = useLanguage();
  
  const recommendedDoctor = doctors.find(doc => doc.id === recommendedDoctorId);
  const IconComponent = recommendedDoctor?.icon || Stethoscope;

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsAppChat = (phoneNumber: string, doctorName: string) => {
    const whatsappNumber = phoneNumber.replace('+91 ', '91').replace(/\s/g, '');
    const symptomText = diagnosis?.name?.[language] || 'Medical consultation';
    const message = `Hi ${doctorName}, I need medical consultation through Nabha Sihata telemedicine app. I'm experiencing: ${symptomText}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppVideoCall = (phoneNumber: string, doctorName: string) => {
    const whatsappNumber = phoneNumber.replace('+91 ', '91').replace(/\s/g, '');
    const symptomText = diagnosis?.name?.[language] || 'Medical consultation';
    const message = `Hi ${doctorName}, I need a video consultation through Nabha Sihata for: ${symptomText}. Can we schedule a WhatsApp video call?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!recommendedDoctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${recommendedDoctor.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold">{t('recommendedSpecialist') || 'Recommended Specialist'}</div>
              <div className="text-sm text-gray-600 font-normal">{t('basedOnYourSymptoms') || 'Based on your symptoms'}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {}
        <div className="space-y-4">
          {}
          {diagnosis && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔍</span>
                </div>
                <span className="font-medium text-blue-800">
                  {t('yourDiagnosis') || 'Your Diagnosis'}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {diagnosis.name[language]}
              </p>
              {diagnosis.urgency && (
                <div className="mt-2 flex items-center space-x-1 text-red-600">
                  <span className="text-xs">⚠️</span>
                  <span className="text-xs font-medium">{t('urgentCare') || 'Urgent Care Needed'}</span>
                </div>
              )}
            </Card>
          )}

          {}
          <Card className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                  👨‍⚕️
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{recommendedDoctor.name}</h3>
                <p className="text-sm text-gray-600">{recommendedDoctor.department}</p>
                <p className="text-xs text-gray-500">{recommendedDoctor.qualification}</p>
                <p className="text-xs text-gray-500">{recommendedDoctor.institution}</p>
              </div>
            </div>

            {}
            <div className="text-sm text-gray-600 mb-4">
              📞 {recommendedDoctor.phone}
            </div>

            {}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleCall(recommendedDoctor.phone)}
                  className={`${diagnosis?.urgency ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-teal-600 hover:bg-teal-700'} text-white flex items-center space-x-1`}
                >
                  <Phone className="w-4 h-4" />
                  <span>{diagnosis?.urgency ? (t('callNow') || 'Call Now') : (t('call') || 'Call')}</span>
                </Button>
                
                <Button
                  onClick={() => handleWhatsAppChat(recommendedDoctor.phone, recommendedDoctor.name)}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('whatsapp') || 'WhatsApp'}</span>
                </Button>
              </div>

              <Button
                onClick={() => handleWhatsAppVideoCall(recommendedDoctor.phone, recommendedDoctor.name)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
              >
                <Video className="w-4 h-4" />
                <span>{t('videoConsultation') || 'Video Consultation'}</span>
              </Button>
            </div>

            {}
            {diagnosis?.urgency && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">🚨</span>
                  <span className="text-sm font-medium text-red-800">
                    {t('urgentConsultationNeeded') || 'Urgent consultation needed'}
                  </span>
                </div>
                <p className="text-xs text-red-700 mt-1">
                  {t('contactDoctorImmediately') || 'Please contact the doctor immediately or visit the nearest hospital'}
                </p>
              </div>
            )}

            {}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">{t('available') || 'Available'}</span>
                </div>
                <span className="text-gray-500">{t('responseTime') || 'Response: ~2 min'}</span>
              </div>
            </div>
          </Card>

          {}
          <div className="pt-2">
            <p className="text-xs text-gray-500 text-center mb-3">
              {t('alternativeSpecialists') || 'Or consult other specialists'}
            </p>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {doctors.filter(doc => doc.id !== recommendedDoctorId).slice(0, 3).map((doctor) => {
                const DocIcon = doctor.icon;
                return (
                  <Button
                    key={doctor.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleWhatsAppChat(doctor.phone, doctor.name)}
                    className="flex-shrink-0 flex items-center space-x-1"
                  >
                    <DocIcon className="w-3 h-3" />
                    <span className="text-xs">{doctor.name.split(' ')[1]}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}