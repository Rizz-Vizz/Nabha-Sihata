import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { Mic, MicOff, Volume2, Brain, AlertCircle } from 'lucide-react';

interface VoiceInterfaceProps {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onNavigate?: (panel: string) => void;
}


export function VoiceInterface({ isListening, setIsListening, onNavigate }: VoiceInterfaceProps) {
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { t, language } = useLanguage();
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support
  useEffect(() => {
    const checkSupport = () => {
      try {
        const hasRecognition = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
        setIsSupported(hasRecognition);
        console.log('🎤 Speech recognition supported:', hasRecognition);
      } catch {
        setIsSupported(false);
      }
    };
    checkSupport();
  }, []);

  
  const initializeSpeechRecognition = () => {
    if (!isSupported || recognitionRef.current) return recognitionRef.current;

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) return null;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        console.log('🎤 Speech result received:', event);
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          console.log('🎤 Final transcript:', finalTranscript);
          setTranscript(finalTranscript.trim());
          processVoiceCommand(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please speak clearly.');
            break;
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone access.');
            break;
          case 'network':
            setError('Network error. Please check your connection.');
            break;
          default:
            setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      return recognition;
    } catch (err) {
      console.error('🎤 Failed to initialize speech recognition:', err);
      setError('Failed to initialize speech recognition');
      return null;
    }
  };

  
  const commandPatterns = {
    en: {
      doctor: ['doctor', 'physician', 'consult', 'appointment', 'see doctor', 'medical consultation', 'talk to doctor', 'call doctor', 'consultation', 'book doctor'],
      emergency: ['emergency', 'urgent', 'ambulance', 'help', 'critical', 'serious', 'emergency call', 'need help', 'urgent help'],
      symptoms: ['symptoms', 'feeling sick', 'pain', 'headache', 'fever', 'stomach', 'check symptoms', 'what is wrong', 'not feeling well', 'sick', 'hurt', 'ache', 'symptom checker', 'ai symptoms'],
      healthcard: ['health card', 'medical card', 'records', 'medical history', 'profile', 'my card', 'card', 'id card'],
      hospitals: ['hospital', 'clinic', 'medical center', 'nearby hospital', 'find hospital', 'nearest hospital', 'hospital nearby', 'hospitals'],
      pharmacies: ['pharmacy', 'medical store', 'drug store', 'nearby pharmacy', 'pharmacy nearby', 'medicine shop', 'chemist', 'pharmacies', 'medicine'],
      appointments: ['appointment', 'booking', 'schedule', 'visit', 'my appointments', 'appointments', 'book appointment'],
      survey: ['survey', 'health survey', 'environment survey', 'cleanliness survey', 'environmental survey'],
      pregnancy: ['pregnancy', 'pregnant', 'prenatal', 'pregnancy care', 'baby', 'maternity'],
      supercoins: ['supercoins', 'coins', 'rewards', 'points', 'my coins', 'balance', 'reward points', 'super coins'],
      notifications: ['notifications', 'alerts', 'health alerts', 'messages', 'reminders', 'notification', 'alert'],
      records: ['records', 'medical records', 'my records', 'health records', 'history', 'medical history', 'record'],
      greeting: ['hello', 'hi', 'namaste', 'how are you', 'good morning', 'good evening', 'hey']
    },
    hi: {
      doctor: ['डॉक्टर', 'चिकित्सक', 'इलाज', 'डॉक्टर से मिलना', 'सलाह', 'डॉक्टर को दिखाना', 'चिकित्सक से बात', 'चिकित्सक से मिलना', 'कंसल्टेशन', 'डॉक्टर बुक'],
      emergency: ['इमरजेंसी', 'आपातकाल', 'एम्बुलेंस', 'मदद', 'गंभीर', 'तुरंत', 'मदद चाहिए', 'आपातकालीन', 'तुरंत मदद'],
      symptoms: ['लक्षण', 'बीमारी', 'दर्द', 'सिरदर्द', 'बुखार', 'पेट दर्द', 'तकलीफ', 'बीमार', 'ठीक नहीं', 'परेशानी', 'सिम्पटम चेकर', 'ai लक्षण'],
      healthcard: ['स्वास्थ्य कार्ड', 'मेडिकल कार्ड', 'रिकॉर्ड', 'इतिहास', 'मेरा कार्ड', 'कार्ड', 'आईडी कार्ड'],
      hospitals: ['अस्पताल', 'क्लिनिक', 'चिकित्सा केंद्र', 'नजदीकी अस्पताल', 'हॉस्पिटल ढूंढो', 'नजदीकी अस्पताल', 'अस्पताल nearby', 'अस्पताल'],
      pharmacies: ['दवाखाना', 'मेडिकल स्टोर', 'नजदीकी दवाखाना', 'दवा की दुकान', 'केमिस्ट', 'दवाखाना', 'दवा'],
      appointments: ['अपॉइंटमेंट', 'समय', 'मुलाकात', 'मेरे अपॉइंटमेंट', 'अपॉइंटमेंट', 'बुक अपॉइंटमेंट'],
      survey: ['सर्वे', 'स्वास्थ्य सर्वेक्षण', 'पर्यावरण सर्वेक्षण', 'सफाई सर्वेक्षण', 'पर्यावरण सर्वेक्षण'],
      pregnancy: ['गर्भावस्था', 'प्रेग्नेंसी', 'गर्भ', 'प्रसवपूर्व देखभाल', 'बच्चा', 'मात्री'],
      supercoins: ['सुपरकॉइन्स', 'कॉइन्स', 'रिवार्ड्स', 'पॉइंट्स', 'मेरे कॉइन्स', 'बैलेंस', 'रिवार्ड पॉइंट्स', 'सुपरकॉइन्स'],
      notifications: ['नोटिफिकेशन', 'अलर्ट', 'स्वास्थ्य अलर्ट', 'संदेश', 'रिमाइंडर', 'नोटिफिकेशन', 'अलर्ट'],
      records: ['रिकॉर्ड', 'चिकित्सा रिकॉर्ड', 'मेरे रिकॉर्ड', 'स्वास्थ्य रिकॉर्ड', 'इतिहास', 'चिकित्सा इतिहास', 'रिकॉर्ड'],
      greeting: ['नमस्ते', 'हैलो', 'आप कैसे हैं', 'सुप्रभात', 'शुभ संध्या', 'नमस्कार']
    },
    pa: {
      doctor: ['ਡਾਕਟਰ', 'ਵੈਦ', 'ਇਲਾਜ', 'ਡਾਕਟਰ ਨਾਲ ਮਿਲਣਾ', 'ਸਲਾਹ', 'ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਉਣਾ', 'ਵੈਦ ਨੂੰ ਬੁਕਾਉਣਾ'],
      emergency: ['ਐਮਰਜੈਂਸੀ', 'ਫੌਰੀ', 'ਐਂਬੂਲੈਂਸ', 'ਮਦਦ', 'ਗੰਭੀਰ', 'ਮਦਦ ਚਾਹੀਦੀ', 'ਤੁਰੰਤ ਮਦਦ'],
      symptoms: ['ਲੱਛਣ', 'ਬਿਮਾਰੀ', 'ਦਰਦ', 'ਸਿਰ ਦਰਦ', 'ਬੁਖਾਰ', 'ਪੇਟ ਦਰਦ', 'ਬਿਮਾਰ', 'ਠੀਕ ਨਹੀਂ', 'ਪਰੇਸ਼ਾਨੀ', 'ਸਿਮ੍ਪਟਮ ਚੈਕਰ', 'ai ਲੱਛਣ'],
      healthcard: ['ਸਿਹਤ ਕਾਰਡ', 'ਮੈਡਿਕਲ ਕਾਰਡ', 'ਰਿਕਾਰਡ', 'ਮੇਰਾ ਕਾਰਡ', 'ਕਾਰਡ', 'ਆਈਡੀ ਕਾਰਡ'],
      hospitals: ['ਹਸਪਤਾਲ', 'ਕਲੀਨਿਕ', 'ਮੈਡਿਕਲ ਸੈਂਟਰ', 'ਨੇੜਲਾ ਹਸਪਤਾਲ', 'ਹਸਪਤਾਲ ਢੂੰਦੋ', 'ਨੇੜਲਾ ਹਸਪਤਾਲ', 'ਹਸਪਤਾਲ nearby', 'ਹਸਪਤਾਲ'],
      pharmacies: ['ਦਵਾਖਾਨਾ', 'ਮੈਡਿਕਲ ਸਟੋਰ', 'ਨੇੜਲਾ ਦਵਾਖਾਨਾ', 'ਦਵਾਈ ਦੀ ਦੁਕਾਨ', 'ਕੈਮਿਸਟ', 'ਦਵਾਖਾਨਾ', 'ਦਵਾ'],
      appointments: ['ਮੁਲਾਕਾਤ', 'ਸਮਾਂ', 'ਬੁਕਿੰਗ', 'ਮੇਰੇ ਅਪਾਇੰਟਮੈਂਟ', 'ਅਪਾਇੰਟਮੈਂਟ', 'ਬੁਕ ਅਪਾਇੰਟਮੈਂਟ'],
      survey: ['ਸਰਵੇ', 'ਸਿਹਤ ਸਰਵੇ', 'ਵਾਤਾਵਰਣ ਸਰਵੇ', 'ਸਫਾਈ ਸਰਵੇ', 'ਵਾਤਾਵਰਣ ਸਰਵੇ'],
      pregnancy: ['ਗਰਭ ਅਵਸਥਾ', 'ਪ੍ਰੈਗਨੈਂਸੀ', 'ਗਰਭ', 'ਪ੍ਰਸਵ ਪੂਰਵ ਦੇਖਭਾਲ', 'ਬੱਚਾ', 'ਮੈਤੀ'],
      supercoins: ['ਸੁਪਰਕੋਇਨਸ', 'ਕੋਇਨਸ', 'ਰਿਵਾਰਡਸ', 'ਪੋਇੰਟਸ', 'ਮੇਰੇ ਕੋਇਨਸ', 'ਬੈਲੈਂਸ', 'ਰਿਵਾਰਡ ਪੋਇੰਟਸ', 'ਸੁਪਰਕੋਇਨਸ'],
      notifications: ['ਨੋਟੀਫਿਕੇਸ਼ਨ', 'ਅਲਰਟ', 'ਸਿਹਤ ਅਲਰਟ', 'ਸੰਦੇਸ਼', 'ਰਿਮਾਇੰਡਰ', 'ਨੋਟੀਫਿਕੇਸ਼ਨ', 'ਅਲਰਟ'],
      records: ['ਰਿਕਾਰਡ', 'ਮੈਡਿਕਲ ਰਿਕਾਰਡ', 'ਮੇਰੇ ਰਿਕਾਰਡ', 'ਸਿਹਤ ਰਿਕਾਰਡ', 'ਇਤਿਹਾਸ', 'ਮੈਡਿਕਲ ਇਤਿਹਾਸ', 'ਰਿਕਾਰਡ'],
      greeting: ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਨਮਸਤੇ', 'ਕਿਵੇਂ ਹੋ', 'ਸੁਪ੍ਰਭਾਤ', 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ']
    }
  };

  
  const processVoiceCommand = (spokenText: string): void => {
    setIsProcessing(true);
    const lowerText = spokenText.toLowerCase();
    const patterns = commandPatterns[language as keyof typeof commandPatterns] || commandPatterns.en;
    
    
    const commandScores: { [key: string]: number } = {};
    
    Object.entries(patterns).forEach(([command, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += keyword.length; 
        }
      });
      commandScores[command] = score;
    });
    
    
    const bestCommand = Object.entries(commandScores).reduce((a, b) => 
      commandScores[a[0]] > commandScores[b[0]] ? a : b
    )[0];
    
    const commandConfidence = commandScores[bestCommand];
    
    
    if (commandConfidence > 0) {
      executeCommand(bestCommand, spokenText, commandConfidence);
    } else {
      
      handleUnknownCommand(spokenText);
    }
    
    setIsProcessing(false);
  };

  const executeCommand = (command: string, originalText: string, commandConfidence: number): void => {
    console.log('🎤 Executing voice command:', command, 'with confidence:', commandConfidence);
    
    const responses = {
      en: {
        doctor: "I'll help you find a doctor. Opening consultation booking...",
        emergency: "Emergency detected! Connecting you to emergency services immediately.",
        symptoms: "Let me help check your symptoms. Opening symptom checker...",
        healthcard: "Opening your health card with your medical information...",
        hospitals: "Finding nearby hospitals and clinics for you...",
        pharmacies: "Looking for nearby pharmacies and medical stores...",
        appointments: "Opening your appointments and bookings...",
        supercoins: "Opening your Supercoins rewards and balance...",
        notifications: "Checking your health alerts and notifications...",
        records: "Opening your medical records and history...",
        survey: "Opening health and environment survey...",
        pregnancy: "Opening pregnancy care section...",
        greeting: "Hello! I'm your health assistant. How can I help you today?"
      },
      hi: {
        doctor: "मैं आपको डॉक्टर खोजने में मदद करूंगा। कंसल्टेशन बुकिंग खोल रहा हूं...",
        emergency: "इमरजेंसी का पता चला! तुरंत आपातकालीन सेवाओं से जोड़ रहा हूं।",
        symptoms: "मैं आपके लक्षणों की जांच में मदद करूंगा। सिम्प्टम चेकर खोल रहा हूं...",
        healthcard: "आपकी मेडिकल जानकारी के साथ हेल्थ कार्ड खोल रहा हूं...",
        hospitals: "आपके लिए नजदीकी अस्पताल और क्लिनिक खोज रहा हूं...",
        pharmacies: "आपके लिए नजदीकी दवाखाने और मेडिकल स्टोर खोज रहा हूं...",
        appointments: "आपके अपॉइंटमेंट और बुकिंग खोल रहा हूं...",
        supercoins: "आपके सुपरकॉइन्स रिवार्ड्स और बैलेंस खोल रहा हूं...",
        notifications: "आपके स्वास्थ्य अलर्ट और नोटिफिकेशन देख रहा हूं...",
        records: "आपके मेडिकल रिकॉर्ड और इतिहास खोल रहा हूं...",
        survey: "स्वास्थ्य और पर्यावरण सर्वेक्षण खोल रहा हूं...",
        pregnancy: "गर्भावस्था देखभाल सेक्शन खोल रहा हूं...",
        greeting: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?"
      },
      pa: {
        doctor: "ਮੈਂ ਤੁਹਾਨੂੰ ਡਾਕਟਰ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗਾ। ਕੰਸਲਟੇਸ਼ਨ ਬੁਕਿੰਗ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        emergency: "ਐਮਰਜੈਂਸੀ ਦਾ ਪਤਾ ਲੱਗਾ! ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਜੋੜ ਰਿਹਾ ਹਾਂ।",
        symptoms: "ਮੈਂ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗਾ। ਸਿਮ੍ਪਟਮ ਚੈਕਰ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        healthcard: "ਤੁਹਾਡੀ ਮੈਡਿਕਲ ਜਾਣਕਾਰੀ ਦੇ ਨਾਲ ਹੈਲਥ ਕਾਰਡ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        hospitals: "ਤੁਹਾਡੇ ਲਈ ਨੇੜਲੇ ਹਸਪਤਾਲ ਅਤੇ ਕਲੀਨਿਕ ਲੱਭ ਰਿਹਾ ਹਾਂ...",
        pharmacies: "ਤੁਹਾਡੇ ਲਈ ਨੇੜਲੇ ਦਵਾਖਾਨੇ ਅਤੇ ਮੈਡਿਕਲ ਸਟੋਰ ਲੱਭ ਰਿਹਾ ਹਾਂ...",
        appointments: "ਤੁਹਾਡੇ ਅਪਾਇੰਟਮੈਂਟ ਅਤੇ ਬੁਕਿੰਗ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        supercoins: "ਤੁਹਾਡੇ ਸੁਪਰਕੋਇਨਸ ਰਿਵਾਰਡਸ ਅਤੇ ਬੈਲੈਂਸ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        notifications: "ਤੁਹਾਡੇ ਸਿਹਤ ਅਲਰਟ ਅਤੇ ਨੋਟੀਫਿਕੇਸ਼ਨ ਵੇਖ ਰਿਹਾ ਹਾਂ...",
        records: "ਤੁਹਾਡੇ ਮੈਡਿਕਲ ਰਿਕਾਰਡ ਅਤੇ ਇਤਿਹਾਸ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        survey: "ਸਿਹਤ ਅਤੇ ਵਾਤਾਵਰਣ ਸਰਵੇ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        pregnancy: "ਗਰਭ ਅਵਸਥਾ ਦੇਖਭਾਲ ਸੈਕਸ਼ਨ ਖੋਲ ਰਿਹਾ ਹਾਂ...",
        greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?"
      }
    };

    const responseText = responses[language as keyof typeof responses]?.[command as keyof typeof responses.en] || 
                        responses.en[command as keyof typeof responses.en];
    
    setResponse(responseText);
    speakResponse(responseText);
    
    
    if (onNavigate) {
      console.log('🎤 Navigating to panel:', command);
      setTimeout(() => {
        switch (command) {
          case 'doctor':
            onNavigate('consultation');
            break;
          case 'emergency':
            onNavigate('emergency');
            break;
          case 'symptoms':
            onNavigate('voice-symptoms'); 
            break;
          case 'healthcard':
            onNavigate('healthcard');
            break;
          case 'hospitals':
            onNavigate('hospitals');
            break;
          case 'pharmacies':
            onNavigate('pharmacies');
            break;
          case 'appointments':
            onNavigate('appointments');
            break;
          case 'survey':
            onNavigate('survey');
            break;
          case 'pregnancy':
            onNavigate('pregnancy');
            break;
          case 'supercoins':
            onNavigate('supercoins');
            break;
          case 'notifications':
            onNavigate('notifications');
            break;
          case 'records':
            onNavigate('medical-records');
            break;
        }
      }, 2000);
    }
  };

  const handleUnknownCommand = (spokenText: string): void => {
    const responses = {
      en: "I didn't understand that. You can say things like 'I need a doctor', 'emergency help', 'check symptoms', or 'show health card'.",
      hi: "मैं समझ नहीं पाया। आप 'मुझे डॉक्टर चाहिए', 'इमरजेंसी की मदद', 'लक्षण जांचें', या 'हेल्थ कार्ड दिखाएं' जैसी बातें कह सकते हैं।",
      pa: "ਮੈਂ ਸਮਝ ਨਹੀਂ ਸਿਆ। ਤੁਸੀਂ 'ਮੈਨੂੰ ਡਾਕਟਰ ਚਾਹੀਦਾ ਹੈ', 'ਐਮਰਜੈਂਸੀ ਦੀ ਮਦਦ', 'ਲੱਛਣ ਜਾਂਚੋ', ਜਾਂ 'ਹੈਲਥ ਕਾਰਡ ਦਿਖਾਓ' ਵਰਗੀਆਂ ਗੱਲਾਂ ਕਹਿ ਸਕਦੇ ਹੋ।"
    };
    
    const responseText = responses[language as keyof typeof responses] || responses.en;
    setResponse(responseText);
    speakResponse(responseText);
  };

  const startListening = async (): Promise<void> => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      console.log('🎤 Starting speech recognition...');
      setError(null);
      setTranscript('');
      
      if (!recognitionRef.current) {
        const recognition = initializeSpeechRecognition();
        if (!recognition) {
          setError('Failed to initialize speech recognition.');
          return;
        }
      }

      // Update language
      const currentLang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
      if (recognitionRef.current.lang !== currentLang) {
        recognitionRef.current.lang = currentLang;
      }

      recognitionRef.current.start();

      
      timeoutRef.current = setTimeout(() => {
        console.log('🎤 Speech recognition timeout');
        stopListening();
        setError('Speech recognition timed out. Please try again.');
      }, 15000);
      
    } catch (err: any) {
      console.error('🎤 Failed to start speech recognition:', err);
      setError(`Failed to start speech recognition: ${err.message}`);
      setIsListening(false);
    }
  };

  const stopListening = (): void => {
    try {
      console.log('🎤 Stopping speech recognition...');
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      console.warn('🎤 Error stopping recognition:', err);
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsListening(false);
  };

  const speakResponse = (text: string): void => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-green-600" />
          {t('voiceHelp')}
        </h3>
        <div className="flex space-x-2">
          {!isSupported && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              {language === 'en' ? 'Not Supported' : language === 'hi' ? 'समर्थित नहीं' : 'ਸਮਰਥਿਤ ਨਹੀਂ'}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => response && speakResponse(response)}
            disabled={!response}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            {error.includes('denied') && (
              <Button
                variant="outline"
                size="sm"
                onClick={startListening}
                className="text-xs"
              >
                {language === 'en' ? 'Try Again' : 
                 language === 'hi' ? 'फिर कोशिश करें' : 
                 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ'}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <Button
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`w-20 h-20 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
                : 'bg-green-500 hover:bg-green-600 shadow-md'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
          
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {isListening 
            ? (language === 'en' ? 'Listening... Speak now' : 
               language === 'hi' ? 'सुन रहा हूं... अब बोलें' : 
               'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਹੁਣ ਬੋਲੋ')
            : isProcessing 
            ? (language === 'en' ? 'Processing...' : 
               language === 'hi' ? 'प्रोसेसिंग...' : 
               'ਪ੍ਰੋਸੈਸਿੰਗ...')
            : (language === 'en' ? 'Tap to speak' : 
               language === 'hi' ? 'बोलने के लिए टैप करें' : 
               'ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ')
          }
        </p>
        
        {transcript && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-3">
            <div className="flex items-start">
              <Mic className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">
                  {language === 'en' ? 'You said:' : 
                   language === 'hi' ? 'आपने कहा:' : 
                   'ਤੁਸੀਂ ਕਿਹਾ:'}
                </p>
                <p className="text-sm text-blue-800">{transcript}</p>
              </div>
            </div>
          </div>
        )}
        
        {response && (
          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
            <div className="flex items-start">
              <Brain className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="text-xs text-green-600 font-medium mb-1">
                  {language === 'en' ? 'AI Response:' : 
                   language === 'hi' ? 'AI जवाब:' : 
                   'AI ਜਵਾਬ:'}
                </p>
                <p className="text-sm text-green-800">{response}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white p-2 rounded border border-gray-200 text-center">
          <span className="text-gray-600">
            {language === 'en' ? '🩺 "Doctor"' : 
             language === 'hi' ? '🩺 "डॉक्टर"' : 
             '🩺 "ਡਾਕਟਰ"'}
          </span>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200 text-center">
          <span className="text-gray-600">
            {language === 'en' ? '🚨 "Emergency"' : 
             language === 'hi' ? '🚨 "इमरजेंसी"' : 
             '🚨 "ਐਮਰਜੈਂਸੀ"'}
          </span>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200 text-center">
          <span className="text-gray-600">
            {language === 'en' ? '🤒 "Symptoms"' : 
             language === 'hi' ? '🤒 "लक्षण"' : 
             '🤒 "ਲੱਛਣ"'}
          </span>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200 text-center">
          <span className="text-gray-600">
            {language === 'en' ? '🏥 "Hospital"' : 
             language === 'hi' ? '🏥 "अस्पताल"' : 
             '🏥 "ਹਸਪਤਾਲ"'}
          </span>
        </div>
      </div>

      {}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          {language === 'en' ? 'AI-powered • Natural speech in English, Hindi & Punjabi' : 
           language === 'hi' ? 'AI-संचालित • अंग्रेजी, हिंदी और पंजाबी में प्राकृतिक भाषण' : 
           'AI-ਸੰਚਾਲਿਤ • ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਕੁਦਰਤੀ ਭਾਸ਼ਣ'}
        </p>
        {isSupported && (
          <div className="flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs text-green-600">
              {language === 'en' ? 'Voice recognition ready' : 
               language === 'hi' ? 'वॉयस रिकग्निशन तैयार' : 
               'ਵਾਇਸ ਰਿਕਗਨਿਸ਼ਨ ਤਿਆਰ'}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}