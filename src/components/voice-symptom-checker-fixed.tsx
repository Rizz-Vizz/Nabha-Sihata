import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { ConsultationNavigator } from './consultation-navigator';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Brain, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Stethoscope,
  UserCheck
} from 'lucide-react';

interface VoiceSymptomCheckerProps {
  onBack: () => void;
  onConsultDoctor?: (symptomData: any) => void;
}

interface SymptomAnalysis {
  symptom: string;
  confidence: number;
  severity: string;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export function VoiceSymptomChecker({ onBack, onConsultDoctor }: VoiceSymptomCheckerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { t, language } = useLanguage();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSupportsSpeechRecognition(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      
      
      if (language === 'hi') {
        recognitionRef.current.lang = 'hi-IN';
      } else if (language === 'pa') {
        recognitionRef.current.lang = 'pa-IN';
      } else {
        recognitionRef.current.lang = 'en-IN';
      }
      
      recognitionRef.current.onstart = () => {
        setError('');
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          analyzeSymptoms(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        let errorMessage = 'Speech recognition error: ';
        switch (event.error) {
          case 'not-allowed':
            errorMessage += 'Microphone access denied. Please allow microphone access in your browser settings.';
            break;
          case 'no-speech':
            errorMessage += 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage += 'No microphone found or audio capture failed.';
            break;
          case 'network':
            errorMessage += 'Network error. Please check your internet connection.';
            break;
          case 'aborted':
            errorMessage += 'Speech recognition was stopped.';
            break;
          case 'bad-grammar':
            errorMessage += 'Grammar error in speech recognition.';
            break;
          default:
            errorMessage += event.error;
        }
        setError(errorMessage);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  
  const symptomPatterns = {
    en: {
      fever: {
        keywords: ['fever', 'hot', 'temperature', 'burning', 'chills', 'shivering'],
        severity: {
          mild: ['slight fever', 'little hot', 'warm'],
          moderate: ['fever', 'high temperature'],
          severe: ['very high fever', 'burning hot', 'shivering badly']
        }
      },
      headache: {
        keywords: ['headache', 'head pain', 'migraine', 'head hurts'],
        severity: {
          mild: ['slight headache', 'little pain'],
          moderate: ['headache', 'head pain'],
          severe: ['severe headache', 'terrible pain', 'migraine']
        }
      },
      stomach: {
        keywords: ['stomach pain', 'belly ache', 'nausea', 'vomiting', 'diarrhea'],
        severity: {
          mild: ['little stomach pain', 'slight nausea'],
          moderate: ['stomach ache', 'feeling sick'],
          severe: ['severe pain', 'vomiting badly', 'terrible ache']
        }
      },
      cold: {
        keywords: ['cold', 'cough', 'runny nose', 'sneezing', 'blocked nose'],
        severity: {
          mild: ['little cold', 'slight cough'],
          moderate: ['cold', 'cough', 'runny nose'],
          severe: ['bad cold', 'terrible cough', 'cannot breathe']
        }
      }
    },
    hi: {
      fever: {
        keywords: ['बुखार', 'गर्मी', 'तेज़ बुखार', 'ठंड लगना', 'कांपना'],
        severity: {
          mild: ['हल्का बुखार', 'थोड़ी गर्मी'],
          moderate: ['बुखार', 'तेज़ बुखार'],
          severe: ['बहुत तेज़ बुखार', 'बुरी तरह कांपना']
        }
      },
      headache: {
        keywords: ['सिरदर्द', 'सिर में दर्द', 'माइग्रेन', 'सिर दुखना'],
        severity: {
          mild: ['हल्का सिरदर्द', 'थोड़ा दर्द'],
          moderate: ['सिरदर्द', 'सिर में दर्द'],
          severe: ['भयानक सिरदर्द', 'तेज़ दर्द']
        }
      },
      stomach: {
        keywords: ['पेट दर्द', 'पेट में दर्द', 'उल्टी', 'दस्त', 'मतली'],
        severity: {
          mild: ['हल्का पेट दर्द', 'थोड़ी मतली'],
          moderate: ['पेट दर्द', 'बीमार महसूस'],
          severe: ['भयानक दर्द', 'बुरी तरह उल्टी']
        }
      },
      cold: {
        keywords: ['सर्दी', 'खांसी', 'नाक बहना', 'छींक', 'नाक बंद'],
        severity: {
          mild: ['हल्की सर्दी', 'थोड़ी खांसी'],
          moderate: ['सर्दी', 'खांसी'],
          severe: ['बुरी सर्दी', 'भयानक खांसी']
        }
      }
    },
    pa: {
      fever: {
        keywords: ['ਬੁਖਾਰ', 'ਗਰਮੀ', 'ਠੰਡ ਲੱਗਣਾ', 'ਕੰਬਣਾ'],
        severity: {
          mild: ['ਹਲਕਾ ਬੁਖਾਰ', 'ਥੋੜੀ ਗਰਮੀ'],
          moderate: ['ਬੁਖਾਰ', 'ਤੇਜ਼ ਬੁਖਾਰ'],
          severe: ['ਬਹੁਤ ਤੇਜ਼ ਬੁਖਾਰ', 'ਬੁਰੀ ਤਰ੍ਹਾਂ ਕੰਬਣਾ']
        }
      },
      headache: {
        keywords: ['ਸਿਰ ਦਰਦ', 'ਸਿਰ ਵਿਚ ਦਰਦ', 'ਸਿਰ ਦੁਖਣਾ'],
        severity: {
          mild: ['ਹਲਕਾ ਸਿਰ ਦਰਦ', 'ਥੋੜਾ ਦਰਦ'],
          moderate: ['ਸਿਰ ਦਰਦ', 'ਸਿਰ ਵਿਚ ਦਰਦ'],
          severe: ['ਭਿਆਨਕ ਸਿਰ ਦਰਦ', 'ਤੇਜ਼ ਦਰਦ']
        }
      },
      stomach: {
        keywords: ['ਢਿੱਡ ਦਰਦ', 'ਪੇਟ ਦਰਦ', 'ਉਲਟੀ', 'ਦਸਤ'],
        severity: {
          mild: ['ਹਲਕਾ ਢਿੱਡ ਦਰਦ'],
          moderate: ['ਢਿੱਡ ਦਰਦ'],
          severe: ['ਭਿਆਨਕ ਦਰਦ', 'ਬੁਰੀ ਤਰ੍ਹਾਂ ਉਲਟੀ']
        }
      },
      cold: {
        keywords: ['ਠੰਡ', 'ਖੰਘ', 'ਨੱਕ ਵਗਣਾ', 'ਛਿੱਕ'],
        severity: {
          mild: ['ਹਲਕੀ ਠੰਡ', 'ਥੋੜੀ ਖੰਘ'],
          moderate: ['ਠੰਡ', 'ਖੰਘ'],
          severe: ['ਬੁਰੀ ਠੰਡ', 'ਭਿਆਨਕ ਖੰਘ']
        }
      }
    }
  };

  
  const getRecommendedDoctorId = (symptomType: string, severity: string) => {
    switch (symptomType) {
      case 'chest_pain':
      case 'heart':
        return 'dr-amarjeet'; 
      case 'pregnancy':
      case 'womens_health':
        return 'dr-arshpreet'; 
      case 'joint_pain':
      case 'bone':
        return 'dr-rajveer'; 
      case 'skin':
        return 'dr-anmolpreet'; 
      case 'child':
      case 'pediatric':
        return 'dr-sukhjeet'; 
      default:
        
        return 'dr-simran'; 
    }
  };

  const createDiagnosisObject = (symptomType: string, severity: string) => {
    const diagnosisNames = {
      en: {
        fever: 'Common Viral Fever / Seasonal Flu',
        headache: 'Tension Headache / Dehydration',
        stomach: 'Indigestion / Mild Gastritis',
        cold: 'Common Cold / Upper Respiratory Infection'
      },
      hi: {
        fever: 'सामान्य वायरल बुखार / मौसमी फ्लू',
        headache: 'तनाव सिरदर्द / निर्जलीकरण',
        stomach: 'अपच / हल्का गैस्ट्राइटिस',
        cold: 'सामान्य सर्दी / ऊपरी श्वसन संक्रमण'
      },
      pa: {
        fever: 'ਆਮ ਵਾਇਰਲ ਬੁਖਾਰ / ਮੌਸਮੀ ਫਲੂ',
        headache: 'ਤਣਾਅ ਸਿਰ ਦਰਦ / ਪਾਣੀ ਦੀ ਕਮੀ',
        stomach: 'ਅਪਚ / ਹਲਕਾ ਗੈਸਟ੍ਰਾਇਟਿਸ',
        cold: 'ਆਮ ਠੰਡ / ਉੱਪਰੀ ਸਾਹ ਇਨਫੈਕਸ਼ਨ'
      }
    };

    return {
      name: diagnosisNames[language as keyof typeof diagnosisNames]?.[symptomType as keyof typeof diagnosisNames.en] || 
            diagnosisNames.en[symptomType as keyof typeof diagnosisNames.en] || 
            'General Health Concern',
      severity: severity,
      urgency: severity === 'severe',
      selectedSymptom: symptomType,
      category: 'general'
    };
  };

  const analyzeSymptoms = (spokenText: string) => {
    setIsProcessing(true);
    const lowerText = spokenText.toLowerCase();
    const patterns = symptomPatterns[language as keyof typeof symptomPatterns] || symptomPatterns.en;
    
    let bestMatch: any = null;
    let highestScore = 0;
    let detectedSeverity = 'mild';
    
    
    Object.entries(patterns).forEach(([symptomType, config]) => {
      let score = 0;
      
      
      config.keywords.forEach((keyword: string) => {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += keyword.length;
        }
      });
      
      
      Object.entries(config.severity).forEach(([severity, keywords]) => {
        keywords.forEach((keyword: string) => {
          if (lowerText.includes(keyword.toLowerCase())) {
            score += keyword.length * 1.5; 
            detectedSeverity = severity;
          }
        });
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { type: symptomType, score, severity: detectedSeverity };
      }
    });
    
    if (bestMatch) {
      generateAnalysis(bestMatch.type, bestMatch.severity, highestScore);
    } else {
      generateGeneralAnalysis(spokenText);
    }
    
    setIsProcessing(false);
  };

  const generateAnalysis = (symptomType: string, severity: string, confidence: number) => {
    const recommendations = {
      en: {
        fever: {
          mild: [
            'Take paracetamol (500mg) if needed',
            'Drink plenty of fluids like water, ORS',
            'Take rest and avoid heavy work',
            'Eat light foods like khichdi, dal rice'
          ],
          moderate: [
            'Take paracetamol every 6 hours',
            'Apply cold compress on forehead',
            'Drink ORS solution regularly',
            'See a doctor if fever continues for 3 days'
          ],
          severe: [
            'See a doctor immediately',
            'Take paracetamol and sponge with cool water',
            'Drink lots of fluids',
            'Go to hospital if temperature above 103°F'
          ]
        },
        headache: {
          mild: [
            'Take rest in a quiet, dark room',
            'Apply cold compress on forehead',
            'Drink water - you might be dehydrated',
            'Take paracetamol if needed'
          ],
          moderate: [
            'Take paracetamol (500mg)',
            'Rest and avoid screens',
            'Try gentle head massage',
            'See doctor if headache persists'
          ],
          severe: [
            'See a doctor immediately',
            'Take prescribed pain medication',
            'Rest completely',
            'Go to hospital if severe with fever or vision problems'
          ]
        },
        stomach: {
          mild: [
            'Drink ORS solution slowly',
            'Eat light foods like banana, rice',
            'Avoid spicy and oily foods',
            'Take rest'
          ],
          moderate: [
            'Take ORS frequently',
            'Eat only khichdi, banana, curd rice',
            'Take tablet for acidity if needed',
            'See doctor if no improvement in 2 days'
          ],
          severe: [
            'See a doctor immediately',
            'Drink ORS frequently',
            'Go to hospital if severe vomiting or blood in stool',
            'Take only liquids until you see doctor'
          ]
        },
        cold: {
          mild: [
            'Take steam inhalation 2-3 times daily',
            'Drink warm water with honey and lemon',
            'Take rest and sleep well',
            'Eat warm foods'
          ],
          moderate: [
            'Take steam with eucalyptus oil',
            'Use saline nasal drops',
            'Take cough syrup if needed',
            'See doctor if no improvement in 5 days'
          ],
          severe: [
            'See a doctor',
            'Take prescribed medications',
            'Use steam and warm gargles',
            'Go to hospital if breathing difficulty'
          ]
        }
      },
      hi: {
        fever: {
          mild: [
            'जरूरत पड़ने पर पैरासिटामोल (500mg) लें',
            'पानी, ORS जैसे तरल पदार्थ पिएं',
            'आराम करें और भारी काम से बचें',
            'खिचड़ी, दाल चावल जैसा हल्का खाना खाएं'
          ],
          moderate: [
            'हर 6 घंटे में पैरासिटामोल लें',
            'माथे पर ठंडी पट्टी रखें',
            'नियमित रूप से ORS पिएं',
            '3 दिन तक बुखार रहे तो डॉक्टर को दिखाएं'
          ],
          severe: [
            'तुरंत डॉक्टर को दिखाएं',
            'पैरासिटामोल लें और ठंडे पानी से पोंछें',
            'बहुत सारे तरल पदार्थ पिएं',
            '103°F से ज्यादा बुखार हो तो अस्पताल जाएं'
          ]
        },
        headache: {
          mild: [
            'शांत, अंधेरे कमरे में आराम करें',
            'माथे पर ठंडी पट्टी लगाएं',
            'पानी पिएं - आप डिहाइड्रेटेड हो सकते हैं',
            'जरूरत पड़ने पर पैरासिटामोल लें'
          ],
          moderate: [
            'पैरासिटामोल (500mg) लें',
            'आराम करें और स्क्रीन से बचें',
            'हल्की सिर की मालिश करें',
            'सिरदर्द बना रहे तो डॉक्टर को दिखाएं'
          ],
          severe: [
            'तुरंत डॉक्टर को दिखाएं',
            'दर्द की दवा लें',
            'पूरा आराम करें',
            'बुखार या नजर की समस्या हो तो अस्पताल जाएं'
          ]
        },
        stomach: {
          mild: [
            'धीरे-धीरे ORS घोल पिएं',
            'केला, चावल जैसा हल्का खाना खाएं',
            'मसालेदार और तेल वाला खाना न खाएं',
            'आराम करें'
          ],
          moderate: [
            'बार-बार ORS पिएं',
            'केवल खिचड़ी, केला, दही चावल खाएं',
            'एसिडिटी की दवा लें',
            '2 दिन में सुधार न हो तो डॉक्टर को दिखाएं'
          ],
          severe: [
            'तुरंत डॉक्टर को दिखाएं',
            'बार-बार ORS पिएं',
            'तेज उल्टी या मल में खून हो तो अस्पताल जाएं',
            'डॉक्टर दिखाने तक केवल तरल पदार्थ लें'
          ]
        },
        cold: {
          mild: [
            'दिन में 2-3 बार भाप लें',
            'शहद-नींबू के साथ गर्म पानी पिएं',
            'आराम करें और अच्छी नींद लें',
            'गर्म खाना खाएं'
          ],
          moderate: [
            'नीलगिरी तेल के साथ भाप लें',
            'नमकीन पानी की बूंदें नाक में डालें',
            'जरूरत पड़ने पर खांसी की दवा लें',
            '5 दिन में सुधार न हो तो डॉक्टर को दिखाएं'
          ],
          severe: [
            'डॉक्टर को दिखाएं',
            'डॉक्टर की दी गई दवा लें',
            'भाप और गर्म पानी से गरारे करें',
            'सांस लेने में दिक्कत हो तो अस्पताल जाएं'
          ]
        }
      },
      pa: {
        fever: {
          mild: [
            'ਲੋੜ ਪੈਣ ਤੇ ਪੈਰਾਸਿਟਾਮੋਲ (500mg) ਲਓ',
            'ਪਾਣੀ, ORS ਵਰਗੇ ਤਰਲ ਪਦਾਰਥ ਪੀਓ',
            'ਆਰਾਮ ਕਰੋ ਅਤੇ ਭਾਰੇ ਕੰਮ ਤੋਂ ਬਚੋ',
            'ਖਿਚੜੀ, ਦਾਲ ਚਾਵਲ ਵਰਗਾ ਹਲਕਾ ਖਾਣਾ ਖਾਓ'
          ],
          moderate: [
            'ਹਰ 6 ਘੰਟੇ ਬਾਅਦ ਪੈਰਾਸਿਟਾਮੋਲ ਲਓ',
            'ਮੱਥੇ ਤੇ ਠੰਡੀ ਪੱਟੀ ਰੱਖੋ',
            'ਨਿਯਮਿਤ ਰੂਪ ਵਿਚ ORS ਪੀਓ',
            '3 ਦਿਨ ਤਕ ਬੁਖਾਰ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ'
          ],
          severe: [
            'ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ',
            'ਪੈਰਾਸਿਟਾਮੋਲ ਲਓ ਅਤੇ ਠੰਡੇ ਪਾਣੀ ਨਾਲ ਪੁੰਝੋ',
            'ਬਹੁਤ ਸਾਰੇ ਤਰਲ ਪਦਾਰਥ ਪੀਓ',
            '103°F ਤੋਂ ਜ਼ਿਆਦਾ ਬੁਖਾਰ ਹੋਵੇ ਤਾਂ ਹਸਪਤਾਲ ਜਾਓ'
          ]
        },
        headache: {
          mild: [
            'ਸ਼ਾਂਤ, ਹਨੇਰੇ ਕਮਰੇ ਵਿਚ ਆਰਾਮ ਕਰੋ',
            'ਮੱਥੇ ਤੇ ਠੰਡੀ ਪੱਟੀ ਲਗਾਓ',
            'ਪਾਣੀ ਪੀਓ - ਤੁਸੀਂ ਡਿਹਾਈਡਰੇਟਿਡ ਹੋ ਸਕਦੇ ਹੋ',
            'ਲੋੜ ਪੈਣ ਤੇ ਪੈਰਾਸਿਟਾਮੋਲ ਲਓ'
          ],
          moderate: [
            'ਪੈਰਾਸਿਟਾਮੋਲ (500mg) ਲਓ',
            'ਆਰਾਮ ਕਰੋ ਅਤੇ ਸਕ੍ਰੀਨ ਤੋਂ ਬਚੋ',
            'ਹਲਕੀ ਸਿਰ ਦੀ ਮਸਾਜ ਕਰੋ',
            'ਸਿਰ ਦਰਦ ਬਣਿਆ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ'
          ],
          severe: [
            'ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ',
            'ਦਰਦ ਦੀ ਦਵਾਈ ਲਓ',
            'ਪੂਰਾ ਆਰਾਮ ਕਰੋ',
            'ਬੁਖਾਰ ਜਾਂ ਅੱਖਾਂ ਦੀ ਸਮੱਸਿਆ ਹੋਵੇ ਤਾਂ ਹਸਪਤਾਲ ਜਾਓ'
          ]
        },
        stomach: {
          mild: [
            'ਹੌਲੀ-ਹੌਲੀ ORS ਘੋਲ ਪੀਓ',
            'ਕੇਲਾ, ਚਾਵਲ ਵਰਗਾ ਹਲਕਾ ਖਾਣਾ ਖਾਓ',
            'ਮਸਾਲੇਦਾਰ ਅਤੇ ਤੇਲ ਵਾਲਾ ਖਾਣਾ ਨਾ ਖਾਓ',
            'ਆਰਾਮ ਕਰੋ'
          ],
          moderate: [
            'ਵਾਰ-ਵਾਰ ORS ਪੀਓ',
            'ਸਿਰਫ਼ ਖਿਚੜੀ, ਕੇਲਾ, ਦਹੀਂ ਚਾਵਲ ਖਾਓ',
            'ਐਸਿਡਿਟੀ ਦੀ ਦਵਾਈ ਲਓ',
            '2 ਦਿਨ ਵਿਚ ਸੁਧਾਰ ਨਾ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ'
          ],
          severe: [
            'ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ',
            'ਵਾਰ-ਵਾਰ ORS ਪੀਓ',
            'ਤੇਜ਼ ਉਲਟੀ ਜਾਂ ਮਲ ਵਿਚ ਖੂਨ ਹੋਵੇ ਤਾਂ ਹਸਪਤਾਲ ਜਾਓ',
            'ਡਾਕਟਰ ਦਿਖਾਉਣ ਤਕ ਸਿਰਫ਼ ਤਰਲ ਪਦਾਰਥ ਲਓ'
          ]
        },
        cold: {
          mild: [
            'ਦਿਨ ਵਿਚ 2-3 ਵਾਰ ਭਾਫ਼ ਲਓ',
            'ਸ਼ਹਿਦ-ਨਿੰਬੂ ਦੇ ਨਾਲ ਗਰਮ ਪਾਣੀ ਪੀਓ',
            'ਆਰਾਮ ਕਰੋ ਅਤੇ ਚੰਗੀ ਨੀਂਦ ਲਓ',
            'ਗਰਮ ਖਾਣਾ ਖਾਓ'
          ],
          moderate: [
            'ਨੀਲਗਿਰੀ ਤੇਲ ਦੇ ਨਾਲ ਭਾਫ਼ ਲਓ',
            'ਨਮਕੀਨ ਪਾਣੀ ਦੀਆਂ ਬੂੰਦਾਂ ਨੱਕ ਵਿਚ ਪਾਓ',
            'ਲੋੜ ਪੈਣ ਤੇ ਖੰਘ ਦੀ ਦਵਾਈ ਲਓ',
            '5 ਦਿਨ ਵਿਚ ਸੁਧਾਰ ਨਾ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ'
          ],
          severe: [
            'ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ',
            'ਡਾਕਟਰ ਦੀ ਦਿੱਤੀ ਦਵਾਈ ਲਓ',
            'ਭਾਫ਼ ਅਤੇ ਗਰਮ ਪਾਣੀ ਨਾਲ ਗਰਾਰੇ ਕਰੋ',
            'ਸਾਹ ਲੈਣ ਵਿਚ ਮੁਸ਼ਕਲ ਹੋਵੇ ਤਾਂ ਹਸਪਤਾਲ ਜਾਓ'
          ]
        }
      }
    };

    const symptomRecommendations = recommendations[language as keyof typeof recommendations]?.[symptomType as keyof typeof recommendations.en]?.[severity as keyof typeof recommendations.en.fever] || 
                                  recommendations.en[symptomType as keyof typeof recommendations.en]?.[severity as keyof typeof recommendations.en.fever] || [];

    const urgencyLevel = severity === 'severe' ? 'high' : severity === 'moderate' ? 'medium' : 'low';

    setAnalysis({
      symptom: transcript,
      confidence: Math.min(confidence / 10 * 100, 95), 
      severity,
      recommendations: symptomRecommendations,
      urgency: urgencyLevel
    });

    
    if (symptomRecommendations.length > 0) {
      const responseText = language === 'en' 
        ? `Based on your symptoms, here's what I recommend: ${symptomRecommendations[0]}`
        : language === 'hi'
        ? `आपके लक्षणों के आधार पर, मैं यह सलाह देता हूं: ${symptomRecommendations[0]}`
        : `ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ ਤੇ, ਮੈਂ ਇਹ ਸਲਾਹ ਦਿੰਦਾ ਹਾਂ: ${symptomRecommendations[0]}`;
      
      speakResponse(responseText);
    }
  };

  const generateGeneralAnalysis = (spokenText: string) => {
    const generalResponses = {
      en: [
        'I understand you\'re not feeling well. Please describe your main symptoms like fever, pain, or other discomfort.',
        'Can you tell me more about what you\'re experiencing? For example, do you have fever, headache, or stomach pain?',
        'I\'m here to help. Please describe your symptoms clearly so I can provide better guidance.'
      ],
      hi: [
        'मैं समझता हूं कि आप ठीक महसूस नहीं कर रहे। कृपया अपने मुख्य लक्षण बताएं जैसे बुखार, दर्द, या अन्य परेशानी।',
        'आप क्या महसूस कर रहे हैं, कृपया बताएं? जैसे कि बुखार, सिरदर्द, या पेट दर्द?',
        'मैं आपकी मदद करने के लिए यहां हूं। कृपया अपने लक्षण स्पष्ट रूप से बताएं।'
      ],
      pa: [
        'ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ ਤੁਸੀਂ ਠੀਕ ਮਹਿਸੂਸ ਨਹੀਂ ਕਰ ਰਹੇ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਮੁੱਖ ਲੱਛਣ ਦੱਸੋ ਜਿਵੇਂ ਬੁਖਾਰ, ਦਰਦ, ਜਾਂ ਹੋਰ ਪਰੇਸ਼ਾਨੀ।',
        'ਤੁਸੀਂ ਕੀ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ? ਜਿਵੇਂ ਬੁਖਾਰ, ਸਿਰ ਦਰਦ, ਜਾਂ ਢਿੱਡ ਦਰਦ?',
        'ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣ ਸਪੱਸ਼ਟ ਰੂਪ ਵਿਚ ਦੱਸੋ।'
      ]
    };

    const responses = generalResponses[language as keyof typeof generalResponses] || generalResponses.en;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setAnalysis({
      symptom: transcript,
      confidence: 0,
      severity: 'unknown',
      recommendations: [randomResponse],
      urgency: 'low'
    });

    speakResponse(randomResponse);
  };

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'granted') {
          return true;
        }
        if (permissionStatus.state === 'denied') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
          return false;
        }
      }

      
      const isSecure = window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
      
      if (!isSecure) {
        setError('Voice features require HTTPS connection');
        return false;
      }

      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        stream.getTracks().forEach(track => track.stop());
        return true;
      } else {
        setError('Microphone not supported in this browser');
        return false;
      }
    } catch (error: any) {
      
      if (error.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotSupportedError') {
        setError('Microphone not supported on this device.');
      } else {
        console.warn('Microphone permission check failed:', error);
        
        return true;
      }
      return false;
    }
  };

  const startListening = async () => {
    if (!supportsSpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    setTranscript('');
    setAnalysis(null);
    setError('');
    
    // Check microphone permission, but don't block if check fails
    const hasPermission = await checkMicrophonePermission();
    
    if (recognitionRef.current) {
      
      if (language === 'hi') {
        recognitionRef.current.lang = 'hi-IN';
      } else if (language === 'pa') {
        recognitionRef.current.lang = 'pa-IN';
      } else {
        recognitionRef.current.lang = 'en-IN';
      }
      
      try {
        recognitionRef.current.start();
      } catch (error: any) {
        if (error.name === 'InvalidStateError') {
          setError('Speech recognition is already running');
        } else {
          setError('Failed to start speech recognition: ' + error.message);
        }
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakResponse = (text: string) => {
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    const texts = {
      en: { high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' },
      hi: { high: 'उच्च प्राथमिकता', medium: 'मध्यम प्राथमिकता', low: 'कम प्राथमिकता' },
      pa: { high: 'ਉੱਚ ਤਰਜੀਹ', medium: 'ਮੱਧਮ ਤਰਜੀਹ', low: 'ਘੱਟ ਤਰਜੀਹ' }
    };
    return texts[language as keyof typeof texts]?.[urgency as keyof typeof texts.en] || texts.en[urgency as keyof typeof texts.en];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h1 className="font-bold text-gray-800">
                {language === 'en' ? 'AI Voice Symptom Checker' :
                 language === 'hi' ? 'AI वॉयस सिम्प्टम चेकर' :
                 'AI ਵਾਇਸ ਸਿਮ੍ਪਟਮ ਚੈਕਰ'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {}
        <Card className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Tell me about your symptoms' :
               language === 'hi' ? 'अपने लक्षणों के बारे में बताएं' :
               'ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ'}
            </h2>

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
                {error.includes('denied') && (
                  <div className="mt-2 text-xs text-red-600">
                    <p>
                      {language === 'en' ? 'To enable voice features:' :
                       language === 'hi' ? 'वॉयस सुविधाएं सक्षम करने के लिए:' :
                       'ਵਾਇਸ ਸੁਵਿਧਾਵਾਂ ਸਮਰੱਥ ਕਰਨ ਲਈ:'}
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        {language === 'en' ? 'Click the microphone icon in your browser address bar' :
                         language === 'hi' ? 'अपने ब्राउज़र के एड्रेस बार में माइक्रोफोन आइकन पर क्लिक करें' :
                         'ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਦੇ ਐਡਰੈੱਸ ਬਾਰ ਵਿੱਚ ਮਾਈਕ੍ਰੋਫੋਨ ਆਈਕਨ ਤੇ ਕਲਿੱਕ ਕਰੋ'}
                      </li>
                      <li>
                        {language === 'en' ? 'Select "Allow" for microphone access' :
                         language === 'hi' ? 'माइक्रोफोन एक्सेस के लिए "अनुमति दें" चुनें' :
                         'ਮਾਈਕ੍ਰੋਫੋਨ ਐਕਸੈੱਸ ਲਈ "ਇਜਾਜ਼ਤ ਦਿਓ" ਚੁਣੋ'}
                      </li>
                      <li>
                        {language === 'en' ? 'Refresh the page if needed' :
                         language === 'hi' ? 'यदि आवश्यक हो तो पेज रीफ्रेश करें' :
                         'ਜੇ ਲੋੜ ਹੋਵੇ ਤਾਂ ਪੰਨਾ ਰੀਫ੍ਰੈਸ਼ ਕਰੋ'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  disabled={!supportsSpeechRecognition}
                  className={`w-24 h-24 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
                      : 'bg-purple-500 hover:bg-purple-600 shadow-md'
                  } ${!supportsSpeechRecognition ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </Button>
                
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {isListening 
                ? (language === 'en' ? 'Listening... Describe your symptoms' : 
                   language === 'hi' ? 'सुन रहा हूं... अपने लक्षण बताएं' : 
                   'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ')
                : isProcessing 
                ? (language === 'en' ? 'Analyzing your symptoms...' : 
                   language === 'hi' ? 'आपके लक्षणों का विश्लेषण कर रहा हूं...' : 
                   'ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹਾਂ...')
                : (language === 'en' ? 'Tap the microphone and describe how you feel' : 
                   language === 'hi' ? 'माइक्रोफोन दबाएं और बताएं कि आप कैसा महसूस कर रहे हैं' : 
                   'ਮਾਈਕ੍ਰੋਫੋਨ ਦਬਾਓ ਅਤੇ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ')
              }
            </p>

            {!supportsSpeechRecognition && (
              <Badge variant="destructive" className="mb-4">
                <AlertCircle className="w-3 h-3 mr-1" />
                {language === 'en' ? 'Speech recognition not supported' :
                 language === 'hi' ? 'स्पीच रिकग्निशन समर्थित नहीं' :
                 'ਸਪੀਚ ਰਿਕਗਨਿਸ਼ਨ ਸਮਰਥਿਤ ਨਹੀਂ'}
              </Badge>
            )}
          </div>
        </Card>

        {}
        {transcript && (
          <Card className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400">
            <div className="flex items-start">
              <Mic className="w-5 h-5 text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  {language === 'en' ? 'What you said:' :
                   language === 'hi' ? 'आपने कहा:' :
                   'ਤੁਸ���ਂ ਕਿਹਾ:'}
                </p>
                <p className="text-blue-800">{transcript}</p>
              </div>
            </div>
          </Card>
        )}

        {}
        {analysis && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                {language === 'en' ? 'AI Analysis' :
                 language === 'hi' ? 'AI विश्लेषण' :
                 'AI ਵਿਸ਼ਲੇਸ਼ਣ'}
              </h3>
              
              <div className="flex items-center space-x-2">
                {analysis.confidence > 0 && (
                  <Badge variant="outline">
                    {Math.round(analysis.confidence)}% {language === 'en' ? 'match' : language === 'hi' ? 'मेल' : 'ਮੇਲ'}
                  </Badge>
                )}
                <Badge className={getUrgencyColor(analysis.urgency)}>
                  {getUrgencyText(analysis.urgency)}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Recommendations:' :
                   language === 'hi' ? 'सिफारिशें:' :
                   'ਸਿਫ਼ਾਰਸ਼ਾਂ:'}
                </h4>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => analysis.recommendations.length > 0 && speakResponse(analysis.recommendations[0])}
                  className="flex items-center"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Hear Again' :
                   language === 'hi' ? 'फिर से सुनें' :
                   'ਦੁਬਾਰਾ ਸੁਣੋ'}
                </Button>
                
                <Button
                  onClick={() => {
                    setTranscript('');
                    setAnalysis(null);
                  }}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {language === 'en' ? 'Check Again' :
                   language === 'hi' ? 'फिर से जांचें' :
                   'ਦੁਬਾਰਾ ਜਾਂਚੋ'}
                </Button>
              </div>

              {}
              {analysis.confidence > 0 && (
                <div className="border-t pt-3 mt-4">
                  <Button
                    onClick={() => {
                      if (onConsultDoctor) {
                        
                        const symptomType = analysis.symptom.toLowerCase().includes('fever') ? 'fever_cold' :
                                          analysis.symptom.toLowerCase().includes('head') ? 'headache' :
                                          analysis.symptom.toLowerCase().includes('stomach') || analysis.symptom.toLowerCase().includes('pain') ? 'stomach_pain' :
                                          analysis.symptom.toLowerCase().includes('cold') || analysis.symptom.toLowerCase().includes('cough') ? 'runny_nose' :
                                          'general';
                        
                        const symptomDataForDoctor = {
                          selectedSymptom: symptomType,
                          symptomLabel: analysis.symptom,
                          duration: 'Voice reported',
                          severity: analysis.severity,
                          urgency: analysis.urgency === 'high',
                          confidence: Math.round(analysis.confidence),
                          category: 'voice-analysis'
                        };
                        onConsultDoctor(symptomDataForDoctor);
                      } else {
                        
                        setShowConsultationDialog(true);
                      }
                    }}
                    className={`w-full ${analysis.urgency === 'high' 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-teal-600 hover:bg-teal-700'
                    } text-white flex items-center justify-center space-x-2`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>
                      {analysis.urgency === 'high' 
                        ? (language === 'en' ? 'Consult Doctor Urgently' :
                           language === 'hi' ? 'तुरंत डॉक्टर से सलाह लें' :
                           'ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ')
                        : (language === 'en' ? 'Consult Recommended Doctor' :
                           language === 'hi' ? 'सुझाए गए डॉक्टर से सलाह लें' :
                           'ਸਿਫਾਰਿਸ਼ੀ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ')
                      }
                    </span>
                  </Button>
                  
                  {analysis.urgency === 'high' && (
                    <p className="text-xs text-red-600 text-center mt-2">
                      🚨 {language === 'en' ? 'Urgent medical attention recommended' :
                           language === 'hi' ? 'तत्काल चिकित्सा ध्यान की सिफारिश' :
                           'ਤੁਰੰਤ ਮੈਡੀਕਲ ਧਿਆਨ ਦੀ ਸਿਫਾਰਿਸ਼'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {}
        <Card className="mt-6 p-4 bg-gray-50">
          <h4 className="font-medium text-gray-700 mb-3">
            {language === 'en' ? 'Example phrases you can say:' :
             language === 'hi' ? 'आप यह वाक्य कह सकते हैं:' :
             'ਤੁਸੀਂ ਇਹ ਵਾਕ ਕਹਿ ਸਕਦੇ ਹੋ:'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {(() => {
              const examples = language === 'en' ? [
                '"I have fever and headache"',
                '"My stomach is paining"',
                '"I am coughing since 3 days"',
                '"I feel dizzy and weak"'
              ] : language === 'hi' ? [
                '"मुझे बुखार और सिरदर्द है"',
                '"मेरे पेट में दर्द है"',
                '"मुझे 3 दिन से खांसी आ रही है"',
                '"मुझे चक्कर आ रहे हैं और कमजोरी लग रही है"'
              ] : [
                '"ਮੈਨੂੰ ਬੁਖਾਰ ਅਤੇ ਸਿਰ ਦਰਦ ਹੈ"',
                '"ਮੇਰੇ ਢਿੱਡ ਵਿਚ ਦਰਦ ਹੈ"',
                '"ਮੈਨੂੰ 3 ਦਿਨਾਂ ਤੋਂ ਖੰਘ ਆ ਰਹੀ ਹੈ"',
                '"ਮੈਨੂੰ ਚੱਕਰ ਆ ਰਹੇ ਹਨ ਅਤੇ ਕਮਜ਼ੋਰੀ ਲਗ ਰਹੀ ਹੈ"'
              ];
              
              return examples.map((example, index) => (
                <div key={index} className="p-2 bg-white rounded border text-gray-600">
                  {example}
                </div>
              ));
            })()}
          </div>
        </Card>
      </div>

      {}
      {analysis && showConsultationDialog && (
        <ConsultationNavigator
          isOpen={showConsultationDialog}
          onClose={() => setShowConsultationDialog(false)}
          diagnosis={createDiagnosisObject(
            
            analysis.symptom.toLowerCase().includes('fever') ? 'fever' :
            analysis.symptom.toLowerCase().includes('head') ? 'headache' :
            analysis.symptom.toLowerCase().includes('stomach') || analysis.symptom.toLowerCase().includes('pain') ? 'stomach' :
            analysis.symptom.toLowerCase().includes('cold') || analysis.symptom.toLowerCase().includes('cough') ? 'cold' :
            'general',
            analysis.severity
          )}
          recommendedDoctorId={getRecommendedDoctorId(
            
            analysis.symptom.toLowerCase().includes('fever') ? 'fever' :
            analysis.symptom.toLowerCase().includes('head') ? 'headache' :
            analysis.symptom.toLowerCase().includes('stomach') || analysis.symptom.toLowerCase().includes('pain') ? 'stomach' :
            analysis.symptom.toLowerCase().includes('cold') || analysis.symptom.toLowerCase().includes('cough') ? 'cold' :
            'general',
            analysis.severity
          )}
        />
      )}
    </div>
  );
}