import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Settings, 
  Phone, 
  PlayCircle, 
  MessageCircle, 
  HelpCircle, 
  Star, 
  Shield, 
  Bell, 
  Globe, 
  User, 
  Mail,
  Volume2,
  Wifi,
  Download,
  Headphones,
  BookOpen,
  Info,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const customerCareNumber = "+91-8699-555-777";
  const supportEmail = "support@nabhasihata.com";

  const handleCall = () => {
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      window.location.href = `tel:${customerCareNumber}`;
      toast.success(language === 'en' ? 'Opening dialer...' : language === 'hi' ? 'डायलर खोला जा रहा है...' : 'ਡਾਇਲਰ ਖੋਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...');
    } else {
      toast.info(`${language === 'en' ? 'Customer Care:' : language === 'hi' ? 'ग्राहक सेवा:' : 'ਗਾਹਕ ਸੇਵਾ:'} ${customerCareNumber}`);
    }
  };

  const handleSMS = () => {
    const message = language === 'en' 
      ? 'Hi, I need help with my Nabha Sihata account.' 
      : language === 'hi' 
      ? 'नमस्ते, मुझे अपने नभा सिहाता खाते में मदद चाहिए।'
      : 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਨੂੰ ਆਪਣੇ ਨਭਾ ਸਿਹਾਤਾ ਖਾਤੇ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।';
    
    const smsUrl = `sms:${customerCareNumber}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
    toast.success(language === 'en' ? 'Opening SMS app...' : language === 'hi' ? 'SMS एप खोला जा रहा है...' : 'SMS ਐਪ ਖੋਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...');
  };

  const tutorialSections = [
    {
      id: 'getting-started',
      title: language === 'en' ? 'Getting Started' : language === 'hi' ? 'शुरुआत' : 'ਸ਼ੁਰੂਆਤ',
      icon: PlayCircle,
      description: language === 'en' ? 'Learn the basics of Nabha Sihata' : language === 'hi' ? 'नभा सिहाता की मूल बातें सीखें' : 'ਨਭਾ ਸਿਹਾਤਾ ਦੀਆਂ ਬੁਨਿਆਦੀ ਗੱਲਾਂ ਸਿੱਖੋ',
      duration: '3 min'
    },
    {
      id: 'voice-features',
      title: language === 'en' ? 'Voice Features' : language === 'hi' ? 'आवाज़ की सुविधाएं' : 'ਆਵਾਜ਼ ਦੀਆਂ ਸੁਵਿਧਾਵਾਂ',
      icon: Volume2,
      description: language === 'en' ? 'Use voice commands effectively' : language === 'hi' ? 'आवाज़ कमांड का प्रभावी उपयोग करें' : 'ਆਵਾਜ਼ ਕਮਾਂਡ ਦੀ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਵਰਤੋਂ ਕਰੋ',
      duration: '4 min'
    },
    {
      id: 'consultation',
      title: language === 'en' ? 'Doctor Consultation' : language === 'hi' ? 'डॉक्टर परामर्श' : 'ਡਾਕਟਰ ਸਲਾਹ',
      icon: Phone,
      description: language === 'en' ? 'Book and attend consultations' : language === 'hi' ? 'परामर्श बुक करें और उपस्थित हों' : 'ਸਲਾਹ ਬੁੱਕ ਕਰੋ ਅਤੇ ਸ਼ਾਮਲ ਹੋਵੋ',
      duration: '5 min'
    },
    {
      id: 'emergency',
      title: language === 'en' ? 'Emergency Features' : language === 'hi' ? 'आपातकालीन सुविधाएं' : 'ਐਮਰਜੈਂਸੀ ਸੁਵਿਧਾਵਾਂ',
      icon: Shield,
      description: language === 'en' ? 'Using emergency alert and help' : language === 'hi' ? 'आपातकालीन अलर्ट और सहायता का उपयोग' : 'ਐਮਰਜੈਂਸੀ ਅਲਰਟ ਅਤੇ ਸਹਾਇਤਾ ਦੀ ਵਰਤੋਂ',
      duration: '3 min'
    }
  ];

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setShowTutorial(false)}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {language === 'en' ? 'App Tutorial' : language === 'hi' ? 'ऐप ट्यूटोरियल' : 'ਐਪ ਟਿਊਟੋਰਿਅਲ'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Learn how to use Nabha Sihata effectively' : language === 'hi' ? 'नभा सिहाता का प्रभावी उपयोग सीखें' : 'ਨਭਾ ਸਿਹਾਤਾ ਦੀ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਵਰਤੋਂ ਸਿੱਖੋ'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {tutorialSections.map((section) => (
              <Card key={section.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{section.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {section.duration}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      onClick={() => {
                        toast.info(
                          language === 'en' 
                            ? `Starting tutorial: ${section.title}` 
                            : language === 'hi' 
                            ? `ट्यूटोरियल शुरू: ${section.title}`
                            : `ਟਿਊਟੋਰਿਅਲ ਸ਼ੁਰੂ: ${section.title}`
                        );
                      }}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Watch Tutorial' : language === 'hi' ? 'ट्यूटोरियल देखें' : 'ਟਿਊਟੋਰਿਅਲ ਦੇਖੋ'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {}
          <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {language === 'en' ? 'Tutorial Features' : language === 'hi' ? 'ट्यूटोरियल की विशेषताएं' : 'ਟਿਊਟੋਰਿਅਲ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ'}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">
                  {language === 'en' ? 'Audio in Local Language' : language === 'hi' ? 'स्थानीय भाषा में ऑडियो' : 'ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਆਡੀਓ'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">
                  {language === 'en' ? 'Offline Viewing' : language === 'hi' ? 'ऑफलाइन देखना' : 'ਆਫਲਾਈਨ ਦੇਖਣਾ'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">
                  {language === 'en' ? 'Step-by-Step Guide' : language === 'hi' ? 'चरणबद्ध गाइड' : 'ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {language === 'en' ? 'Settings' : language === 'hi' ? 'सेटिंग्स' : 'ਸੈਟਿੰਗਾਂ'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Manage your app preferences' : language === 'hi' ? 'अपनी ऐप प्राथमिकताएं प्रबंधित करें' : 'ਆਪਣੀ ਐਪ ਤਰਜੀਹਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'Customer Support' : language === 'hi' ? 'ग्राहक सहायता' : 'ਗਾਹਕ ਸਹਾਇਤਾ'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 border-2 border-green-200 bg-green-50">
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {language === 'en' ? 'Call Support' : language === 'hi' ? 'कॉल सपोर्ट' : 'ਕਾਲ ਸਪੋਰਟ'}
                  </h3>
                  <p className="text-sm text-gray-600">{customerCareNumber}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Available 24/7 for payment issues, technical support, and general queries'
                  : language === 'hi'
                  ? 'भुगतान समस्याओं, तकनीकी सहायता और सामान्य प्रश्नों के लिए 24/7 उपलब्ध'
                  : 'ਭੁਗਤਾਨ ਸਮੱਸਿਆਵਾਂ, ਤਕਨੀਕੀ ਸਹਾਇਤਾ ਅਤੇ ਆਮ ਸਵਾਲਾਂ ਲਈ 24/7 ਉਪਲਬਧ'
                }
              </p>
              <Button onClick={handleCall} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Call Now' : language === 'hi' ? 'अभी कॉल करें' : 'ਹੁਣੇ ਕਾਲ ਕਰੋ'}
              </Button>
            </Card>

            <Card className="p-4 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center space-x-3 mb-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {language === 'en' ? 'SMS Support' : language === 'hi' ? 'SMS सपोर्ट' : 'SMS ਸਪੋਰਟ'}
                  </h3>
                  <p className="text-sm text-gray-600">{customerCareNumber}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Send us a message for quick support. Works offline too!'
                  : language === 'hi'
                  ? 'त्वरित सहायता के लिए हमें संदेश भेजें। ऑफलाइन भी काम करता है!'
                  : 'ਤੁਰੰਤ ਸਹਾਇਤਾ ਲਈ ਸਾਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ। ਆਫਲਾਈਨ ਵੀ ਕੰਮ ਕਰਦਾ ਹੈ!'
                }
              </p>
              <Button onClick={handleSMS} variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Send SMS' : language === 'hi' ? 'SMS भेजें' : 'SMS ਭੇਜੋ'}
              </Button>
            </Card>
          </div>

          {}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-3">
              {language === 'en' ? 'Common Support Topics:' : language === 'hi' ? 'सामान्य सहायता विषय:' : 'ਆਮ ਸਹਾਇਤਾ ਵਿਸ਼ੇ:'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {language === 'en' ? 'Payment Issues' : language === 'hi' ? 'भुगतान समस्याएं' : 'ਭੁਗਤਾਨ ਸਮੱਸਿਆਵਾਂ'}
              </Badge>
              <Badge variant="outline">
                {language === 'en' ? 'Account Problems' : language === 'hi' ? 'खाता समस्याएं' : 'ਖਾਤਾ ਸਮੱਸਿਆਵਾਂ'}
              </Badge>
              <Badge variant="outline">
                {language === 'en' ? 'Technical Support' : language === 'hi' ? 'तकनीकी सहायता' : 'ਤਕਨੀਕੀ ਸਹਾਇਤਾ'}
              </Badge>
              <Badge variant="outline">
                {language === 'en' ? 'Consultation Help' : language === 'hi' ? 'परामर्श सहायता' : 'ਸਲਾਹ ਸਹਾਇਤਾ'}
              </Badge>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'App Tutorial' : language === 'hi' ? 'ऐप ट्यूटोरियल' : 'ਐਪ ਟਿਊਟੋਰਿਅਲ'}
            </h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? 'Learn how to use all features of Nabha Sihata with step-by-step video tutorials in your language.'
              : language === 'hi'
              ? 'अपनी भाषा में चरणबद्ध वीडियो ट्यूटोरियल के साथ नभा सिहाता की सभी सुविधाओं का उपयोग करना सीखें।'
              : 'ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਕਦਮ-ਦਰ-ਕਦਮ ਵੀਡੀਓ ਟਿਊਟੋਰਿਅਲ ਨਾਲ ਨਭਾ ਸਿਹਾਤਾ ਦੀਆਂ ਸਾਰੀਆਂ ਸੁਵਿਧਾਵਾਂ ਦੀ ਵਰਤੋਂ ਸਿੱਖੋ।'
            }
          </p>
          
          <Button 
            onClick={() => setShowTutorial(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Start Tutorial' : language === 'hi' ? 'ट्यूटोरियल शुरू करें' : 'ਟਿਊਟੋਰਿਅਲ ਸ਼ੁਰੂ ਕਰੋ'}
          </Button>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'App Settings' : language === 'hi' ? 'ऐप सेटिंग्स' : 'ਐਪ ਸੈਟਿੰਗਾਂ'}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Language' : language === 'hi' ? 'भाषा' : 'ਭਾਸ਼ਾ'}
                </span>
              </div>
              <Badge>
                {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Notifications' : language === 'hi' ? 'अधिसूचनाएं' : 'ਸੂਚਨਾਵਾਂ'}
                </span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {language === 'en' ? 'Enabled' : language === 'hi' ? 'सक्षम' : 'ਸਮਰੱਥ'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Wifi className="w-5 h-5 text-gray-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Offline Mode' : language === 'hi' ? 'ऑफलाइन मोड' : 'ਆਫਲਾਈਨ ਮੋਡ'}
                </span>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {language === 'en' ? 'Available' : language === 'hi' ? 'उपलब्ध' : 'ਉਪਲਬਧ'}
              </Badge>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'About Nabha Sihata' : language === 'hi' ? 'नभा सिहाता के बारे में' : 'ਨਭਾ ਸਿਹਾਤਾ ਬਾਰੇ'}
            </h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? 'Nabha Sihata is designed specifically for rural healthcare, making quality medical services accessible to everyone in their local language.'
              : language === 'hi'
              ? 'नभा सिहाता विशेष रूप से ग्रामीण स्वास्थ्य देखभाल के लिए डिज़ाइन किया गया है, जो सभी के लिए उनकी स्थानीय भाषा में गुणवत्तापूर्ण चिकित्सा सेवाओं को सुलभ बनाता है।'
              : 'ਨਭਾ ਸਿਹਾਤਾ ਖਾਸ ਤੌਰ ਤੇ ਪੇਂਡੂ ਸਿਹਤ ਦੇਖਭਾਲ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਗਿਆ ਹੈ, ਜੋ ਸਭ ਲਈ ਉਨ੍ਹਾਂ ਦੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਗੁਣਵੱਤਾ ਵਾਲੀਆਂ ਡਾਕਟਰੀ ਸੇਵਾਵਾਂ ਨੂੰ ਪਹੁੰਚਯੋਗ ਬਣਾਉਂਦਾ ਹੈ।'
            }
          </p>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">v2.1.0</p>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'App Version' : language === 'hi' ? 'ऐप संस्करण' : 'ਐਪ ਵਰਜਨ'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">24/7</p>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Support Available' : language === 'hi' ? 'सहायता उपलब्ध' : 'ਸਹਾਇਤਾ ਉਪਲਬਧ'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}