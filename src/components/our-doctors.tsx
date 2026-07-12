import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Phone, Stethoscope, Heart, Baby, Bone, Users, MessageCircle, Video, Send, X, Clock, AlertTriangle, CheckCircle, Mail, PhoneCall } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useLanguage } from './language-context';
import { LanguageSwitcher } from './language-switcher';

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


const getRecommendedDoctorId = (symptomData: any) => {
  if (!symptomData) return null;
  
  const { selectedSymptom, category } = symptomData;
  
  switch (selectedSymptom) {
    case 'chest_pain':
    case 'heart_issues':
      return 'dr-amarjeet'; 
    case 'womens_health':
    case 'pregnancy':
      return 'dr-arshpreet'; 
    case 'joint_pain':
    case 'bone_pain':
      return 'dr-rajveer'; 
    case 'skin_issues':
      return 'dr-anmolpreet'; 
    default:
      
      return 'dr-simran'; 
  }
};

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

interface OurDoctorsProps {
  onBack?: () => void;
  symptomData?: any;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
}

export function OurDoctors({ onBack, symptomData }: OurDoctorsProps) {
  const { t, language } = useLanguage();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showOfflineSMS, setShowOfflineSMS] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [offlineAppointmentData, setOfflineAppointmentData] = useState({
    patientName: '',
    phone: '',
    message: '',
    urgency: 'normal' as 'normal' | 'urgent'
  });

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsAppChat = (phoneNumber: string, doctorName: string) => {
    
    const whatsappNumber = phoneNumber.replace('+91 ', '91').replace(/\s/g, '');
    const message = `Hi ${doctorName}, I need medical consultation through Nabha Sihata telemedicine app.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppVideoCall = (phoneNumber: string, doctorName: string) => {
    
    const whatsappNumber = phoneNumber.replace('+91 ', '91').replace(/\s/g, '');
    const message = `Hi ${doctorName}, I need a video consultation through Nabha Sihata. Can we schedule a WhatsApp video call?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOfflineSMSAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowOfflineSMS(true);
  };

  const sendOfflineAppointment = () => {
    if (!selectedDoctor || !offlineAppointmentData.patientName || !offlineAppointmentData.phone) return;

    
    let message = `New appointment request from ${offlineAppointmentData.patientName} (${offlineAppointmentData.phone}).\n`;
    
    if (symptomData) {
      message += `Symptoms: ${symptomData.symptomLabel || 'General consultation'}\n`;
      message += `Duration: ${symptomData.duration || 'Not specified'}\n`;
      message += `Severity: ${symptomData.severity || 'Not specified'}\n`;
      if (symptomData.urgency) {
        message += `🚨 URGENT CASE\n`;
      }
    }
    
    message += `Message: ${offlineAppointmentData.message}\n`;
    message += `Priority: ${offlineAppointmentData.urgency.toUpperCase()}\n`;
    message += `Requested via Nabha Sihata app at ${new Date().toLocaleString()}`;

    
    const smsNumber = selectedDoctor.phone.replace('+91 ', '').replace(/\s/g, '');
    const smsUrl = `sms:+91${smsNumber}?body=${encodeURIComponent(message)}`;
    
    // Try to open SMS app
    window.location.href = smsUrl;
    
    // Show confirmation and reset form
    setTimeout(() => {
      setShowOfflineSMS(false);
      setOfflineAppointmentData({
        patientName: '',
        phone: '',
        message: '',
        urgency: 'normal'
      });
      alert(language === 'en' ? 'SMS appointment request prepared! Please send the message.' :
            language === 'hi' ? 'SMS अपॉइंटमेंट अनुरोध तैयार! कृपया संदेश भेजें।' :
            'SMS ਅਪੌਇਂਟਮੈਂਟ ਬੇਨਤੀ ਤਿਆਰ! ਕਿਰਪਾ ਕਰਕੇ ਸੰਦੇਸ਼ ਭੇਜੋ।');
    }, 500);
  };

  const openInAppChat = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowChat(true);
    
    
    let initialMessages: ChatMessage[] = [];
    
    
    let greeting = `Hello! I'm ${doctor.name}. How can I help you today?`;
    if (symptomData) {
      greeting = `Hello! I'm ${doctor.name}. I see you've completed a symptom check for ${symptomData.symptomLabel}. Let me help you with this.`;
    }
    
    initialMessages.push({
      id: '1',
      text: greeting,
      sender: 'doctor',
      timestamp: new Date()
    });

    
    if (symptomData) {
      initialMessages.push({
        id: '2', 
        text: `📋 **Symptom Summary:**\n• Main concern: ${symptomData.symptomLabel}\n• Duration: ${symptomData.duration}\n• Severity: ${symptomData.severity}\n• Diagnosis confidence: ${symptomData.confidence}%${symptomData.urgency ? '\n🚨 **URGENT CASE**' : ''}`,
        sender: 'doctor',
        timestamp: new Date()
      });
    }
    
    setChatMessages(initialMessages);
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedDoctor) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate more intelligent doctor responses based on message content
      setTimeout(() => {
        setIsTyping(false);
        
        let responseText = "Thank you for your message. I'll review your symptoms and get back to you shortly.";
        
        const messageText = newMessage.toLowerCase();
        
        // Smart responses based on content
        if (messageText.includes('pain') || messageText.includes('hurt')) {
          responseText = "I understand you're experiencing pain. Can you rate it from 1-10? Also, is it constant or comes and goes?";
        } else if (messageText.includes('fever') || messageText.includes('temperature')) {
          responseText = "For fever, please monitor your temperature and stay hydrated. If it goes above 102°F, seek immediate care.";
        } else if (messageText.includes('urgent') || messageText.includes('emergency')) {
          responseText = "This sounds urgent. I recommend calling me directly or visiting the nearest emergency facility immediately.";
        } else if (messageText.includes('medicine') || messageText.includes('medication')) {
          responseText = "I can help with medication guidance. Please share your current symptoms and any allergies you have.";
        } else if (symptomData && symptomData.urgency) {
          responseText = "Based on your urgent symptoms, I recommend immediate consultation. Please call me at your earliest convenience.";
        }
        
        const doctorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'doctor',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, doctorResponse]);
      }, 1500 + Math.random() * 1500); // Variable response time for realism
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="p-2">
                ←
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Talk to Doctor</h1>
              <p className="text-gray-600">Connect with qualified healthcare professionals</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </Button>
          </div>
        </div>

        {}
        {symptomData && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-800 mb-2">
                  {language === 'en' ? 'Consultation for your symptoms' :
                   language === 'hi' ? 'आपके लक्षणों के लिए सलाह' :
                   'ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਲਈ ਸਲਾਹ'}
                </h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>{language === 'en' ? 'Main concern:' : language === 'hi' ? 'मुख्य समस्या:' : 'ਮੁੱਖ ਸਮੱਸਿਆ:'}</strong> {symptomData.symptomLabel}</p>
                  <p><strong>{language === 'en' ? 'Severity:' : language === 'hi' ? 'गंभीरता:' : 'ਗੰਭੀਰਤਾ:'}</strong> {symptomData.severity}</p>
                  {symptomData.urgency && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-medium">
                        {language === 'en' ? 'Urgent consultation recommended' :
                         language === 'hi' ? 'तत्काल परामर्श की सिफारिश' :
                         'ਤੁਰੰਤ ਸਲਾਹ ਦੀ ਸਿਫਾਰਿਸ਼'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          {doctors
            .sort((a, b) => {
              const recommendedId = getRecommendedDoctorId(symptomData);
              if (a.id === recommendedId) return -1;
              if (b.id === recommendedId) return 1;
              return 0;
            })
            .map((doctor) => {
              const isRecommended = doctor.id === getRecommendedDoctorId(symptomData);
            const IconComponent = doctor.icon;
            
            return (
              <Card key={doctor.id} className={`p-6 hover:shadow-lg transition-all duration-200 ${
                isRecommended ? 'ring-2 ring-green-400 bg-green-50' : ''
              }`}>
                {}
                {isRecommended && (
                  <div className="flex justify-center mb-3">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>
                        {language === 'en' ? 'RECOMMENDED' :
                         language === 'hi' ? 'सुझावित' :
                         'ਸਿਫਾਰਿਸ਼ੀ'}
                      </span>
                    </div>
                  </div>
                )}

                {}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        👨‍⚕️
                      </div>
                    </div>
                    
                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center ${doctor.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.department}</p>
                  </div>
                </div>

                {}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {doctor.qualification}
                  </div>
                  <div className="text-xs text-gray-500">
                    {doctor.institution}
                  </div>
                </div>

                {}
                <div className="text-sm text-gray-600 mb-3">
                  {doctor.phone}
                </div>

                {}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleCall(doctor.phone)}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </Button>
                    <Button
                      onClick={() => openInAppChat(doctor)}
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Chat</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleWhatsAppChat(doctor.phone, doctor.name)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </Button>
                    <Button
                      onClick={() => handleWhatsAppVideoCall(doctor.phone, doctor.name)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1"
                    >
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </Button>
                  </div>
                  
                  {}
                  <Button
                    onClick={() => handleOfflineSMSAppointment(doctor)}
                    size="sm"
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 border-orange-200 hover:bg-orange-50"
                  >
                    <Mail className="w-3 h-3" />
                    <span>
                      {language === 'en' ? 'Offline SMS' :
                       language === 'hi' ? 'ऑफलाइन SMS' :
                       'ਆਫਲਾਈਨ SMS'}
                    </span>
                  </Button>
                </div>

                {}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">Available</span>
                    </div>
                    <span className="text-gray-500">Response: ~2 min</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span>Chat & Video Consultation</span>
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• In-app chat for quick questions</li>
              <li>• WhatsApp integration for convenience</li>
              <li>• Video calls for detailed consultation</li>
              <li>• Usually respond within 2-5 minutes</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <Phone className="w-5 h-5 text-red-600" />
              <span>Emergency Support</span>
            </h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>For life-threatening emergencies:</p>
              <Button
                onClick={() => handleCall('108')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency (108)
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All doctors are licensed medical professionals serving the Nabha region</p>
          <p className="mt-1">Teleconsultation fees: ₹50 per session • Emergency consultations: Free</p>
        </div>
      </div>

      {}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-md mx-auto max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                👨‍⚕️
              </div>
              <div>
                <div className="font-bold">{selectedDoctor?.name}</div>
                <div className="text-sm text-gray-600">{selectedDoctor?.department}</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Chat with {selectedDoctor?.name} for medical consultation and advice.
            </DialogDescription>
          </DialogHeader>
          
          {}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg max-h-96">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg rounded-bl-none p-3 max-w-[70%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {}
          <div className="flex space-x-2 mt-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-0 resize-none"
              rows={2}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div className="flex flex-col space-y-1">
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => selectedDoctor && handleWhatsAppChat(selectedDoctor.phone, selectedDoctor.name)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                title="Continue on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500">
              Response time: Usually within 2-5 minutes
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => selectedDoctor && handleCall(selectedDoctor.phone)}
                size="sm"
                variant="outline"
                className="flex items-center space-x-1"
              >
                <Phone className="w-3 h-3" />
                <span>Call Now</span>
              </Button>
              <Button
                onClick={() => selectedDoctor && handleWhatsAppVideoCall(selectedDoctor.phone, selectedDoctor.name)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1"
              >
                <Video className="w-3 h-3" />
                <span>Video</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={showOfflineSMS} onOpenChange={setShowOfflineSMS}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-orange-600" />
              <div>
                <div>
                  {language === 'en' ? 'Request Offline Appointment' :
                   language === 'hi' ? 'ऑफलाइन अपॉइंटमेंट का अनुरोध' :
                   'ਆਫਲਾਈਨ ਅਪੌਇਂਟਮੈਂਟ ਦੀ ਬੇਨਤੀ'}
                </div>
                <div className="text-sm text-gray-600 font-normal">
                  {selectedDoctor?.name}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              {language === 'en' ? 'Send an appointment request via SMS when the doctor is not available online.' :
               language === 'hi' ? 'जब डॉक्टर ऑनलाइन उपलब्ध नहीं हों तो SMS के माध्यम से अपॉइंटमेंट का अनुरोध भेजें।' :
               'ਜਦੋਂ ਡਾਕਟਰ ਆਨਲਾਈਨ ਉਪਲਬਧ ਨਾ ਹੋਵੇ ਤਾਂ SMS ਰਾਹੀਂ ਅਪੌਇਂਟਮੈਂਟ ਦੀ ਬੇਨਤੀ ਭੇਜੋ।'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {language === 'en' ? 'Your Name' :
                 language === 'hi' ? 'आपका नाम' :
                 'ਤੁਹਾਡਾ ਨਾਮ'}
              </label>
              <Input
                value={offlineAppointmentData.patientName}
                onChange={(e) => setOfflineAppointmentData(prev => ({
                  ...prev,
                  patientName: e.target.value
                }))}
                placeholder={language === 'en' ? 'Enter your full name' :
                           language === 'hi' ? 'अपना पूरा नाम दर्ज करें' :
                           'ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ'}
              />
            </div>

            {}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {language === 'en' ? 'Your Phone Number' :
                 language === 'hi' ? 'आपका फ़ोन नंबर' :
                 'ਤੁਹਾਡਾ ਫ਼ੋਨ ਨੰਬਰ'}
              </label>
              <Input
                type="tel"
                value={offlineAppointmentData.phone}
                onChange={(e) => setOfflineAppointmentData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {language === 'en' ? 'Priority Level' :
                 language === 'hi' ? 'प्राथमिकता स्तर' :
                 'ਤਰਜੀਹੀ ਪੱਧਰ'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={offlineAppointmentData.urgency === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOfflineAppointmentData(prev => ({ ...prev, urgency: 'normal' }))}
                  className="flex items-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Normal' :
                     language === 'hi' ? 'सामान्य' :
                     'ਆਮ'}
                  </span>
                </Button>
                <Button
                  variant={offlineAppointmentData.urgency === 'urgent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOfflineAppointmentData(prev => ({ ...prev, urgency: 'urgent' }))}
                  className="flex items-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Urgent' :
                     language === 'hi' ? 'तत्काल' :
                     'ਤੁਰੰਤ'}
                  </span>
                </Button>
              </div>
            </div>

            {}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {language === 'en' ? 'Message (Optional)' :
                 language === 'hi' ? 'संदेश (वैकल्पिक)' :
                 'ਸੰਦੇਸ਼ (ਵਿਕਲਪਿਕ)'}
              </label>
              <Textarea
                value={offlineAppointmentData.message}
                onChange={(e) => setOfflineAppointmentData(prev => ({
                  ...prev,
                  message: e.target.value
                }))}
                placeholder={language === 'en' ? 'Additional details about your condition...' :
                           language === 'hi' ? 'आपकी स्थिति के बारे में अतिरिक्त विवरण...' :
                           'ਤੁਹਾਡੀ ਸਥਿਤੀ ਬਾਰੇ ਵਾਧੂ ਵੇਰਵੇ...'}
                rows={3}
              />
            </div>

            {}
            {symptomData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>
                    {language === 'en' ? 'Symptom Context (will be included):' :
                     language === 'hi' ? 'लक्षण संदर्भ (शामिल किया जाएगा):' :
                     'ਲੱਛਣ ਸੰਦਰਭ (ਸ਼ਾਮਲ ਕੀਤਾ ਜਾਵੇਗਾ):'}
                  </strong>
                  <br />
                  {symptomData.symptomLabel} - {symptomData.severity}
                  {symptomData.urgency && (
                    <span className="text-red-600 font-medium"> (URGENT)</span>
                  )}
                </div>
              </div>
            )}

            {}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowOfflineSMS(false)}
                className="flex-1"
              >
                {language === 'en' ? 'Cancel' :
                 language === 'hi' ? 'रद्द करें' :
                 'ਰੱਦ ਕਰੋ'}
              </Button>
              <Button
                onClick={sendOfflineAppointment}
                disabled={!offlineAppointmentData.patientName || !offlineAppointmentData.phone}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Send SMS' :
                 language === 'hi' ? 'SMS भेजें' :
                 'SMS ਭੇਜੋ'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}