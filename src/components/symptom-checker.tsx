import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { HealthTip } from './health-tip';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  ArrowLeft, 
  Mic, 
  AlertTriangle,
  CheckCircle,
  Info,
  Thermometer,
  HeartPulse,
  Stethoscope,
  Pill,
  Activity,
  Droplets,
  Leaf,
  Eye,
  Ear,
  Baby,
  Bone,
  Bed,
  Heart,
  Wind,
  Zap,
  Brain
} from 'lucide-react';


import medbotLogo from '@/assets/8feea50d19adacf7309cbe12afdcb46d3362883c.png';

interface SymptomCheckerProps {
  onBack: () => void;
  onConsultDoctor?: (symptomData: any) => void;
}

type CheckerStep = 'symptoms' | 'duration' | 'severity' | 'additional' | 'results';

interface SymptomData {
  id: string;
  label: string;
  icon: any;
  category: string;
}

interface SurveyAnswers {
  selectedSymptom: string | null;
  duration: string | null;
  severity: string | null;
  additionalSymptoms: string[];
}

export function SymptomChecker({ onBack, onConsultDoctor }: SymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState<CheckerStep>('symptoms');
  const [isListening, setIsListening] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({
    selectedSymptom: null,
    duration: null,
    severity: null,
    additionalSymptoms: []
  });
  const { t, language } = useLanguage();

  
  const symptomCategories = {
    en: [
      { id: 'fever_cold', label: 'Fever / Cold / Cough', icon: Thermometer, category: 'respiratory' },
      { id: 'runny_nose', label: 'Runny Nose / Allergy', icon: Leaf, category: 'respiratory' },
      { id: 'headache', label: 'Headache / Dizziness', icon: Zap, category: 'neurological' },
      { id: 'stomach_pain', label: 'Stomach Pain / Nausea', icon: Activity, category: 'digestive' },
      { id: 'joint_pain', label: 'Joint Pain / Body Pain', icon: Bone, category: 'musculoskeletal' },
      { id: 'skin_issues', label: 'Skin Rash / Wound', icon: Droplets, category: 'dermatological' },
      { id: 'chest_pain', label: 'Chest Pain / Palpitation', icon: Heart, category: 'cardiovascular' },
      { id: 'fatigue', label: 'Fatigue / Weakness', icon: Bed, category: 'general' },
      { id: 'eye_issues', label: 'Eye Issues', icon: Eye, category: 'sensory' },
      { id: 'ear_issues', label: 'Ear Pain / Hearing Problem', icon: Ear, category: 'sensory' },
      { id: 'womens_health', label: 'Pregnancy / Women\'s Health', icon: Baby, category: 'reproductive' }
    ],
    hi: [
      { id: 'fever_cold', label: 'बुखार / ठंड / खांसी', icon: Thermometer, category: 'respiratory' },
      { id: 'runny_nose', label: 'नाक बहना / एलर्जी', icon: Leaf, category: 'respiratory' },
      { id: 'headache', label: 'सिरदर्द / चक्कर', icon: Zap, category: 'neurological' },
      { id: 'stomach_pain', label: 'पेट दर्द / मतली', icon: Activity, category: 'digestive' },
      { id: 'joint_pain', label: 'जोड़ों का दर्द / शरीर दर्द', icon: Bone, category: 'musculoskeletal' },
      { id: 'skin_issues', label: 'चकत्ते / घाव', icon: Droplets, category: 'dermatological' },
      { id: 'chest_pain', label: 'छाती में दर्द / धड़कन', icon: Heart, category: 'cardiovascular' },
      { id: 'fatigue', label: 'थकान / कमजोरी', icon: Bed, category: 'general' },
      { id: 'eye_issues', label: 'आंखों की समस्या', icon: Eye, category: 'sensory' },
      { id: 'ear_issues', label: 'कान दर्द / सुनने की समस्या', icon: Ear, category: 'sensory' },
      { id: 'womens_health', label: 'गर्भावस्था / महिला स्वास्थ्य', icon: Baby, category: 'reproductive' }
    ],
    pa: [
      { id: 'fever_cold', label: 'ਬੁਖਾਰ / ਠੰਡ / ਖੰਘ', icon: Thermometer, category: 'respiratory' },
      { id: 'runny_nose', label: 'ਨੱਕ ਵਗਣਾ / ਐਲਰਜੀ', icon: Leaf, category: 'respiratory' },
      { id: 'headache', label: 'ਸਿਰ ਦਰਦ / ਚੱਕਰ', icon: Zap, category: 'neurological' },
      { id: 'stomach_pain', label: 'ਢਿੱਡ ਦਰਦ / ਉਲਟੀ', icon: Activity, category: 'digestive' },
      { id: 'joint_pain', label: 'ਜੋੜਾਂ ਦਾ ਦਰਦ / ਸਰੀਰ ਦਰਦ', icon: Bone, category: 'musculoskeletal' },
      { id: 'skin_issues', label: 'ਚਮੜੀ ਦਾ ਰੋਗ / ਜ਼ਖ਼ਮ', icon: Droplets, category: 'dermatological' },
      { id: 'chest_pain', label: 'ਛਾਤੀ ਵਿਚ ਦਰਦ / ਦਿਲ ਦੀ ਧੜਕ', icon: Heart, category: 'cardiovascular' },
      { id: 'fatigue', label: 'ਥਕਾਵਟ / ਕਮਜ਼ੋਰੀ', icon: Bed, category: 'general' },
      { id: 'eye_issues', label: 'ਅੱਖਾਂ ਦੀ ਸਮੱਸਿਆ', icon: Eye, category: 'sensory' },
      { id: 'ear_issues', label: 'ਕੰਨ ਦਰਦ / ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ', icon: Ear, category: 'sensory' },
      { id: 'womens_health', label: 'ਗਰਭਅਵਸਥਾ / ਔਰਤਾਂ ਦੀ ਸਿਹਤ', icon: Baby, category: 'reproductive' }
    ]
  };

  
  const durationOptions = {
    en: [
      { id: 'less_than_day', label: 'Less than 1 day', icon: '🕐' },
      { id: 'one_to_three', label: '1-3 days', icon: '📅' },
      { id: 'one_week', label: '1 week', icon: '📆' },
      { id: 'more_than_week', label: 'More than 1 week', icon: '🗓️' }
    ],
    hi: [
      { id: 'less_than_day', label: '1 दिन से कम', icon: '🕐' },
      { id: 'one_to_three', label: '1-3 दिन', icon: '📅' },
      { id: 'one_week', label: '1 सप्ताह', icon: '📆' },
      { id: 'more_than_week', label: '1 सप्ताह से अधिक', icon: '🗓️' }
    ],
    pa: [
      { id: 'less_than_day', label: '1 ਦਿਨ ਤੋਂ ਘੱਟ', icon: '🕐' },
      { id: 'one_to_three', label: '1-3 ਦਿਨ', icon: '📅' },
      { id: 'one_week', label: '1 ਹਫ਼ਤਾ', icon: '📆' },
      { id: 'more_than_week', label: '1 ਹਫ਼ਤੇ ਤੋਂ ਜ਼ਿਆਦਾ', icon: '🗓️' }
    ]
  };

  
  const severityLevels = {
    en: [
      { id: 'mild', label: 'Mild', desc: '(manageable)', icon: '😊', color: 'text-green-600 bg-green-50' },
      { id: 'moderate', label: 'Medium', desc: '(disturbs daily work)', icon: '😐', color: 'text-yellow-600 bg-yellow-50' },
      { id: 'severe', label: 'Severe', desc: '(very painful / difficult)', icon: '😰', color: 'text-red-600 bg-red-50' }
    ],
    hi: [
      { id: 'mild', label: 'हल्का', desc: '(संभालने योग्य)', icon: '😊', color: 'text-green-600 bg-green-50' },
      { id: 'moderate', label: 'मध्यम', desc: '(दैनिक काम में बाधा)', icon: '😐', color: 'text-yellow-600 bg-yellow-50' },
      { id: 'severe', label: 'गंभीर', desc: '(बहुत दर्दनाक / कठिन)', icon: '😰', color: 'text-red-600 bg-red-50' }
    ],
    pa: [
      { id: 'mild', label: 'ਹਲਕਾ', desc: '(ਸੰਭਾਲਣ ਯੋਗ)', icon: '😊', color: 'text-green-600 bg-green-50' },
      { id: 'moderate', label: 'ਮੱਧਮ', desc: '(ਰੋਜ਼ਾਨਾ ਕੰਮ ਵਿਚ ਰੁਕਾਵਟ)', icon: '😐', color: 'text-yellow-600 bg-yellow-50' },
      { id: 'severe', label: 'ਗੰਭੀਰ', desc: '(ਬਹੁਤ ਦਰਦਨਾਕ / ਔਖਾ)', icon: '😰', color: 'text-red-600 bg-red-50' }
    ]
  };

  
  const additionalSymptoms = {
    en: [
      { id: 'high_fever', label: 'High fever', icon: Thermometer, urgent: true },
      { id: 'breathing_difficulty', label: 'Breathing difficulty', icon: Wind, urgent: true },
      { id: 'chest_pain_severe', label: 'Chest pain', icon: Heart, urgent: true },
      { id: 'vomiting', label: 'Vomiting / Dehydration', icon: Droplets, urgent: true },
      { id: 'none', label: 'None of these', icon: CheckCircle, urgent: false }
    ],
    hi: [
      { id: 'high_fever', label: 'तेज बुखार', icon: Thermometer, urgent: true },
      { id: 'breathing_difficulty', label: 'सांस लेने में कठिनाई', icon: Wind, urgent: true },
      { id: 'chest_pain_severe', label: 'छाती में दर्द', icon: Heart, urgent: true },
      { id: 'vomiting', label: 'उल्टी / निर्जलीकरण', icon: Droplets, urgent: true },
      { id: 'none', label: 'इनमें से कोई नहीं', icon: CheckCircle, urgent: false }
    ],
    pa: [
      { id: 'high_fever', label: 'ਤੇਜ਼ ਬੁਖਾਰ', icon: Thermometer, urgent: true },
      { id: 'breathing_difficulty', label: 'ਸਾਹ ਲੈਣ ਵਿਚ ਮੁਸ਼ਕਿਲ', icon: Wind, urgent: true },
      { id: 'chest_pain_severe', label: 'ਛਾਤੀ ਵਿਚ ਦਰਦ', icon: Heart, urgent: true },
      { id: 'vomiting', label: 'ਉਲਟੀ / ਪਾਣੀ ਦੀ ਕਮੀ', icon: Droplets, urgent: true },
      { id: 'none', label: 'ਇਹਨਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ', icon: CheckCircle, urgent: false }
    ]
  };

  
  const diagnosisDatabase = {
    'fever_cold': {
      name: {
        en: 'Common Viral Fever / Seasonal Flu',
        hi: 'सामान्य वायरल बुखार / ��ौसमी फ्लू',
        pa: 'ਆਮ ਵਾਇਰਲ ਬੁਖਾਰ / ਮੌਸਮੀ ਫਲੂ'
      },
      medication: {
        en: [
          'Paracetamol (Crocin, Dolo-650) every 6-8 hours for fever',
          'Steam inhalation for blocked nose',
          'Gargle with warm salt water 2-3 times daily'
        ],
        hi: [
          'बुखार के लिए पैरासिटामोल (क्रोसिन, डोलो-650) हर 6-8 घंटे में',
          'बंद नाक के लिए भाप लें',
          'दिन में 2-3 बार नमक के पानी से गरारा करें'
        ],
        pa: [
          'ਬੁਖਾਰ ਲਈ ਪੈਰਾਸਿਟਾਮੋਲ (ਕ੍ਰੋਸਿਨ, ਡੋਲੋ-650) ਹਰ 6-8 ਘੰਟੇ ਬਾਅਦ',
          'ਬੰਦ ਨੱਕ ਲਈ ਭਾਫ਼ ਲਓ',
          'ਦਿਨ ਵਿੱਚ 2-3 ਵਾਰ ਨਮਕ ਪਾਣੀ ਨਾਲ ਗਰਾਰੇ ਕਰੋ'
        ]
      },
      diet: {
        en: [
          'Drink plenty of warm water throughout the day',
          'Fresh ginger tea 2-3 times daily',
          'Light khichdi or dal rice meals',
          'Avoid oily, spicy, and cold foods completely'
        ],
        hi: [
          'दिन भर गर्म पानी पिएं',
          'दिन में 2-3 बार ताजा अदरक की चाय',
          'हल्की खिचड़ी या दाल चावल खाएं',
          'तेल, मसालेदार और ठंडा खाना बिल्कुल न लें'
        ],
        pa: [
          'ਦਿਨ ਭਰ ਗਰਮ ਪਾਣੀ ਪੀਓ',
          'ਦਿਨ ਵਿੱਚ 2-3 ਵਾਰ ਤਾਜ਼ਾ ਅਦਰਕ ਚਾਹ',
          'ਹਲਕੀ ਖਿਚੜੀ ਜਾਂ ਦਾਲ ਚਾਵਲ ਖਾਓ',
          'ਤੇਲ, ਮਸਾਲੇਦਾਰ ਅਤੇ ਠੰਡਾ ਖਾਣਾ ਬਿਲਕੁਲ ਨਾ ਲਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'runny_nose': {
      name: {
        en: 'Seasonal Allergy / Dust Allergy',
        hi: 'मौसमी एलर्जी / धूल एलर्जी',
        pa: 'ਮੌਸਮੀ ਐਲਰਜੀ / ਧੂੜ ਐਲਰਜੀ'
      },
      medication: {
        en: [
          'Cetirizine (anti-allergic) once at night',
          'Avoid dust and pollution exposure',
          'Use clean cloth mask when going outside'
        ],
        hi: [
          'रात में एक बार सेटिरिज़ीन (एंटी-एलर्जिक)',
          'धूल और प्रदूषण से बचें',
          'बाहर जाते समय साफ कपड़े का मास्क पहनें'
        ],
        pa: [
          'ਰਾਤ ਨੂੰ ਇੱਕ ਵਾਰ ਸੇਟਿਰਿਜ਼ੀਨ (ਐਂਟੀ-ਐਲਰਜਿਕ)',
          'ਧੂੜ ਅਤੇ ਪ੍ਰਦੂਸ਼ਣ ਤੋਂ ਬਚੋ',
          'ਬਾਹਰ ਜਾਂਦੇ ਸਮੇਂ ਸਾਫ਼ ਕੱਪੜੇ ਦਾ ਮਾਸਕ ਪਹਿਨੋ'
        ]
      },
      diet: {
        en: [
          'Wash all fruits and vegetables properly',
          'Avoid cold drinks and ice cream completely',
          'Drink warm tulsi (holy basil) tea',
          'Eat fresh, clean home-cooked food only'
        ],
        hi: [
          'सभी फल और सब्जियों को अच्छी तरह धोएं',
          'ठंडे पेय और आइसक्रीम से पूरी तरह बचें',
          'गर्म तुलसी की चाय पिएं',
          'केवल ताजा, साफ घर का बना खाना खाएं'
        ],
        pa: [
          'ਸਾਰੇ ਫਲ ਅਤੇ ਸਬਜ਼ੀਆਂ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਧੋਵੋ',
          'ਠੰਡੇ ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ ਅਤੇ ਆਈਸਕ੍ਰੀਮ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ',
          'ਗਰਮ ਤੁਲਸੀ ਚਾਹ ਪੀਓ',
          'ਸਿਰਫ਼ ਤਾਜ਼ਾ, ਸਾਫ਼ ਘਰ ਦਾ ਬਣਿਆ ਖਾਣਾ ਖਾਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'headache': {
      name: {
        en: 'Tension Headache / Dehydration',
        hi: 'तनाव सिरदर्द / निर्जलीकरण',
        pa: 'ਤਣਾਅ ਸਿਰ ਦਰਦ / ਪਾਣੀ ਦੀ ਕਮੀ'
      },
      medication: {
        en: [
          'Paracetamol for pain relief',
          'Rest in a quiet, dark room',
          'Apply cold compress on forehead'
        ],
        hi: [
          'दर्द निवारण के लिए पैरासिटामोल',
          'शांत, अंधेरे कमरे में आराम करें',
          'माथे पर ठंडी पट्टी लगाएं'
        ],
        pa: [
          'ਦਰਦ ਰਾਹਤ ਲਈ ਪੈਰਾਸਿਟਾਮੋਲ',
          'ਚੁੱਪ, ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ',
          'ਮੱਥੇ \'ਤੇ ਠੰਡੀ ਪੱਟੀ ਲਗਾਓ'
        ]
      },
      diet: {
        en: [
          'Drink plenty of water throughout the day',
          'Fresh buttermilk and coconut water',
          'Eat fresh fruits like oranges and watermelon',
          'Take light meals, avoid heavy foods'
        ],
        hi: [
          'दिन भर खूब पानी पिएं',
          'ताजा छाछ और नारियल पानी',
          'संतरा और तरबूज जैसे ताजे फल खाएं',
          'हल्का भोजन लें, भारी खाना न खाएं'
        ],
        pa: [
          'ਦਿਨ ਭਰ ਖੂਬ ਪਾਣੀ ਪੀਓ',
          'ਤਾਜ਼ਾ ਛਾਛ ਅਤੇ ਨਾਰੀਅਲ ਪਾਣੀ',
          'ਸੰਤਰਾ ਅਤੇ ਤਰਬੂਜ਼ ਵਰਗੇ ਤਾਜ਼ੇ ਫਲ ਖਾਓ',
          'ਹਲਕਾ ਭੋਜਨ ਲਓ, ਭਾਰੀ ਖਾਣਾ ਨਾ ਖਾਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'stomach_pain': {
      name: {
        en: 'Indigestion / Mild Gastritis',
        hi: 'अपच / हल्का गैस्ट्राइटिस',
        pa: 'ਅਪਚ / ਹਲਕਾ ਗੈਸਟ੍ਰਾਇਟਿਸ'
      },
      medication: {
        en: [
          'ORS solution for hydration',
          'Antacid (Digene, Gelusil) after meals',
          'Rest and avoid physical activity'
        ],
        hi: [
          'हाइड्रेशन के लिए ORS का घोल',
          'खाने के बाद एंटासिड (डिजीन, जेलुसिल)',
          'आराम करें और शारीरिक गतिविधि से बचें'
        ],
        pa: [
          'ਹਾਈਡ੍ਰੇਸ਼ਨ ਲਈ ORS ਘੋਲ',
          'ਖਾਣੇ ਬਾਅਦ ਐਂਟਾਸਿਡ (ਡਿਜੀਨ, ਜੇਲੁਸਿਲ)',
          'ਆਰਾਮ ਕਰੋ ਅਤੇ ਸਰੀਰਕ ਗਤੀਵਿਧੀ ਤੋਂ ਬਚੋ'
        ]
      },
      diet: {
        en: [
          'Eat curd rice and plain khichdi only',
          'Drink jeera-ajwain water 3 times daily',
          'Completely avoid fried and spicy foods',
          'Take small, frequent meals instead of large ones'
        ],
        hi: [
          'केवल दही चावल और सादी खिचड़ी खाएं',
          'दिन में 3 बार जीरा-अजवाइन का पानी पिएं',
          'तली और मसालेदार चीजों से पूरी तरह बचें',
          'बड़े भोजन के बजाय थोड़ा-थोड़ा बार-बार खाएं'
        ],
        pa: [
          'ਸਿਰਫ਼ ਦਹੀਂ ਚਾਵਲ ਅਤੇ ਸਾਦੀ ਖਿਚੜੀ ਖਾਓ',
          'ਦਿਨ ਵਿੱਚ 3 ਵਾਰ ਜੀਰਾ-ਅਜਵਾਇਨ ਪਾਣੀ ਪੀਓ',
          'ਤਲੇ ਅਤੇ ਮਸਾਲੇਦਾਰ ਚੀਜ਼ਾਂ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ',
          'ਵੱਡੇ ਭੋਜਨ ਦੀ ਬਜਾਏ ਥੋੜ੍ਹਾ-ਥੋੜ੍ਹਾ ਵਾਰ-ਵਾਰ ਖਾਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'joint_pain': {
      name: {
        en: 'Muscle Strain / Early Viral Fever',
        hi: 'मांसपेशी में खिंचाव / शुरुआती वायरल बुखार',
        pa: 'ਮਾਸਪੇਸ਼ੀ ਵਿੱਚ ਖਿੱਚ / ਸ਼ੁਰੂਆਤੀ ਵਾਇਰਲ ਬੁਖਾਰ'
      },
      medication: {
        en: [
          'Paracetamol or Ibuprofen (if no gastric issues)',
          'Apply pain relief balm to affected areas',
          'Warm compress on painful joints'
        ],
        hi: [
          'पैरासिटामोल या इबुप्रोफेन (अगर पेट की समस्या नहीं है)',
          'प्रभावित क्षेत्रों पर दर्द निवारक बाम लगाएं',
          'दुखने वाले जोड़ों पर गर्म सेंक'
        ],
        pa: [
          'ਪੈਰਾਸਿਟਾਮੋਲ ਜਾਂ ਆਈਬੁਪ੍ਰੋਫੇਨ (ਜੇ ਪੇਟ ਦੀ ਸਮੱਸਿਆ ਨਹੀਂ)',
          'ਪ੍ਰਭਾਵਿਤ ਖੇਤਰਾਂ \'ਤੇ ਦਰਦ ਰਾਹਤ ਬਾਮ ਲਗਾਓ',
          'ਦੁਖਣ ਵਾਲੇ ਜੋੜਾਂ \'ਤੇ ਗਰਮ ਸੇਂਕ'
        ]
      },
      diet: {
        en: [
          'Protein-rich foods: dal, milk, paneer daily',
          'Warm turmeric milk before sleeping',
          'Avoid cold drinks and ice completely',
          'Eat green leafy vegetables and seasonal fruits'
        ],
        hi: [
          'प्रोटीन युक्त भोजन: रोजाना दाल, दूध, पनीर',
          'सोने से पहले गर्म हल्दी वाला दूध',
          'ठंडे पेय और बर्फ से पूरी तरह बचें',
          'हरी पत्तेदार सब्जियां और मौसमी फल खाएं'
        ],
        pa: [
          'ਪ੍ਰੋਟੀਨ ਭਰਪੂਰ ਭੋਜਨ: ਰੋਜ਼ਾਨਾ ਦਾਲ, ਦੁੱਧ, ਪਨੀਰ',
          'ਸੌਣ ਤੋਂ ਪਹਿਲਾਂ ਗਰਮ ਹਲਦੀ ਵਾਲਾ ਦੁੱਧ',
          'ਠੰਡੇ ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ ਅਤੇ ਬਰਫ਼ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ',
          'ਹਰੀਆਂ ਪੱਤੇਦਾਰ ਸਬਜ਼ੀਆਂ ਅਤੇ ਮੌਸਮੀ ਫਲ ਖਾਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'skin_issues': {
      name: {
        en: 'Fungal Infection / Skin Allergy',
        hi: 'फंगल संक्रमण / त्वचा एलर्जी',
        pa: 'ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ / ਚਮੜੀ ਐਲਰਜੀ'
      },
      medication: {
        en: [
          'Antifungal cream (Clotrimazole) twice daily',
          'Calamine lotion for itching relief',
          'Keep affected area clean and dry'
        ],
        hi: [
          'दिन में दो बार एंटिफंगल क्रीम (क्लोट्रिमाज़ोल)',
          'खुजली से राहत के लिए कैलामाइन लोशन',
          'प्रभावित क्षेत्र को साफ और सूखा रखें'
        ],
        pa: [
          'ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਐਂਟਿਫੰਗਲ ਕ੍ਰੀਮ (ਕਲੋਟ੍ਰਿਮਾਜ਼ੋਲ)',
          'ਖਾਜ ਤੋਂ ਰਾਹਤ ਲਈ ਕੈਲਾਮਾਈਨ ਲੋਸ਼ਨ',
          'ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ ਨੂੰ ਸਾਫ਼ ਅਤੇ ਸੁੱਕਾ ਰੱਖੋ'
        ]
      },
      diet: {
        en: [
          'Avoid very sweet foods (sugar feeds fungal infection)',
          'Eat fresh vegetables and fruits daily',
          'Take neem water bath twice weekly',
          'Drink plenty of clean water for detoxification'
        ],
        hi: [
          'बहुत मीठा खाना न खाएं (चीनी फंगल संक्रमण को बढ़ाती है)',
          'रोजाना ताजी सब्जियां और फल खाएं',
          'सप्ताह में दो बार नीम के पानी से नहाएं',
          'डिटॉक्सिफिकेशन के लिए खूब साफ पानी पिएं'
        ],
        pa: [
          'ਬਹੁਤ ਮਿੱਠਾ ਖਾਣਾ ਨਾ ਖਾਓ (ਖੰਡ ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ ਨੂੰ ਵਧਾਉਂਦੀ ਹੈ)',
          'ਰੋਜ਼ਾਨਾ ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ ਅਤੇ ਫਲ ਖਾਓ',
          'ਹਫ਼ਤੇ ਵਿੱਚ ਦੋ ਵਾਰ ਨਿੰਮ ਪਾਣੀ ਨਾਲ ਨਹਾਓ',
          'ਡਿਟੌਕਸੀਫਿਕੇਸ਼ਨ ਲਈ ਖੂਬ ਸਾਫ਼ ਪਾਣੀ ਪੀਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'chest_pain': {
      name: {
        en: 'Possible Heart/Lung Issue - EMERGENCY',
        hi: 'संभावित हृदय/फेफड़े की समस्या - आपातकाल',
        pa: 'ਸੰਭਾਵਿਤ ਦਿਲ/ਫੇਫੜੇ ਦੀ ਸਮੱਸਿਆ - ਐਮਰਜੈਂਸੀ'
      },
      medication: {
        en: [
          '⚠️ Take Aspirin if severe chest pain (only if not allergic)',
          '🚨 RUSH TO HOSPITAL IMMEDIATELY',
          'Do not delay - call emergency services'
        ],
        hi: [
          '⚠️ गंभीर छाती दर्द होने पर एस्पिरिन लें (यदि एलर्जी नहीं है)',
          '🚨 तुरंत अस्पताल जाएं',
          'देर न करें - आपातकालीन सेवाओं को कॉल करें'
        ],
        pa: [
          '⚠️ ਗੰਭੀਰ ਛਾਤੀ ਦਰਦ ਹੋਣ \'ਤੇ ਐਸਪਰਿਨ ਲਓ (ਜੇ ਐਲਰਜੀ ਨਹੀਂ)',
          '🚨 ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ',
          'ਦੇਰ ਨਾ ਕਰੋ - ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ'
        ]
      },
      diet: {
        en: [
          '🚫 Stop solid food until checked by doctor',
          'Sip water slowly if able to swallow',
          'No tea, coffee, or any beverages',
          'Focus on getting medical help immediately'
        ],
        hi: [
          '🚫 डॉक्टर द्वारा जांच तक ठोस भोजन बंद करें',
          'यदि निगल सकते हैं तो धीरे-धीरे पानी पिएं',
          'चाय, कॉफी या कोई पेय न लें',
          'तुरंत मेडिकल मदद लेने पर ध्यान दें'
        ],
        pa: [
          '🚫 ਡਾਕਟਰ ਦੁਆਰਾ ਜਾਂਚ ਤੱਕ ਠੋਸ ਭੋਜਨ ਬੰਦ ਕਰੋ',
          'ਜੇ ਨਿਗਲ ਸਕਦੇ ਹੋ ਤਾਂ ਹੌਲੀ-ਹੌਲੀ ਪਾਣੀ ਪੀਓ',
          'ਚਾਹ, ਕਾਫੀ ਜਾਂ ਕੋਈ ਪੀਣ ਵਾਲਾ ਪਦਾਰਥ ਨਾ ਲਓ',
          'ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਦਦ ਲੈਣ \'ਤੇ ਧਿਆਨ ਦਿਓ'
        ]
      },
      severity: 'severe',
      urgency: true
    },
    'eye_issues': {
      name: {
        en: 'Conjunctivitis / Eye Strain',
        hi: 'आंख आना / आंखों की थकान',
        pa: 'ਅੱਖ ਆਉਣਾ / ਅੱਖਾਂ ਦੀ ਥਕਾਵਟ'
      },
      medication: {
        en: [
          'Wash eyes with clean water 4-5 times daily',
          'Use antibiotic drops if prescribed by doctor',
          'Avoid steroids completely - do not rub eyes'
        ],
        hi: [
          'दिन में 4-5 बार साफ पानी से आंखें धोएं',
          'डॉक्टर द्वारा दी गई एंटिबायोटिक ड्रॉप्स का उपयोग करें',
          'स्टेरॉयड से पूरी तरह बचें - आंखें न रगड़ें'
        ],
        pa: [
          'ਦਿਨ ਵਿੱਚ 4-5 ਵਾਰ ਸਾਫ਼ ਪਾਣੀ ਨਾਲ ਅੱਖਾਂ ਧੋਵੋ',
          'ਡਾਕਟਰ ਦੁਆਰਾ ਦਿੱਤੀ ਐਂਟਿਬਾਇਓਟਿਕ ਡ੍ਰਾਪਸ ਦਾ ਇਸਤੇਮਾਲ ਕਰੋ',
          'ਸਟੀਰੌਇਡ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ - ਅੱਖਾਂ ਨਾ ਰਗੜੋ'
        ]
      },
      diet: {
        en: [
          'Eat vitamin A-rich foods: carrots, spinach daily',
          'Avoid spicy and fried foods completely',
          'Do not touch or rub eyes with dirty hands',
          'Drink plenty of water for eye hydration'
        ],
        hi: [
          'विटामिन ए युक्त भोजन खाएं: रोजाना गाजर, पालक',
          'मसालेदार और तली चीजों से पूरी तरह ब���े���',
          'गंदे हाथों से आंखें न छुएं या न रगड़ें',
          'आंखों की नमी के लिए खूब पानी पिएं'
        ],
        pa: [
          'ਵਿਟਾਮਿਨ ਏ ਭਰਪੂਰ ਭੋਜਨ ਖਾਓ: ਰੋਜ਼ਾਨਾ ਗਾਜਰ, ਪਾਲਕ',
          'ਮਸਾਲੇਦਾਰ ਅਤੇ ਤਲੀਆਂ ਚੀਜ਼ਾਂ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ',
          'ਗੰਦੇ ਹੱਥਾਂ ਨਾਲ ਅੱਖਾਂ ਨਾ ਛੂਹੋ ਜਾਂ ਨਾ ਰਗੜੋ',
          'ਅੱਖਾਂ ਦੀ ਨਮੀ ਲਈ ਖੂਬ ਪਾਣੀ ਪੀਓ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'ear_issues': {
      name: {
        en: 'Ear Infection / Wax Buildup',
        hi: 'कान का संक्रमण / मैल जमा होना',
        pa: 'ਕੰਨ ਦਾ ਇਨਫੈਕਸ਼ਨ / ਮੈਲ ਜਮ੍ਹਾ ਹੋਣਾ'
      },
      medication: {
        en: [
          'Paracetamol for pain relief',
          'Keep ear dry - no oil drops unless prescribed',
          'Do not insert anything into the ear'
        ],
        hi: [
          'दर्द निवारण के लिए पैरासिटामोल',
          'कान को सूखा रखें - डॉक्टर की सलाह के बिना तेल न डालें',
          'कान में कुछ भी न डालें'
        ],
        pa: [
          'ਦਰਦ ਰਾਹਤ ਲਈ ਪੈਰਾਸਿਟਾਮੋਲ',
          'ਕੰਨ ਨੂੰ ਸੁੱਕਾ ਰੱਖੋ - ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਬਿਨਾ ਤੇਲ ਨਾ ਪਾਓ',
          'ਕੰਨ ਵਿੱਚ ਕੁਝ ਵੀ ਨਾ ਪਾਓ'
        ]
      },
      diet: {
        en: [
          'Eat warm foods, avoid cold liquids',
          'Drink ginger-honey tea for infection relief',
          'Take vitamin C rich fruits for immunity',
          'Avoid dairy products until infection clears'
        ],
        hi: [
          'गर्म खाना खाएं, ठंडे तरल से बचें',
          'संक्रमण से राहत के लिए अदरक-शहद की चाय पिएं',
          'प्रतिरक्षा के लिए विटामिन सी युक्त फल लें',
          'संक्रमण ठीक होने तक डेयरी उत्पादों से बचें'
        ],
        pa: [
          'ਗਰਮ ਖਾਣਾ ਖਾਓ, ਠੰਡੇ ਤਰਲ ਤੋਂ ਬਚੋ',
          'ਇਨਫੈਕਸ਼��� ਤੋਂ ਰਾਹਤ ਲਈ ਅਦਰਕ-ਸ਼ਹਿਦ ਚਾਹ ਪੀਓ',
          'ਇਮਿਊਨਿਟੀ ਲਈ ਵਿਟਾਮਿਨ ਸੀ ਭਰਪੂਰ ਫਲ ਲਓ',
          'ਇਨਫੈਕਸ਼ਨ ਠੀਕ ਹੋਣ ਤੱਕ ਡੇਅਰੀ ਉਤਪਾਦਾਂ ਤੋਂ ਬਚੋ'
        ]
      },
      severity: 'mild',
      urgency: false
    },
    'fatigue': {
      name: {
        en: 'Anemia / Dehydration / Viral Fatigue',
        hi: 'एनीमिया / निर्जलीकरण / वायरल थकान',
        pa: 'ਐਨੀਮੀਆ / ਪਾਣੀ ਦੀ ਕਮੀ / ਵਾਇਰਲ ਥਕਾਵਟ'
      },
      medication: {
        en: [
          'ORS solution for hydration',
          'Iron supplements if already prescribed by doctor',
          'Complete rest for 2-3 days minimum'
        ],
        hi: [
          'हाइड्रेशन के लिए ORS का घोल',
          'डॉक्टर द्वारा पहले से दी गई आयरन की गोली',
          'कम से कम 2-3 दिन पूरा आराम'
        ],
        pa: [
          'ਹਾਈਡ੍ਰੇਸ਼ਨ ਲਈ ORS ਘੋਲ',
          'ਡਾਕਟਰ ਦੁਆਰਾ ਪਹਿਲਾਂ ਤੋਂ ਦਿੱਤੀ ਆਇਰਨ ਦੀ ਗੋਲੀ',
          'ਘੱਟੋ-ਘ���ਟ 2-3 ਦਿਨ ਪੂਰਾ ਆਰਾਮ'
        ]
      },
      diet: {
        en: [
          'Green leafy vegetables: spinach, fenugreek daily',
          'Jaggery, dates, and raisins for iron',
          'Fresh milk and pulses for protein',
          'Completely avoid junk and processed foods'
        ],
        hi: [
          'हरी पत्तेदार सब्जियां: रोजाना पालक, मेथी',
          'आयरन के लिए गुड़, खजूर और किशमिश',
          'प्रोटीन के लिए ताजा दूध और दालें',
          'जंक और प्रोसेस्ड फूड से पूरी तरह बचें'
        ],
        pa: [
          'ਹਰੀਆਂ ਪੱਤੇਦਾਰ ਸਬਜ਼ੀਆਂ: ਰੋਜ਼ਾਨਾ ਪਾਲਕ, ਮੇਥੀ',
          'ਆਇਰਨ ਲਈ ਗੁੜ, ਖਜੂਰ ਅਤੇ ਕਿਸ਼ਮਿਸ਼',
          'ਪ੍ਰੋਟੀਨ ਲਈ ਤਾਜ਼ਾ ਦੁੱਧ ਅਤੇ ਦਾਲਾਂ',
          'ਜੰਕ ਅਤੇ ਪ੍ਰੋਸੈਸਡ ਫੂਡ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ'
        ]
      },
      severity: 'moderate',
      urgency: false
    },
    'womens_health': {
      name: {
        en: 'Pregnancy / Women\'s Health Concern',
        hi: 'गर्���ावस���था / महिला स्वास्थ्य समस्या',
        pa: 'ਗਰਭਅਵਸਥਾ / ਔਰਤਾਂ ਦੀ ਸਿਹਤ ਸਮੱਸਿਆ'
      },
      medication: {
        en: [
          '⚠️ NO self-medication during pregnancy',
          'Consult female doctor or midwife immediately',
          'Take only prescribed medicines'
        ],
        hi: [
          '⚠️ गर्भावस्था में कोई भी दवा अपने आप न लें',
          'तुरंत महिला डॉक्टर या दाई से मिलें',
          'केवल डॉक्टर की दी गई दवा लें'
        ],
        pa: [
          '⚠️ ਗਰਭਅਵਸਥਾ ਵਿੱਚ ਕੋਈ ਵੀ ਦਵਾਈ ਆਪਣੇ ਆਪ ਨਾ ਲਓ',
          'ਤੁਰੰਤ ਔਰਤ ਡਾਕਟਰ ਜਾਂ ਦਾਈ ਨੂੰ ਮਿਲੋ',
          'ਸਿਰਫ਼ ਡਾਕਟਰ ਦੀ ਦਿੱਤੀ ਦਵਾਈ ਲਓ'
        ]
      },
      diet: {
        en: [
          'Folic acid rich foods: green vegetables, oranges',
          'Plenty of milk and dairy products',
          'Avoid raw foods, street food completely',
          'Small frequent meals, avoid heavy spices'
        ],
        hi: [
          'फोलिक एसिड युक्त भोजन: हरी सब्जियां, संतरा',
          'खूब दूध और डेयरी उत्पाद',
          'कच्चा खाना, स्ट्रीट फूड से पूरी तरह बचें',
          'थोड़ा-थोड़ा बार-बार खाएं, तेज मसाले से बचें'
        ],
        pa: [
          'ਫੋਲਿਕ ਐਸਿਡ ਭਰਪੂਰ ਭੋਜਨ: ਹਰੀਆਂ ਸਬਜ਼ੀਆਂ, ਸੰਤਰਾ',
          'ਖੂਬ ਦੁੱਧ ਅਤੇ ਡੇਅਰੀ ਉਤਪਾਦ',
          'ਕੱਚਾ ਖਾਣਾ, ਸਟ੍ਰੀਟ ਫੂਡ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਚੋ',
          'ਥੋੜ੍ਹਾ-ਥੋੜ੍ਹਾ ਵਾਰ-ਵਾਰ ਖਾਓ, ਤਿੱਖੇ ਮਸਾਲਿਆਂ ਤੋਂ ਬਚੋ'
        ]
      },
      severity: 'moderate',
      urgency: false
    }
  };

  
  const getDiagnosis = () => {
    const { selectedSymptom, duration, severity, additionalSymptoms } = surveyAnswers;
    
    if (!selectedSymptom) return null;
    
    let diagnosis = diagnosisDatabase[selectedSymptom];
    if (!diagnosis) return null;

    
    const hasEmergencySymptoms = additionalSymptoms.some(symptom => 
      ['high_fever', 'breathing_difficulty', 'chest_pain_severe', 'vomiting'].includes(symptom)
    );
    
    
    if (hasEmergencySymptoms || severity === 'severe') {
      diagnosis = {
        ...diagnosis,
        severity: 'severe',
        urgency: true
      };
    }

    return {
      ...diagnosis,
      duration: duration,
      severityLevel: severity,
      additionalSymptoms: additionalSymptoms,
      confidence: hasEmergencySymptoms ? 95 : severity === 'severe' ? 90 : 85
    };
  };

  const selectSymptom = (symptomId: string) => {
    setSurveyAnswers(prev => ({ ...prev, selectedSymptom: symptomId }));
    setCurrentStep('duration');
  };

  const selectDuration = (duration: string) => {
    setSurveyAnswers(prev => ({ ...prev, duration }));
    setCurrentStep('severity');
  };

  const selectSeverity = (severity: string) => {
    setSurveyAnswers(prev => ({ ...prev, severity }));
    setCurrentStep('additional');
  };

  const toggleAdditionalSymptom = (symptomId: string) => {
    setSurveyAnswers(prev => {
      if (symptomId === 'none') {
        return { ...prev, additionalSymptoms: ['none'] };
      }
      
      const filtered = prev.additionalSymptoms.filter(id => id !== 'none');
      const isSelected = filtered.includes(symptomId);
      
      return {
        ...prev,
        additionalSymptoms: isSelected 
          ? filtered.filter(id => id !== symptomId)
          : [...filtered, symptomId]
      };
    });
  };

  const proceedToResults = () => {
    setCurrentStep('results');
  };

  const startVoiceInput = () => {
    setIsListening(true);
    
    setTimeout(() => {
      setIsListening(false);
      
      selectSymptom('fever_cold');
    }, 3000);
  };

  
  const getQuestionText = () => {
    switch (currentStep) {
      case 'symptoms':
        return language === 'en' ? 'What problem are you facing today?' :
               language === 'hi' ? 'आज आपको क्या समस्या हो रही है?' :
               'ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਸਮੱਸਿਆ ਹੋ ਰਹੀ ਹੈ?';
      case 'duration':
        return language === 'en' ? 'Since how long do you have this problem?' :
               language === 'hi' ? 'आपको यह समस्या कब से है?' :
               'ਤੁਹਾਨੂੰ ਇਹ ਸਮੱਸਿਆ ਕਦੋਂ ਤੋਂ ਹੈ?';
      case 'severity':
        return language === 'en' ? 'How strong is the problem?' :
               language === 'hi' ? 'समस्या कितनी गंभीर है?' :
               'ਸਮੱਸਿਆ ਕਿੰਨੀ ਗੰਭੀਰ ਹੈ?';
      case 'additional':
        return language === 'en' ? 'Do you have any of these along with it?' :
               language === 'hi' ? 'क्या आपको इसके साथ इनमें से कोई समस्या है?' :
               'ਕੀ ਤੁਹਾਨੂੰ ਇਸ ਦੇ ਨਾਲ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕੋਈ ਸਮੱਸਿਆ ਹੈ?';
      default:
        return '';
    }
  };

  // Get progress percentage
  const getProgress = () => {
    switch (currentStep) {
      case 'symptoms': return 25;
      case 'duration': return 50;
      case 'severity': return 75;
      case 'additional': return 100;
      default: return 0;
    }
  };

  
  if (currentStep === 'results') {
    const diagnosis = getDiagnosis();
    
    if (!diagnosis) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
          <Card className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Analyze</h2>
            <p className="text-gray-600 mb-4">Please complete the symptom survey to get diagnosis.</p>
            <Button onClick={() => setCurrentStep('symptoms')}>
              Start Again
            </Button>
          </Card>
        </div>
      );
    }

    const severityColor = diagnosis.severity === 'mild' ? 'text-green-600' : 
                         diagnosis.severity === 'moderate' ? 'text-yellow-600' : 'text-red-600';
    const severityBg = diagnosis.severity === 'mild' ? 'bg-green-50' : 
                      diagnosis.severity === 'moderate' ? 'bg-yellow-50' : 'bg-red-50';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="font-bold text-gray-800">
              {language === 'en' ? 'Health Analysis Results' :
               language === 'hi' ? 'स्वास्थ्य विश्लेषण परिणाम' :
               'ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ'}
            </h1>
            <div></div>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto space-y-6">
          {}
          {diagnosis.urgency && (
            <Card className="p-6 bg-red-100 border-red-300">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-red-800 mb-2">
                  {language === 'en' ? '🚨 EMERGENCY - SEEK IMMEDIATE MEDICAL HELP' :
                   language === 'hi' ? '🚨 आपातकाल - तुरंत चिकित्सा सहायता लें' :
                   '🚨 ਐਮਰਜੈਂਸੀ - ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਦਦ ਲਓ'}
                </h2>
                <p className="text-red-700">
                  {language === 'en' ? 'Do not delay - call emergency services or visit hospital immediately' :
                   language === 'hi' ? 'देर न करें - आपातकालीन सेवाओं को कॉल करें या तुरंत अस्पताल जाएं' :
                   'ਦੇਰ ਨਾ ਕਰੋ - ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ ਜਾਂ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ'}
                </p>
              </div>
            </Card>
          )}

          {}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${severityBg} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                <Stethoscope className={`w-8 h-8 ${severityColor}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Analysis Complete' :
                 language === 'hi' ? 'विश्लेषण पूर्ण' :
                 'ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ'}
              </h2>
              <div className={`text-lg font-semibold ${severityColor} mb-2`}>
                {diagnosis.name[language]}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? `Confidence: ${diagnosis.confidence}% • Severity: ${diagnosis.severity}` :
                 language === 'hi' ? `विश्वास: ${diagnosis.confidence}% • गंभीरता: ${diagnosis.severity}` :
                 `ਭਰੋਸਾ: ${diagnosis.confidence}% • ਗੰਭੀਰਤਾ: ${diagnosis.severity}`}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Brain className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="font-semibold text-blue-800">
                  {language === 'en' ? 'Based on Survey' :
                   language === 'hi' ? 'सर्वेक्षण पर आधारित' :
                   'ਸਰਵੇਖਣ ਤੇ ਆਧਾਰਿਤ'}
                </div>
                <div className="text-sm text-blue-600">
                  {language === 'en' ? '4 Questions' :
                   language === 'hi' ? '4 सवाल' :
                   '4 ਸਵਾਲ'}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="font-semibold text-green-800">
                  {language === 'en' ? 'AI Analysis' :
                   language === 'hi' ? 'AI विश्लेषण' :
                   'AI ਵਿਸ਼ਲੇਸ਼ਣ'}
                </div>
                <div className="text-sm text-green-600">{diagnosis.confidence}% {language === 'en' ? 'Confident' : language === 'hi' ? 'विश्वास' : 'ਭਰੋਸਾ'}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <HeartPulse className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="font-semibold text-purple-800">
                  {language === 'en' ? 'Risk Level' :
                   language === 'hi' ? 'जोखिम स्तर' :
                   'ਜੋਖਮ ਪੱਧਰ'}
                </div>
                <div className={`text-sm ${severityColor} capitalize`}>{diagnosis.severity}</div>
              </div>
            </div>
          </Card>

          {}
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-blue-500" />
              {language === 'en' ? '💊 Immediate Medication' :
               language === 'hi' ? '💊 तत्काल दवा' :
               '💊 ਤੁਰੰਤ ਦਵਾਈ'}
            </h3>
            <div className="space-y-3">
              {diagnosis.medication[language].map((med, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Pill className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{med}</span>
                </div>
              ))}
            </div>
          </Card>

          {}
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              {language === 'en' ? '🥗 Diet Recommendations (Rural-Friendly)' :
               language === 'hi' ? '🥗 आहार सुझाव (गांव के अनुकूल)' :
               '🥗 ਖੁਰਾਕ ਸਿਫਾਰਸ਼ਾਂ (ਪਿੰਡ ਅਨੁਕੂਲ)'}
            </h3>
            <div className="space-y-3">
              {diagnosis.diet[language].map((dietItem, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{dietItem}</span>
                </div>
              ))}
            </div>
          </Card>

          {}
          <Card className={`p-6 ${diagnosis.urgency ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <h3 className={`font-bold mb-4 flex items-center ${diagnosis.urgency ? 'text-red-800' : 'text-yellow-800'}`}>
              <AlertTriangle className="w-5 h-5 mr-2" />
              {language === 'en' ? (diagnosis.urgency ? '🚨 EMERGENCY - See Doctor NOW' : '⚠️ See Doctor If:') :
               language === 'hi' ? (diagnosis.urgency ? '🚨 आपातकाल - अभी डॉक्टर से मिलें' : '⚠️ डॉक्टर से मिलें यदि:') :
               (diagnosis.urgency ? '🚨 ਐਮਰਜੈਂਸੀ - ਹੁਣੇ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ' : '⚠️ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ ਜੇ:')}
            </h3>
            <ul className={`space-y-2 text-sm ${diagnosis.urgency ? 'text-red-700' : 'text-yellow-700'}`}>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>
                  {language === 'en' ? 'Symptoms worsen or do not improve in 2-3 days' :
                   language === 'hi' ? 'लक्षण 2-3 दिन में बदतर हों या सुधार न हों' :
                   'ਲੱਛਣ 2-3 ਦਿਨ ਵਿੱਚ ਵਿਗੜ ਜਾਣ ਜਾਂ ਸੁਧਾਰ ਨਾ ਹੋਣ'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>
                  {language === 'en' ? 'High fever (above 103°F/39.4°C)' :
                   language === 'hi' ? 'तेज बुखार (103°F/39.4°C से ऊपर)' :
                   'ਤੇਜ਼ ਬੁਖਾਰ (103°F/39.4°C ਤੋਂ ਉੱਪਰ)'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>
                  {language === 'en' ? 'Difficulty breathing or chest pain' :
                   language === 'hi' ? 'सांस ले���े में कठिनाई या छाती में दर्द' :
                   'ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ ਜਾਂ ਛਾਤੀ ਵਿੱਚ ਦਰਦ'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>
                  {language === 'en' ? 'Severe vomiting or dehydration signs' :
                   language === 'hi' ? 'गंभीर उल्टी या निर्जलीकरण के संकेत' :
                   'ਗੰਭੀਰ ਉਲਟੀ ਜਾਂ ਪਾਣੀ ਦੀ ਕਮੀ ਦੇ ਸੰਕੇਤ'}
                </span>
              </li>
            </ul>
          </Card>

          {}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              size="lg" 
              onClick={() => {
                setSurveyAnswers({
                  selectedSymptom: null,
                  duration: null,
                  severity: null,
                  additionalSymptoms: []
                });
                setCurrentStep('symptoms');
              }}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center"
            >
              <div className="w-6 h-6 mb-2 rounded-full overflow-hidden">
                <ImageWithFallback 
                  src={medbotLogo}
                  alt="MedBOT"
                  className="w-full h-full object-cover"
                />
              </div>
              {language === 'en' ? 'Ask MedBOT Again' :
               language === 'hi' ? 'MedBOT से फिर पूछें' :
               'MedBOT ਨੂੰ ਦੁਬਾਰਾ ਪੁੱਛੋ'}
            </Button>
            <Button 
              size="lg" 
              className="h-auto p-4 flex flex-col items-center bg-green-500 hover:bg-green-600"
              onClick={() => {
                const diagnosis = getDiagnosis();
                if (onConsultDoctor && diagnosis) {
                  
                  const symptomData = {
                    selectedSymptom: surveyAnswers.selectedSymptom,
                    symptomLabel: symptomCategories[language]?.find(s => s.id === surveyAnswers.selectedSymptom)?.label,
                    category: symptomCategories[language]?.find(s => s.id === surveyAnswers.selectedSymptom)?.category,
                    duration: surveyAnswers.duration,
                    severity: surveyAnswers.severity,
                    additionalSymptoms: surveyAnswers.additionalSymptoms,
                    diagnosisName: diagnosis.name[language],
                    confidence: diagnosis.confidence,
                    urgency: diagnosis.urgency,
                    timestamp: new Date()
                  };
                  onConsultDoctor(symptomData);
                }
              }}
            >
              <Stethoscope className="w-6 h-6 mb-2" />
              {language === 'en' ? 'Consult Doctor' :
               language === 'hi' ? 'डॉक्टर से सलाह लें' :
               'ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ'}
            </Button>
          </div>

          {}
          <Card className="p-4 bg-gray-50 border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                <ImageWithFallback 
                  src={medbotLogo}
                  alt="MedBOT"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-2">
                  {language === 'en' ? 'MedBOT Analysis Complete' :
                   language === 'hi' ? 'MedBOT विश्लेषण पूर्ण' :
                   'MedBOT ਵਿਸ਼ਲੇਸ਼ਣ ਮੁਕੰਮਲ'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'MedBOT has analyzed your symptoms using advanced medical AI. This analysis is for informational purposes only. Always consult with a qualified healthcare provider for proper medical diagnosis and treatment. In emergency situations, seek immediate medical attention.' :
                   language === 'hi' ? 'MedBOT ने उन्नत मेडिकल AI का उपयोग करके आपके लक्षणों का विश्लेषण किया है। यह विश्लेषण केवल जानकारी के लिए है। उचित चिकित्सा निदान और उपचार के लिए हमेशा योग्य स्वास्थ्य सेवा प्रदाता से सलाह लें। आपातकालीन स्थितियों में तुरंत चिकित्सा सहायता लें।' :
                   'MedBOT ਨੇ ਐਡਵਾਂਸਡ ਮੈਡੀਕਲ AI ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਹੈ। ਇਹ ਵਿਸ਼ਲੇਸ਼ਣ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹੈ। ਸਹੀ ਮੈਡੀਕਲ ਨਿਦਾਨ ਅਤੇ ਇਲਾਜ ਲਈ ਹਮੇਸ਼ਾ ਯੋਗ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਲਓ। ਐਮਰਜੈਂਸੀ ਸਥਿਤੀਆਂ ਵਿੱਚ ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਦਦ ਲਓ।'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (currentStep === 'duration') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentStep('symptoms')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="font-bold text-gray-800">Question 2 of 4</h1>
            <div className="text-sm text-gray-600">{Math.round(getProgress())}%</div>
          </div>
        </div>

        <div className="p-4 max-w-3xl mx-auto space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 overflow-hidden bg-white shadow-lg">
              <ImageWithFallback 
                src={medbotLogo}
                alt="MedBOT AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-8">
              {getQuestionText()}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {durationOptions[language].map((option) => (
                <Button
                  key={option.id}
                  size="lg"
                  onClick={() => selectDuration(option.id)}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center hover:bg-purple-50 hover:border-purple-300"
                >
                  <span className="text-3xl mb-2">{option.icon}</span>
                  <span className="text-lg">{option.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Question 2 of 4</p>
          </div>
        </div>
      </div>
    );
  }

  
  if (currentStep === 'severity') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentStep('duration')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="font-bold text-gray-800">Question 3 of 4</h1>
            <div className="text-sm text-gray-600">{Math.round(getProgress())}%</div>
          </div>
        </div>

        <div className="p-4 max-w-3xl mx-auto space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 overflow-hidden bg-white shadow-lg">
              <ImageWithFallback 
                src={medbotLogo}
                alt="MedBOT AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-8">
              {getQuestionText()}
            </h2>

            <div className="space-y-4">
              {severityLevels[language].map((level) => (
                <Button
                  key={level.id}
                  size="lg"
                  onClick={() => selectSeverity(level.id)}
                  variant="outline"
                  className={`w-full h-auto p-6 flex items-center justify-between hover:${level.color.split(' ')[1]} hover:border-current`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{level.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-lg">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.desc}</div>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Button>
              ))}
            </div>
          </Card>

          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Question 3 of 4</p>
          </div>
        </div>
      </div>
    );
  }

  
  if (currentStep === 'additional') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentStep('severity')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="font-bold text-gray-800">Question 4 of 4</h1>
            <div className="text-sm text-gray-600">{Math.round(getProgress())}%</div>
          </div>
        </div>

        <div className="p-4 max-w-3xl mx-auto space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 overflow-hidden bg-white shadow-lg">
              <ImageWithFallback 
                src={medbotLogo}
                alt="MedBOT AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-8">
              {getQuestionText()}
            </h2>

            <div className="space-y-3">
              {additionalSymptoms[language].map((symptom) => {
                const IconComponent = symptom.icon;
                const isSelected = surveyAnswers.additionalSymptoms.includes(symptom.id);
                const isUrgent = symptom.urgent;
                
                return (
                  <Button
                    key={symptom.id}
                    size="lg"
                    onClick={() => toggleAdditionalSymptom(symptom.id)}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full h-auto p-4 flex items-center justify-between ${
                      isSelected ? 'bg-purple-500 hover:bg-purple-600' : 
                      isUrgent ? 'hover:bg-red-50 hover:border-red-300' : 
                      'hover:bg-green-50 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <IconComponent className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 
                        isUrgent ? 'text-red-600' : 'text-green-600'
                      }`} />
                      <span className={`font-medium ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}>{symptom.label}</span>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                  </Button>
                );
              })}
            </div>

            {surveyAnswers.additionalSymptoms.length > 0 && (
              <Button 
                size="lg" 
                onClick={proceedToResults}
                className="w-full mt-6 bg-purple-500 hover:bg-purple-600"
              >
                <Brain className="w-5 h-5 mr-2" />
                Get AI Analysis
              </Button>
            )}
          </Card>

          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Question 4 of 4</p>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-gray-800">{t('checkSymptoms')}</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={startVoiceInput}
            disabled={isListening}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {}
        {isListening && (
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <p className="text-purple-700 font-medium">{t('listening')}</p>
              <p className="text-sm text-purple-600 mt-1">
                {language === 'en' ? 'Describe your symptoms...' : 
                 language === 'hi' ? 'अपने लक्षणों का वर्णन करें...' :
                 'ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ...'}
              </p>
            </div>
          </Card>
        )}

        {}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
              <ImageWithFallback 
                src={medbotLogo}
                alt="MedBOT AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">🤖</span>
                {language === 'en' ? 'Meet MedBOT - Your AI Health Assistant' :
                 language === 'hi' ? 'MedBOT से मिलें - आपका AI स्वास्थ्य सहायक' :
                 'MedBOT ਨੂੰ ਮਿਲੋ - ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ'}
              </h3>
              <p className="text-sm text-blue-700">
                {language === 'en' ? 'Select symptoms you\'re experiencing or use voice input. MedBOT will analyze your condition and provide personalized health recommendations.' :
                 language === 'hi' ? 'अपने लक्षण चुनें या वॉइस इनपुट का उपयोग करें। MedBOT आपकी स्थिति का विश्लेषण करेगा और व्यक्तिगत स्वास्थ्य सुझाव देगा।' :
                 'ਆਪਣੇ ਲੱਛਣ ਚੁਣੋ ਜਾਂ ਵੌਇਸ ਇਨਪੁਟ ਦਾ ਉਪਯੋਗ ਕਰੋ। MedBOT ਤੁਹਾਡੀ ਸਥਿਤੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੇਗਾ ਅਤੇ ਵਿਅਕਤੀਗਤ ਸਿਹਤ ਸਿਫਾਰਸ਼ਾਂ ਦੇਵੇਗਾ।'}
              </p>
              <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded-full px-3 py-1 inline-block">
                {language === 'en' ? '⚡ Powered by Advanced Medical AI' :
                 language === 'hi' ? '⚡ उन्नत मेडिकल AI द्वारा संचालित' :
                 '⚡ ਐਡਵਾਂਸਡ ਮੈਡੀਕਲ AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ'}
              </div>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6 text-center bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getQuestionText()}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === 'en' ? 'Tap on the problem you are facing' :
             language === 'hi' ? 'अपनी समस्या पर टैप करें' :
             'ਆਪਣੀ ਸਮੱਸਿਆ \'ਤੇ ਟੈਪ ਕਰੋ'}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all" 
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </Card>

        {}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 text-center">
            {language === 'en' ? '🏥 Choose your main health concern' :
             language === 'hi' ? '🏥 अपनी मुख्य स्वास्थ्य समस्या चुनें' :
             '🏥 ਆਪਣੀ ਮੁੱਖ ਸਿਹਤ ਸਮੱਸਿਆ ਚੁਣੋ'}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {symptomCategories[language].map((symptom) => {
              const IconComponent = symptom.icon;
              return (
                <Card 
                  key={symptom.id}
                  className="p-6 text-center cursor-pointer transition-all transform hover:scale-105 hover:shadow-lg hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => selectSymptom(symptom.id)}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm leading-relaxed">
                    {symptom.label}
                  </h4>
                </Card>
              );
            })}
          </div>
        </div>

        {}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-800 mb-2">
                {language === 'en' ? 'Important MedBOT Disclaimer' :
                 language === 'hi' ? 'महत्वपूर्ण MedBOT अस्वीकरण' :
                 'ਮਹੱਤਵਪੂਰਨ MedBOT ਅਸਵੀਕਰਣ'}
              </h3>
              <p className="text-sm text-yellow-700">
                {language === 'en' ? 'MedBOT AI is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.' :
                 language === 'hi' ? 'MedBOT AI केवल जानकारी के उद्देश्यों के लिए है और यह पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। चिकित्सा संबंधी चिंताओं के लिए हमेशा योग्य स्वास्थ्य सेवा प्रदाता से सलाह लें।' :
                 'MedBOT AI ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਹੈ ਅਤੇ ਇਹ ਪੁਟਰ ਮੈਡੀਕਲ ਸਲਾਹ, ਨਿਦਾਨ ਜਾਂ ਇਲਾ��� ਦਾ ਵਿਕਲਪ ਨਹੀਂ ਹੈ। ਮੈਡੀਕਲ ਸਬੰਧੀ ਚਿੰਤਾਵਾਂ ਲਈ ਹਮੇਸ਼ਾ ਯੋਗ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਲਓ।'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}