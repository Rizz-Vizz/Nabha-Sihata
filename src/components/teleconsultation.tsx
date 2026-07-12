import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Video, 
  Phone, 
  MessageSquare, 
  Star,
  Clock,
  MapPin,
  User,
  Mic,
  VideoOff,
  MicOff,
  PhoneOff
} from 'lucide-react';

interface TeleconsultationProps {
  onBack: () => void;
  filterBySpecialty?: string;
}

type ViewMode = 'doctors' | 'calling' | 'incall';

export function Teleconsultation({ onBack, filterBySpecialty }: TeleconsultationProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);
  const { t } = useLanguage();

  
  const allDoctors = [
    {
      id: 1,
      name: 'Dr. Simran Kaur',
      nameLocal: 'ਡਾ. ਸਿਮਰਨ ਕੌਰ',
      specialty: 'General Medicine',
      specialtyLocal: 'ਆਮ ਡਾਕਟਰ',
      rating: 4.8,
      experience: 12,
      available: true,
      languages: ['Punjabi', 'Hindi', 'English'],
      location: 'AIIMS New Delhi',
      consultationFee: 'Free',
      avatar: '👩‍⚕️',
      phone: '+91 73490 10621'
    },
    {
      id: 2,
      name: 'Dr. Sukhjeet Singh',
      nameLocal: 'ਡਾ. ਸੁਖਜੀਤ ਸਿੰਘ',
      specialty: 'Pediatrics',
      specialtyLocal: 'ਬਾਲ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ੍ਯ',
      rating: 4.7,
      experience: 8,
      available: true,
      languages: ['Punjabi', 'Hindi', 'English'],
      location: 'PGIMER Chandigarh',
      consultationFee: 'Free',
      avatar: '👨‍⚕️',
      phone: '+91 70192 39695'
    },
    {
      id: 3,
      name: 'Dr. Arshpreet Kaur',
      nameLocal: 'ਡਾ. ਅਰਸ਼ਪ੍ਰੀਤ ਕੌਰ',
      specialty: 'Gynecology & Obstetrics',
      specialtyLocal: 'ਔਰਤਾਂ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ੍ਯ',
      rating: 4.9,
      experience: 15,
      available: true,
      languages: ['Punjabi', 'Hindi'],
      location: 'CMC Vellore',
      consultationFee: 'Free',
      avatar: '👩‍⚕️',
      phone: '+91 86188 58079'
    },
    {
      id: 4,
      name: 'Dr. Rajveer Singh',
      nameLocal: 'ਡਾ. ਰਾਜਵੀਰ ਸਿੰਘ',
      specialty: 'Orthopedics',
      specialtyLocal: 'ਹੱਡੀਆਂ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ੍ਯ',
      rating: 4.6,
      experience: 10,
      available: false,
      languages: ['Punjabi', 'Hindi', 'English'],
      location: 'KMC Manipal',
      consultationFee: 'Free',
      avatar: '👨‍⚕️',
      phone: '+91 79880 84697'
    },
    {
      id: 5,
      name: 'Dr. Amarjeet Singh',
      nameLocal: 'ਡਾ. ਅਮਰਜੀਤ ਸਿੰਘ',
      specialty: 'Cardiology',
      specialtyLocal: 'ਦਿਲ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ੍ਯ',
      rating: 4.8,
      experience: 14,
      available: true,
      languages: ['Punjabi', 'Hindi', 'English'],
      location: 'AIIMS New Delhi',
      consultationFee: 'Free',
      avatar: '👨‍⚕️',
      phone: '+91 75260 42995'
    },
    {
      id: 6,
      name: 'Dr. Anmolpreet Kaur',
      nameLocal: 'ਡਾ. ਅਨਮੋਲਪ੍ਰੀਤ ਕੌਰ',
      specialty: 'Dermatology',
      specialtyLocal: 'ਚਮੜੀ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ੍ਯ',
      rating: 4.7,
      experience: 9,
      available: true,
      languages: ['Punjabi', 'Hindi', 'English'],
      location: 'JIPMER Puducherry',
      consultationFee: 'Free',
      avatar: '👩‍⚕️',
      phone: '+91 94483 29285'
    }
  ];

  
  const availableDoctors = allDoctors.filter(doctor => {
    if (filterBySpecialty === 'gynecologist') {
      return doctor.specialty.toLowerCase().includes('gynecology') || 
             doctor.specialty.toLowerCase().includes('obstetrics');
    }
    return true;
  });

  const startCall = (doctor: any) => {
    setSelectedDoctor(doctor);
    setViewMode('calling');
    
    
    setTimeout(() => {
      setViewMode('incall');
      
      
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }, 3000);
  };

  const endCall = () => {
    setViewMode('doctors');
    setSelectedDoctor(null);
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  if (viewMode === 'calling') {
    if (!selectedDoctor) {
      
      setViewMode('doctors');
      return null;
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl animate-pulse">
            {selectedDoctor?.avatar || '👨‍⚕️'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedDoctor?.name || 'Doctor'}</h2>
          <p className="text-gray-600 mb-2">{selectedDoctor?.specialty || 'General Physician'}</p>
          <p className="text-blue-600 mb-6">Connecting...</p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="destructive" 
              size="lg"
              onClick={endCall}
              className="rounded-full w-16 h-16"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  
  if (viewMode === 'incall') {
    if (!selectedDoctor) {
      
      setViewMode('doctors');
      return null;
    }
    
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-40 h-40 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-8xl">
                {selectedDoctor?.avatar || '👨‍⚕️'}
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedDoctor?.name || 'Doctor'}</h2>
              <p className="opacity-90">{selectedDoctor?.specialty || 'General Physician'}</p>
            </div>
          </div>
          
          {}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">{formatTime(callDuration)}</span>
            </div>
          </div>
          
          {}
          <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-700 flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
        </div>

        {}
        <div className="bg-black bg-opacity-80 p-6">
          <div className="flex justify-center space-x-6">
            <Button variant="secondary" size="lg" className="rounded-full w-16 h-16">
              <Mic className="w-6 h-6" />
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full w-16 h-16">
              <Video className="w-6 h-6" />
            </Button>
            <Button 
              variant="destructive" 
              size="lg"
              onClick={endCall}
              className="rounded-full w-16 h-16"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full w-16 h-16">
              <MessageSquare className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-white text-sm">
              Call Quality: Good • Network: 4G
            </p>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-gray-800">{t('talkToDoctor')}</h1>
          <Button variant="outline" size="sm">
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {}
        <Card className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-90">Available Doctors</div>
            </div>
            <div>
              <div className="text-2xl font-bold">&lt; 5min</div>
              <div className="text-sm opacity-90">Average Wait</div>
            </div>
            <div>
              <div className="text-2xl font-bold">FREE</div>
              <div className="text-sm opacity-90">Consultation</div>
            </div>
          </div>
        </Card>

        {}
        <div>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-green-500" />
            {t('availableDoctors')}
          </h2>
          
          <div className="space-y-4">
            {availableDoctors.map((doctor) => (
              <Card key={doctor.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                      {doctor.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{doctor.name}</h3>
                      <p className="text-gray-600 mb-1">{doctor.nameLocal}</p>
                      <p className="text-blue-600 mb-2">{doctor.specialty}</p>
                      <p className="text-gray-500 text-sm">{doctor.specialtyLocal}</p>
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{doctor.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{doctor.experience}+ years</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">{doctor.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doctor.languages.map((lang, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      doctor.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        doctor.available ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      {doctor.available ? 'Available' : 'Busy'}
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        disabled={!doctor.available}
                        onClick={() => startCall(doctor)}
                        className="w-full"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={!doctor.available}
                        className="w-full"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Audio Call
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {doctor.consultationFee}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">℮</span>
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-2">eSanjeevani Integration</h3>
              <p className="text-sm text-blue-700">
                Connected to Government of India's telemedicine platform for verified doctors 
                and secure consultations.
              </p>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <MessageSquare className="w-6 h-6 mb-2 text-blue-500" />
              <span className="text-sm">Chat Support</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Phone className="w-6 h-6 mb-2 text-green-500" />
              <span className="text-sm">Call Support</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}