import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Heart, 
  Brain, 
  Sun, 
  Moon, 
  Smile, 
  Frown,
  MessageCircle,
  Phone,
  Headphones,
  Star,
  AlertCircle,
  CheckCircle,
  Activity,
  Clock,
  Users,
  Shield,
  Lightbulb,
  TreePine,
  Music,
  BookOpen,
  Camera,
  Leaf,
  Gamepad2,
  Trophy,
  Target,
  Zap,
  Puzzle,
  RotateCcw,
  Award,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MentalHealthAwarenessProps {
  onBack: () => void;
}

type MentalHealthPanel = 'dashboard' | 'mood-tracker' | 'breathing-exercise' | 'resources' | 'emergency-contacts' | 'wellness-tips' | 'meditation' | 'iq-games';

interface MoodEntry {
  date: string;
  mood: string;
  energy: number;
  stress: number;
  notes: string;
}

interface Game {
  id: string;
  name: string;
  nameHi: string;
  namePa: string;
  description: string;
  descriptionHi: string;
  descriptionPa: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'memory' | 'logic' | 'math' | 'pattern';
  estimatedTime: number; 
  medCoinsReward: number;
}

export function MentalHealthAwareness({ onBack }: MentalHealthAwarenessProps) {
  const { t, language } = useLanguage();
  const [activePanel, setActivePanel] = useState<MentalHealthPanel>('dashboard');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [moodNotes, setMoodNotes] = useState<string>('');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  
  
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [userStats, setUserStats] = useState({
    gamesPlayed: 12,
    totalScore: 1250,
    streak: 5,
    medCoinsEarned: 180
  });

  const translations = {
    en: {
      mentalHealthAwareness: "Mental Health Awareness",
      yourMentalWellbeing: "Your Mental Wellbeing",
      comprehensiveMentalHealth: "Comprehensive mental health support designed for rural communities with culturally sensitive approaches.",
      moodTracker: "Mood Tracker",
      breathingExercise: "Breathing Exercise",
      wellnessResources: "Wellness Resources",
      emergencyContacts: "Emergency Contacts",
      wellnessTips: "Wellness Tips",
      meditation: "Meditation",
      
      howAreYouFeeling: "How are you feeling today?",
      selectYourMood: "Select your mood",
      veryHappy: "Very Happy",
      happy: "Happy",
      neutral: "Neutral",
      sad: "Sad",
      verySad: "Very Sad",
      anxious: "Anxious",
      stressed: "Stressed",
      energyLevel: "Energy Level",
      stressLevel: "Stress Level",
      addNotes: "Add notes (optional)",
      saveMoodEntry: "Save Mood Entry",
      moodEntrySaved: "Mood entry saved successfully!",
      
      breathingExerciseTitle: "4-7-8 Breathing Exercise",
      breathingDescription: "A simple breathing technique to reduce anxiety and promote relaxation.",
      inhaleFor4: "Inhale for 4 seconds",
      holdFor7: "Hold for 7 seconds",
      exhaleFor8: "Exhale for 8 seconds",
      startBreathing: "Start Breathing",
      stopBreathing: "Stop Breathing",
      breathingInhale: "Breathe In...",
      breathingHold: "Hold...",
      breathingExhale: "Breathe Out...",
      completedCycles: "Completed Cycles",
      
      mentalHealthHelpline: "Mental Health Helpline",
      suicidePrevention: "Suicide Prevention",
      crisisSupport: "Crisis Support",
      call24x7: "24x7 Support Available",
      textSupport: "Text Support",
      onlineChat: "Online Chat",
      
      stressManagement: "Stress Management",
      anxietyHelp: "Anxiety Help",
      depressionSupport: "Depression Support",
      sleepHygiene: "Sleep Hygiene",
      relationshipHelp: "Relationship Help",
      workStress: "Work Stress",
      familySupport: "Family Support",
      selfCare: "Self Care",
      
      dailyTips: "Daily Wellness Tips",
      morningRoutine: "Morning Routine",
      eveningWind: "Evening Wind Down",
      stayConnected: "Stay Connected",
      physicalActivity: "Physical Activity",
      healthyEating: "Healthy Eating",
      limitNews: "Limit News Consumption",
      practiceGratitude: "Practice Gratitude",
      seekHelp: "Seek Help When Needed",
      
      morningTip: "Start your day with 5 minutes of deep breathing or light stretching. Set positive intentions for the day ahead.",
      eveningTip: "Create a calming bedtime routine. Dim lights, avoid screens, and practice gratitude for three things from your day.",
      socialTip: "Reach out to friends and family regularly. Social connections are crucial for mental health and wellbeing.",
      exerciseTip: "Aim for 30 minutes of physical activity daily. Even a short walk can boost mood and reduce stress significantly.",
      nutritionTip: "Eat regular, balanced meals. Include fruits, vegetables, and whole grains. Limit caffeine and sugar intake.",
      mediaTip: "Limit exposure to negative news and social media. Set specific times for checking updates and stick to them.",
      gratitudeTip: "Keep a gratitude journal. Write down three things you're grateful for each day to shift focus to positive aspects.",
      supportTip: "Don't hesitate to seek professional help when needed. Mental health is as important as physical health.",
      
      guidedMeditation: "Guided Meditation",
      mindfulness: "Mindfulness",
      bodyScanning: "Body Scanning",
      lovingKindness: "Loving Kindness",
      natureSounds: "Nature Sounds",
      meditationBenefits: "Regular meditation can reduce stress, improve focus, and enhance emotional wellbeing.",
      startMeditation: "Start Meditation"
    },
    hi: {
      mentalHealthAwareness: "मानसिक स्वास्थ्य जागरूकता",
      yourMentalWellbeing: "आपकी मानसिक कल्याण",
      comprehensiveMentalHealth: "सांस्कृतिक रूप से संवेदनशील दृष्टिकोण के साथ ग्रामीण समुदायों के लिए डिज़ाइन किया गया व्यापक मानसिक स्वास्थ्य समर्थन।",
      moodTracker: "मूड ट्रैकर",
      breathingExercise: "सांस लेने का अभ्यास",
      wellnessResources: "कल्याण संसाधन",
      emergencyContacts: "आपातकालीन संपर्क",
      wellnessTips: "कल्याण टिप्स",
      meditation: "ध्यान",
      howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
      selectYourMood: "अपना मूड चुनें",
      veryHappy: "बहुत खुश",
      happy: "खुश",
      neutral: "सामान्य",
      sad: "उदास",
      verySad: "बहुत उदास",
      anxious: "चिंतित",
      stressed: "तनावग्रस्त",
      energyLevel: "ऊर्जा स्तर",
      stressLevel: "तनाव स्तर",
      addNotes: "नोट्स जोड़ें (वैकल्पिक)",
      saveMoodEntry: "मूड एंट्री सेव करें",
      moodEntrySaved: "मूड एंट्री सफलतापूर्वक सेव की गई!",
      breathingExerciseTitle: "4-7-8 सांस लेने का अभ्यास",
      breathingDescription: "चिंता कम करने और विश्राम को बढ़ावा देने के लिए एक सरल सांस तकनीक।",
      inhaleFor4: "4 सेकंड के लिए सांस लें",
      holdFor7: "7 सेकंड के लिए रोकें",
      exhaleFor8: "8 सेकंड के लिए छोड़ें",
      startBreathing: "सांस शुरू करें",
      stopBreathing: "सांस रोकें",
      breathingInhale: "सांस लें...",
      breathingHold: "रोकें...",
      breathingExhale: "सांस छोड़ें...",
      completedCycles: "पूर्ण चक्र",
      mentalHealthHelpline: "मानसिक स्वास्थ्य हेल्पलाइन",
      suicidePrevention: "आत्महत्या रोकथाम",
      crisisSupport: "संकट सहायता",
      call24x7: "24x7 सहायता उपलब्ध",
      textSupport: "टेक्स्ट सहायता",
      onlineChat: "ऑनलाइन चैट",
      stressManagement: "तनाव प्रबंधन",
      anxietyHelp: "चिंता सहायता",
      depressionSupport: "अवसाद सहायता",
      sleepHygiene: "नींद की स्वच्छता",
      relationshipHelp: "रिश्ते की सहायता",
      workStress: "कार्य तनाव",
      familySupport: "पारिवारिक सहायता",
      selfCare: "स्वयं की देखभाल",
      dailyTips: "दैनिक कल्याण टिप्स",
      morningRoutine: "सुबह की दिनचर्या",
      eveningWind: "शाम की शांति",
      stayConnected: "जुड़े रहें",
      physicalActivity: "शारीरिक गतिविधि",
      healthyEating: "स्वस्थ भोजन",
      limitNews: "समाचार सीमित करें",
      practiceGratitude: "कृतज्ञता का अभ्यास",
      seekHelp: "जरूरत पड़ने पर मदद लें",
      morningTip: "अपने दिन की शुरुआत 5 मिनट की गहरी सांस या हल्की स्ट्रेचिंग से करें। दिन के लिए सकारात्मक इरादे निर्धारित करें।",
      eveningTip: "एक शांत सोने की दिनचर्या बनाएं। लाइट कम करें, स्क्रीन से बचें, और अपने दिन की तीन चीजों के लिए कृतज्ञता का अभ्यास करें।",
      socialTip: "मित्रों और परिवार से नियमित रूप से संपर्क करें। सामाजिक संबंध मानसिक स्वास्थ्य के लिए महत्वपूर्ण हैं।",
      exerciseTip: "दैनिक 30 मिनट की शारीरिक गतिविधि का लक्ष्य रखें। एक छोटी सी सैर भी मूड बेहतर बना सकती है।",
      nutritionTip: "नियमित, संतुलित भोजन करें। फल, सब्जियां और होल ग्रेन शामिल करें। कैफीन और चीनी सीमित करें।",
      mediaTip: "नकारात्मक समाचार और सोशल मीडिया के संपर्क को सीमित करें। अपडेट चेक करने के लिए विशिष्ट समय निर्धारित करें।",
      gratitudeTip: "कृतज्ञता डायरी रखें। प्रतिदिन तीन चीजें लिखें जिनके लिए आप आभारी हैं।",
      supportTip: "जरूरत पड़ने पर पेशेवर मदद लेने में संकोच न करें। मानसिक स्वास्थ्य उतना ही महत्वपूर्ण है जितना शारीरिक स्वास्थ्य।",
      guidedMeditation: "निर्देशित ध्यान",
      mindfulness: "सचेतता",
      bodyScanning: "शरीर स्कैनिंग",
      lovingKindness: "प्रेमपूर्ण दयालुता",
      natureSounds: "प्राकृतिक ध्वनियां",
      meditationBenefits: "नियमित ध्यान तनाव कम कर सकता है, फोकस बेहतर बना सकता है, और भावनात्मक कल्याण बढ़ा सकता है।",
      startMeditation: "ध्यान शुरू करें"
    },
    pa: {
      mentalHealthAwareness: "ਮਾਨਸਿਕ ਸਿਹਤ ਜਾਗਰੂਕਤਾ",
      yourMentalWellbeing: "ਤੁਹਾਡੀ ਮਾਨਸਿਕ ਤੰਦਰੁਸਤੀ",
      comprehensiveMentalHealth: "ਸੱਭਿਆਚਾਰਕ ਤੌਰ 'ਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਪਹੁੰਚ ਦੇ ਨਾਲ ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਵਿਆਪਕ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ।",
      moodTracker: "ਮੂਡ ਟਰੈਕਰ",
      breathingExercise: "ਸਾਹ ਦੀ ਕਸਰਤ",
      wellnessResources: "ਤੰਦਰੁਸਤੀ ਸਰੋਤ",
      emergencyContacts: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
      wellnessTips: "ਤੰਦਰੁਸਤੀ ਟਿੱਪਸ",
      meditation: "ਧਿਆਨ",
      howAreYouFeeling: "ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
      selectYourMood: "ਆਪਣਾ ਮੂਡ ਚੁਣੋ",
      veryHappy: "ਬਹੁਤ ਖੁਸ਼",
      happy: "ਖੁਸ਼",
      neutral: "ਆਮ",
      sad: "ਉਦਾਸ",
      verySad: "ਬਹੁਤ ਉਦਾਸ",
      anxious: "ਚਿੰਤਤ",
      stressed: "ਤਣਾਵਗ੍ਰਸਤ",
      energyLevel: "ਊਰਜਾ ਪੱਧਰ",
      stressLevel: "ਤਣਾਅ ਪੱਧਰ",
      addNotes: "ਨੋਟਸ ਜੋੜੋ (ਵਿਕਲਪਿਕ)",
      saveMoodEntry: "ਮੂਡ ਐਂਟਰੀ ਸੇਵ ਕਰੋ",
      moodEntrySaved: "ਮੂਡ ਐਂਟਰੀ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਕੀਤੀ ਗਈ!",
      breathingExerciseTitle: "4-7-8 ਸਾਹ ਦੀ ਕਸਰਤ",
      breathingDescription: "ਚਿੰਤਾ ਘਟਾਉਣ ਅਤੇ ਆਰਾਮ ਨੂੰ ਵਧਾਉਣ ਲਈ ਇੱਕ ਸਾਦਾ ਸਾਹ ਤਕਨੀਕ।",
      inhaleFor4: "4 ਸਕਿੰਟ ਲਈ ਸਾਹ ਲਓ",
      holdFor7: "7 ਸਕਿੰਟ ਲਈ ਰੋਕੋ",
      exhaleFor8: "8 ਸਕਿੰਟ ਲਈ ਛੱਡੋ",
      startBreathing: "ਸਾਹ ਸ਼ੁਰੂ ਕਰੋ",
      stopBreathing: "ਸਾਹ ਬੰਦ ਕਰੋ",
      breathingInhale: "ਸਾਹ ਲਓ...",
      breathingHold: "ਰੋਕੋ...",
      breathingExhale: "ਸਾਹ ਛੱਡੋ...",
      completedCycles: "ਪੂਰੇ ਚੱਕਰ",
      mentalHealthHelpline: "ਮਾਨਸਿਕ ਸਿਹਤ ਹੈਲਪਲਾਈਨ",
      suicidePrevention: "ਖੁਦਕੁਸ਼ੀ ਰੋਕਥਾਮ",
      crisisSupport: "ਸੰਕਟ ਸਹਾਇਤਾ",
      call24x7: "24x7 ਸਹਾਇਤਾ ਉਪਲਬਧ",
      textSupport: "ਟੈਕਸਟ ਸਹਾਇਤਾ",
      onlineChat: "ਔਨਲਾਈਨ ਚੈਟ",
      stressManagement: "ਤਣਾਅ ਪ੍ਰਬੰਧਨ",
      anxietyHelp: "ਚਿੰਤਾ ਸਹਾਇਤਾ",
      depressionSupport: "ਡਿਪਰੈਸ਼ਨ ਸਹਾਇਤਾ",
      sleepHygiene: "ਨੀਂਦ ਦੀ ਸਫਾਈ",
      relationshipHelp: "ਰਿਸ਼ਤੇ ਦੀ ਸਹਾਇਤਾ",
      workStress: "ਕੰਮ ਦਾ ਤਣਾਅ",
      familySupport: "ਪਰਿਵਾਰਿਕ ਸਹਾਇਤਾ",
      selfCare: "ਸਵੈ-ਦੇਖਭਾਲ",
      dailyTips: "ਰੋਜ਼ਾਨਾ ਤੰਦਰੁਸਤੀ ਟਿੱਪਸ",
      morningRoutine: "ਸਵੇਰੇ ਦੀ ਰੂਟੀਨ",
      eveningWind: "ਸ਼ਾਮ ਦੀ ਸ਼ਾਂਤੀ",
      stayConnected: "ਜੁੜੇ ਰਹੋ",
      physicalActivity: "ਸਰੀਰਕ ਗਤੀਵਿਧੀ",
      healthyEating: "ਸਿਹਤਮੰਦ ਖਾਣਾ",
      limitNews: "ਖਬਰਾਂ ਸੀਮਤ ਕਰੋ",
      practiceGratitude: "ਸ਼ੁਕਰਗੁਜ਼ਾਰੀ ਦਾ ਅਭਿਆਸ",
      seekHelp: "ਲੋੜ ਪੈਣ 'ਤੇ ਮਦਦ ਲਓ",
      morningTip: "ਆਪਣੇ ਦਿਨ ਦੀ ਸ਼ੁਰੂਆਤ 5 ਮਿੰਟ ਦੀ ਡੂੰਘੀ ਸਾਹ ਜਾਂ ਹਲਕੀ ਸਟਰੈਚਿੰਗ ਨਾਲ ਕਰੋ।",
      eveningTip: "ਇੱਕ ਸ਼ਾਂਤ ਸੌਣ ਦੀ ਰੂਟੀਨ ਬਣਾਓ। ਲਾਈਟ ਘੱਟ ਕਰੋ, ਸਕਰੀਨ ਤੋਂ ਬਚੋ।",
      socialTip: "ਦੋਸਤਾਂ ਅਤੇ ਪਰਿਵਾਰ ਨਾਲ ਨਿਯਮਿਤ ਸੰਪਰਕ ਰੱਖੋ। ਸਮਾਜਿਕ ਸੰਬੰਧ ਮਾਨਸਿਕ ਸਿਹਤ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹਨ।",
      exerciseTip: "ਰੋਜ਼ਾਨਾ 30 ਮਿੰਟ ਸਰੀਰਕ ਗਤੀਵਿਧੀ ਦਾ ਟੀਚਾ ਰੱਖੋ। ਇੱਕ ਛੋਟੀ ਸੈਰ ਵੀ ਮੂਡ ਬਿਹਤਰ ਬਣਾ ਸਕਦੀ ਹੈ।",
      nutritionTip: "ਨਿਯਮਿਤ, ਸੰਤੁਲਿਤ ਭੋਜਨ ਖਾਓ। ਫਲ, ਸਬਜ਼ੀਆਂ ਅਤੇ ਸਾਬਤ ਅਨਾਜ ਸ਼ਾਮਲ ਕਰੋ।",
      mediaTip: "ਨਕਾਰਾਤਮਕ ਖਬਰਾਂ ਅਤੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ਦੇ ਸੰਪਰਕ ਨੂੰ ਸੀਮਤ ਕਰੋ।",
      gratitudeTip: "ਸ਼ੁਕਰਗੁਜ਼ਾਰੀ ਡਾਇਰੀ ਰੱਖੋ। ਰੋਜ਼ਾਨਾ ਤਿੰਨ ਚੀਜ਼ਾਂ ਲਿਖੋ ਜਿਨ੍ਹਾਂ ਲਈ ਤੁਸੀਂ ਆਭਾਰੀ ਹੋ।",
      supportTip: "ਲੋੜ ਪੈਣ 'ਤੇ ਪੇਸ਼ੇਵਰ ਮਦਦ ਲੈਣ ਵਿੱਚ ਝਿਜਕ ਨਾ ਕਰੋ। ਮਾਨਸਿਕ ਸਿਹਤ ਓਨੀ ਹੀ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਿੰਨੀ ਸਰੀਰਕ ਸਿਹਤ।",
      guidedMeditation: "ਗਾਈਡਿਡ ਧਿਆਨ",
      mindfulness: "ਸੁਚੇਤਤਾ",
      bodyScanning: "ਸਰੀਰ ਸਕੈਨਿੰਗ",
      lovingKindness: "ਪਿਆਰ ਭਰੀ ਦਇਆ",
      natureSounds: "ਕੁਦਰਤੀ ਆਵਾਜ਼ਾਂ",
      meditationBenefits: "ਨਿਯਮਿਤ ਧਿਆਨ ਤਣਾਅ ਘਟਾ ਸਕਦਾ ਹੈ, ਧਿਆਨ ਬਿਹਤਰ ਬਣਾ ਸਕਦਾ ਹੈ, ਅਤੇ ਭਾਵਨਾਤਮਕ ਤੰਦਰੁਸਤੀ ਵਧਾ ਸਕਦਾ ਹੈ।",
      startMeditation: "ਧਿਆਨ ਸ਼ੁਰੂ ਕਰੋ"
    }
  };

  const getTranslation = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  
  const games: Game[] = [
    {
      id: 'memory-cards',
      name: 'Memory Cards',
      nameHi: 'मेमोरी कार्ड',
      namePa: 'ਮੈਮੋਰੀ ਕਾਰਡ',
      description: 'Match pairs of cards to improve memory',
      descriptionHi: 'स्मृति सुधारने के लिए कार्डों के जोड़े मिलाएं',
      descriptionPa: 'ਯਾਦਦਾਸ਼ਤ ਸੁਧਾਰਨ ਲਈ ਕਾਰਡਾਂ ਦੇ ਜੋੜੇ ਮਿਲਾਓ',
      icon: Brain,
      difficulty: 'easy',
      category: 'memory',
      estimatedTime: 5,
      medCoinsReward: 10
    },
    {
      id: 'number-sequence',
      name: 'Number Sequence',
      nameHi: 'संख्या क्रम',
      namePa: 'ਸੰਖਿਆ ਕ੍ਰਮ',
      description: 'Find the missing number in sequence',
      descriptionHi: 'क्रम में लापता संख्या खोजें',
      descriptionPa: 'ਕ੍ਰਮ ਵਿੱਚ ਗੁੰਮ ਸੰਖਿਆ ਲੱਭੋ',
      icon: Target,
      difficulty: 'medium',
      category: 'math',
      estimatedTime: 3,
      medCoinsReward: 15
    },
    {
      id: 'pattern-match',
      name: 'Pattern Match',
      nameHi: 'पैटर्न मैच',
      namePa: 'ਪੈਟਰਨ ਮੈਚ',
      description: 'Identify and complete patterns',
      descriptionHi: 'पैटर्न की पहचान करें और पूरा करें',
      descriptionPa: 'ਪੈਟਰਨ ਦੀ ਪਛਾਣ ਕਰੋ ਅਤੇ ਪੂਰਾ ਕਰੋ',
      icon: Puzzle,
      difficulty: 'hard',
      category: 'pattern',
      estimatedTime: 7,
      medCoinsReward: 25
    },
    {
      id: 'logic-puzzle',
      name: 'Logic Puzzle',
      nameHi: 'तर्क पहेली',
      namePa: 'ਤਰਕ ਬੁਝਾਰਤ',
      description: 'Solve logical reasoning problems',
      descriptionHi: 'तार्किक तर्क समस्याओं को हल करें',
      descriptionPa: 'ਤਰਕਸ਼ੀਲ ਤਰਕ ਸਮੱਸਿਆਵਾਂ ਹੱਲ ਕਰੋ',
      icon: Zap,
      difficulty: 'medium',
      category: 'logic',
      estimatedTime: 6,
      medCoinsReward: 20
    }
  ];

  const getName = (game: Game) => {
    return language === 'hi' ? game.nameHi : language === 'pa' ? game.namePa : game.name;
  };

  const getDescription = (game: Game) => {
    return language === 'hi' ? game.descriptionHi : language === 'pa' ? game.descriptionPa : game.description;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return '🧠';
      case 'logic': return '🔍';
      case 'math': return '🔢';
      case 'pattern': return '🧩';
      default: return '🎮';
    }
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setGameCompleted(true);
    
    
    setUserStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + score,
      streak: prev.streak + 1,
      medCoinsEarned: prev.medCoinsEarned + (selectedGame?.medCoinsReward || 0)
    }));

    toast.success(
      `🎉 ${language === 'en' ? 'Game completed! Score:' : language === 'hi' ? 'खेल पूरा! स्कोर:' : 'ਖੇਡ ਪੂਰੀ! ਸਕੋਰ:'} ${score}`
    );
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameCompleted(false);
    setFinalScore(0);
  };

  
  const MemoryCardGame = ({ onComplete, language }: { onComplete: (score: number) => void; language: string }) => {
    const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);

    const symbols = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒'];

    React.useEffect(() => {
      
      const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
      const initialCards = shuffledSymbols.map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false
      }));
      setCards(initialCards);
    }, []);

    React.useEffect(() => {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        onComplete(score);
      }
    }, [timeLeft, score, onComplete]);

    const handleCardClick = (cardId: number) => {
      if (flippedCards.length === 2) return;
      if (cards[cardId].flipped || cards[cardId].matched) return;

      const newCards = [...cards];
      newCards[cardId].flipped = true;
      setCards(newCards);

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setMoves(moves + 1);
        
        setTimeout(() => {
          const [first, second] = newFlippedCards;
          const updatedCards = [...newCards];
          
          if (updatedCards[first].symbol === updatedCards[second].symbol) {
            updatedCards[first].matched = true;
            updatedCards[second].matched = true;
            setScore(score + 10);
            
            
            if (updatedCards.every(card => card.matched)) {
              onComplete(score + 10 + (timeLeft * 2)); 
            }
          } else {
            updatedCards[first].flipped = false;
            updatedCards[second].flipped = false;
          }
          
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>{moves} {language === 'en' ? 'moves' : language === 'hi' ? 'चालें' : 'ਚਾਲਾਂ'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`aspect-square rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center text-2xl ${
                card.flipped || card.matched
                  ? card.matched
                    ? 'bg-green-100 border-green-300'
                    : 'bg-blue-100 border-blue-300'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.flipped || card.matched ? card.symbol : '?'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const moodOptions = [
    { id: 'very-happy', label: getTranslation('veryHappy'), emoji: '😁', color: 'bg-green-100 border-green-300' },
    { id: 'happy', label: getTranslation('happy'), emoji: '😊', color: 'bg-green-100 border-green-300' },
    { id: 'neutral', label: getTranslation('neutral'), emoji: '😐', color: 'bg-gray-100 border-gray-300' },
    { id: 'sad', label: getTranslation('sad'), emoji: '😢', color: 'bg-blue-100 border-blue-300' },
    { id: 'very-sad', label: getTranslation('verySad'), emoji: '😭', color: 'bg-blue-100 border-blue-300' },
    { id: 'anxious', label: getTranslation('anxious'), emoji: '😰', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'stressed', label: getTranslation('stressed'), emoji: '😫', color: 'bg-red-100 border-red-300' }
  ];

  const emergencyContacts = [
    {
      name: getTranslation('mentalHealthHelpline'),
      number: "1800-599-0019",
      description: getTranslation('call24x7'),
      icon: Phone,
      color: "bg-blue-500"
    },
    {
      name: getTranslation('suicidePrevention'),
      number: "1860-266-2345",
      description: getTranslation('crisisSupport'),
      icon: Shield,
      color: "bg-red-500"
    },
    {
      name: getTranslation('textSupport'),
      number: "741741",
      description: getTranslation('textSupport'),
      icon: MessageCircle,
      color: "bg-green-500"
    }
  ];

  const handleMoodSave = () => {
    if (!selectedMood) return;

    const moodEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: selectedMood,
      energy: energyLevel,
      stress: stressLevel,
      notes: moodNotes
    };

    const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    existingEntries.push(moodEntry);
    localStorage.setItem('moodEntries', JSON.stringify(existingEntries));

    toast.success(getTranslation('moodEntrySaved'));
    setSelectedMood('');
    setEnergyLevel(5);
    setStressLevel(5);
    setMoodNotes('');
    setActivePanel('dashboard');
  };

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    const exerciseCycle = () => {
      
      setBreathingPhase('inhale');
      setTimeout(() => {
        if (!breathingActive) return;
        
        
        setBreathingPhase('hold');
        setTimeout(() => {
          if (!breathingActive) return;
          
          
          setBreathingPhase('exhale');
          setTimeout(() => {
            if (!breathingActive) return;
            
            setBreathingCount(prev => prev + 1);
            if (breathingActive) {
              exerciseCycle(); 
            }
          }, 8000);
        }, 7000);
      }, 4000);
    };
    
    exerciseCycle();
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
  };

  
  if (activePanel === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {getTranslation('mentalHealthAwareness')}
                </h1>
                <p className="text-sm text-gray-600">
                  {getTranslation('yourMentalWellbeing')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {}
          <Card className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🧠 {getTranslation('yourMentalWellbeing')}
              </h2>
              <p className="text-gray-600 mb-4">
                {getTranslation('comprehensiveMentalHealth')}
              </p>
            </div>
          </Card>

          {}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('mood-tracker')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Smile className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getTranslation('moodTracker')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Track your daily mood, energy levels, and emotional wellbeing patterns.
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <span className="text-2xl">😊</span>
                  <span className="text-2xl">😐</span>
                  <span className="text-2xl">😔</span>
                </div>
                <span className="text-sm text-gray-500">Daily tracking</span>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('breathing-exercise')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getTranslation('breathingExercise')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Guided breathing exercises to reduce anxiety and promote calm.
              </p>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-500">4-7-8 Technique</span>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('wellness-tips')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getTranslation('wellnessTips')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Daily wellness tips and strategies for better mental health.
              </p>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-500">Expert advice</span>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('emergency-contacts')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getTranslation('emergencyContacts')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Crisis support and emergency mental health helplines.
              </p>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-500">24/7 Support</span>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('resources')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getTranslation('wellnessResources')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Educational resources and self-help materials.
              </p>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-500">Self-care guides</span>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('meditation')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <TreePine className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getTranslation('meditation')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Guided meditation sessions for stress relief and mindfulness.
              </p>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-indigo-500" />
                <span className="text-sm text-gray-500">Mindfulness</span>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('iq-games')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {language === 'en' ? 'Brain Games' : language === 'hi' ? 'ब्रेन गेम्स' : 'ਬ੍ਰੇਨ ਗੇਮਜ਼'}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'Exercise your brain with fun cognitive games and puzzles.' : language === 'hi' ? 'मजेदार संज्ञानात्मक खेलों और पहेलियों के साथ अपने दिमाग का व्यायाम करें।' : 'ਮਜ਼ੇਦਾਰ ਬੋਧਾਤਮਕ ਖੇਡਾਂ ਅਤੇ ਬੁਝਾਰਤਾਂ ਨਾਲ ਆਪਣੇ ਦਿਮਾਗ ਦਾ ਕਸਰਤ ਕਰੋ।'}
              </p>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-500">
                  {language === 'en' ? 'Earn rewards' : language === 'hi' ? 'पुरस्कार जीतें' : 'ਇਨਾਮ ਜਿੱਤੋ'}
                </span>
              </div>
            </Card>
          </div>

          {}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              🌟 Mental Health Matters
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">
                  {language === 'en' ? 'It\'s okay to not be okay' : language === 'hi' ? 'ठीक नहीं होना ठीक है' : 'ਠੀਕ ਨਾ ਹੋਣਾ ਠੀਕ ਹੈ'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">
                  {language === 'en' ? 'You are not alone' : language === 'hi' ? 'आप अकेले नहीं हैं' : 'ਤੁਸੀਂ ਇਕੱਲੇ ਨਹੀਂ ਹੋ'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">
                  {language === 'en' ? 'Seeking help is strength' : language === 'hi' ? 'मदद मांगना ताकत है' : 'ਮਦਦ ਮੰਗਣਾ ਤਾਕਤ ਹੈ'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'mood-tracker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {getTranslation('moodTracker')}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {getTranslation('howAreYouFeeling')}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {getTranslation('selectYourMood')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {moodOptions.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      className={`p-4 h-auto flex flex-col space-y-2 ${
                        selectedMood === mood.id 
                          ? 'bg-blue-500 text-white' 
                          : mood.color
                      }`}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('energyLevel')}: {energyLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('stressLevel')}: {stressLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('addNotes')}
                </label>
                <textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="How are you feeling today? Any thoughts or observations..."
                />
              </div>

              <Button
                onClick={handleMoodSave}
                disabled={!selectedMood}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              >
                {getTranslation('saveMoodEntry')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'breathing-exercise') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {getTranslation('breathingExercise')}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {getTranslation('breathingExerciseTitle')}
            </h3>
            <p className="text-gray-600 mb-8">
              {getTranslation('breathingDescription')}
            </p>

            {!breathingActive ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4 text-blue-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>{getTranslation('inhaleFor4')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-purple-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>{getTranslation('holdFor7')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-green-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>{getTranslation('exhaleFor8')}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startBreathingExercise}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg py-4"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  {getTranslation('startBreathing')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`w-32 h-32 rounded-full border-4 mx-auto flex items-center justify-center transition-all duration-1000 ${
                  breathingPhase === 'inhale' ? 'border-blue-500 bg-blue-100 scale-110' :
                  breathingPhase === 'hold' ? 'border-purple-500 bg-purple-100 scale-110' :
                  'border-green-500 bg-green-100 scale-90'
                }`}>
                  <span className="text-2xl font-bold text-gray-700">
                    {breathingPhase === 'inhale' ? getTranslation('breathingInhale') :
                     breathingPhase === 'hold' ? getTranslation('breathingHold') :
                     getTranslation('breathingExhale')}
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {getTranslation('completedCycles')}: {breathingCount}
                  </p>
                  <Button
                    onClick={stopBreathingExercise}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    {getTranslation('stopBreathing')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'emergency-contacts') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {getTranslation('emergencyContacts')}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700 font-medium">
                {language === 'en' 
                  ? 'If you\'re having thoughts of self-harm or suicide, please reach out immediately.'
                  : language === 'hi'
                  ? 'यदि आप आत्म-हानि या आत्महत्या के विचार रख रहे हैं, तो कृपया तुरंत संपर्क करें।'
                  : 'ਜੇ ਤੁਸੀਂ ਸਵੈ-ਨੁਕਸਾਨ ਜਾਂ ਖੁਦਕੁਸ਼ੀ ਦੇ ਵਿਚਾਰ ਰੱਖ ਰਹੇ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਸੰਪਰਕ ਕਰੋ।'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="p-6 border-2 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center`}>
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{contact.name}</h3>
                    <p className="text-gray-600">{contact.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">{contact.number}</div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        window.location.href = `tel:${contact.number}`;
                        toast.success(getTranslation('call24x7'));
                      }}
                      className={`${contact.color} text-white`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const message = language === 'en' 
                          ? 'I need mental health support.' 
                          : language === 'hi'
                          ? 'मुझे मानसिक स्वास्थ्य सहायता चाहिए।'
                          : 'ਮੈਨੂੰ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।';
                        window.location.href = `sms:${contact.number}?body=${encodeURIComponent(message)}`;
                        toast.success(getTranslation('textSupport'));
                      }}
                      className={`border-2 ${contact.color.replace('bg-', 'border-')} ${contact.color.replace('bg-', 'text-')}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      SMS
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-8 p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Remember:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>You are valuable and your life matters</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Crisis feelings are temporary and will pass</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Professional help is available and effective</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Reaching out for help shows courage and strength</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'wellness-tips') {
    const wellnessTips = [
      {
        id: 'morning',
        title: getTranslation('morningRoutine'),
        content: getTranslation('morningTip'),
        icon: Sun,
        color: 'bg-yellow-500'
      },
      {
        id: 'evening',
        title: getTranslation('eveningWind'),
        content: getTranslation('eveningTip'),
        icon: Moon,
        color: 'bg-indigo-500'
      },
      {
        id: 'social',
        title: getTranslation('stayConnected'),
        content: getTranslation('socialTip'),
        icon: Users,
        color: 'bg-green-500'
      },
      {
        id: 'exercise',
        title: getTranslation('physicalActivity'),
        content: getTranslation('exerciseTip'),
        icon: Activity,
        color: 'bg-blue-500'
      },
      {
        id: 'nutrition',
        title: getTranslation('healthyEating'),
        content: getTranslation('nutritionTip'),
        icon: Heart,
        color: 'bg-red-500'
      },
      {
        id: 'media',
        title: getTranslation('limitNews'),
        content: getTranslation('mediaTip'),
        icon: Shield,
        color: 'bg-purple-500'
      },
      {
        id: 'gratitude',
        title: getTranslation('practiceGratitude'),
        content: getTranslation('gratitudeTip'),
        icon: Star,
        color: 'bg-orange-500'
      },
      {
        id: 'support',
        title: getTranslation('seekHelp'),
        content: getTranslation('supportTip'),
        icon: Headphones,
        color: 'bg-teal-500'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {getTranslation('wellnessTips')}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {wellnessTips.map((tip) => (
              <Card key={tip.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'resources') {
    const resources = [
      { id: 'stress', title: getTranslation('stressManagement'), icon: Shield, color: 'bg-blue-500' },
      { id: 'anxiety', title: getTranslation('anxietyHelp'), icon: Heart, color: 'bg-green-500' },
      { id: 'depression', title: getTranslation('depressionSupport'), icon: Sun, color: 'bg-yellow-500' },
      { id: 'sleep', title: getTranslation('sleepHygiene'), icon: Moon, color: 'bg-indigo-500' },
      { id: 'relationships', title: getTranslation('relationshipHelp'), icon: Users, color: 'bg-pink-500' },
      { id: 'work', title: getTranslation('workStress'), icon: Lightbulb, color: 'bg-purple-500' },
      { id: 'family', title: getTranslation('familySupport'), icon: Heart, color: 'bg-red-500' },
      { id: 'selfcare', title: getTranslation('selfCare'), icon: Star, color: 'bg-orange-500' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {getTranslation('wellnessResources')}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card 
                key={resource.id} 
                className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => {
                  toast.info(`${language === 'en' ? 'Opening' : language === 'hi' ? 'खोला जा रहा है' : 'ਖੋਲਿਆ ਜਾ ਰਿਹਾ ਹੈ'} ${resource.title}`);
                }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${resource.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <resource.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'en' 
                      ? 'Access comprehensive resources and guides' 
                      : language === 'hi' 
                      ? 'व्यापक संसाधन और गाइड एक्सेस करें'
                      : 'ਵਿਆਪਕ ਸਰੋਤ ਅਤੇ ਗਾਈਡ ਤੱਕ ਪਹੁੰਚ ਕਰੋ'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'meditation') {
    const meditationTypes = [
      { id: 'guided', title: getTranslation('guidedMeditation'), icon: Headphones, duration: '10 min', color: 'bg-blue-500' },
      { id: 'mindfulness', title: getTranslation('mindfulness'), icon: Brain, duration: '5 min', color: 'bg-green-500' },
      { id: 'body-scan', title: getTranslation('bodyScanning'), icon: Activity, duration: '15 min', color: 'bg-purple-500' },
      { id: 'loving-kindness', title: getTranslation('lovingKindness'), icon: Heart, duration: '8 min', color: 'bg-pink-500' },
      { id: 'nature', title: getTranslation('natureSounds'), icon: TreePine, duration: '20 min', color: 'bg-green-600' },
      { id: 'music', title: 'Relaxing Music', icon: Music, duration: '30 min', color: 'bg-indigo-500' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {getTranslation('meditation')}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <Card className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <p className="text-center text-gray-700">
              {getTranslation('meditationBenefits')}
            </p>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationTypes.map((meditation) => (
              <Card 
                key={meditation.id} 
                className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => {
                  toast.success(`${getTranslation('startMeditation')}: ${meditation.title}`);
                }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${meditation.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <meditation.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{meditation.title}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{meditation.duration}</span>
                  </div>
                  <Button className={`w-full ${meditation.color} text-white`}>
                    <Camera className="w-4 h-4 mr-2" />
                    {getTranslation('startMeditation')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'iq-games') {
    
    if (gameCompleted && selectedGame) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {language === 'en' ? 'Congratulations!' : language === 'hi' ? 'बधाई हो!' : 'ਵਧਾਈਆਂ!'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {language === 'en' ? 'You completed' : language === 'hi' ? 'आपने पूरा किया' : 'ਤੁਸੀਂ ਪੂਰਾ ਕੀਤਾ'} {getName(selectedGame)}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{language === 'en' ? 'Score' : language === 'hi' ? 'स्कोर' : 'ਸਕੋਰ'}</span>
                </span>
                <span className="font-bold text-yellow-600">{finalScore}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="flex items-center space-x-2">
                  <span>🪙</span>
                  <span>Med Coins</span>
                </span>
                <span className="font-bold text-orange-600">+{selectedGame.medCoinsReward}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Play Again' : language === 'hi' ? 'फिर से खेलें' : 'ਫਿਰ ਖੇਡੋ'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={resetGame}
                className="w-full"
              >
                {language === 'en' ? 'Back to Games' : language === 'hi' ? 'खेलों पर वापस' : 'ਖੇਡਾਂ ਤੇ ਵਾਪਸ'}
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    
    if (selectedGame && !gameCompleted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="bg-white shadow-sm p-4">
            <div className="flex items-center max-w-6xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={resetGame}
                className="mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <selectedGame.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{getName(selectedGame)}</h1>
                  <p className="text-sm text-gray-600">{getDescription(selectedGame)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 max-w-2xl mx-auto">
            <Card className="p-6">
              {selectedGame.id === 'memory-cards' && (
                <MemoryCardGame onComplete={handleGameComplete} language={language} />
              )}
              
              {selectedGame.id !== 'memory-cards' && (
                <div className="text-center py-12">
                  <selectedGame.icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    {language === 'en' ? 'This game is coming soon!' : language === 'hi' ? 'यह खेल जल्द आ रहा है!' : 'ਇਹ ਖੇਡ ਜਲਦੀ ਆ ਰਹੀ ਹੈ!'}
                  </p>
                  <Button onClick={resetGame} variant="outline">
                    {language === 'en' ? 'Back to Games' : language === 'hi' ? 'खेलों पर वापस' : 'ਖੇਡਾਂ ਤੇ ਵਾਪਸ'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      );
    }

    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActivePanel('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {language === 'en' ? 'Brain Games' : language === 'hi' ? 'ब्रेन गेम्स' : 'ਬ੍ਰੇਨ ਗੇਮਜ਼'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Exercise your brain with fun games' : language === 'hi' ? 'मजेदार खेलों के साथ अपने दिमाग का व्यायाम करें' : 'ਮਜ਼ੇਦਾਰ ਖੇਡਾਂ ਨਾਲ ਆਪਣੇ ਦਿਮਾਗ ਦਾ ਕਸਰਤ ਕਰੋ'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {}
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {language === 'en' ? 'Your Progress' : language === 'hi' ? 'आपकी प्रगति' : 'ਤੁਹਾਡੀ ਤਰੱਕੀ'}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.gamesPlayed}</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Games Played' : language === 'hi' ? 'खेल खेले गए' : 'ਖੇਡੀਆਂ ਗਈਆਂ ਖੇਡਾਂ'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.totalScore}</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Total Score' : language === 'hi' ? 'कुल स्कोर' : 'ਕੁੱਲ ਸਕੋਰ'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Win Streak' : language === 'hi' ? 'जीत की लकीर' : 'ਜਿੱਤ ਦੀ ਲਕੀਰ'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userStats.medCoinsEarned}</div>
                <div className="text-sm text-gray-600">Med Coins</div>
              </div>
            </div>
          </Card>

          {}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <game.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={`${getDifficultyColor(game.difficulty)} border`}>
                    {language === 'en' 
                      ? game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)
                      : language === 'hi'
                      ? game.difficulty === 'easy' ? 'आसान' : game.difficulty === 'medium' ? 'मध्यम' : 'कठिन'
                      : game.difficulty === 'easy' ? 'ਆਸਾਨ' : game.difficulty === 'medium' ? 'ਮੱਧਮ' : 'ਮੁਸ਼ਕਿਲ'
                    }
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{getName(game)}</h3>
                  <p className="text-gray-600 text-sm mb-3">{getDescription(game)}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>{getCategoryIcon(game.category)}</span>
                      <span className="capitalize">{game.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{game.estimatedTime} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-orange-600">
                    <span>🪙</span>
                    <span className="font-medium">+{game.medCoinsReward}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <Gamepad2 className="w-4 h-4 mr-1" />
                    {language === 'en' ? 'Play' : language === 'hi' ? 'खेलें' : 'ਖੇਡੋ'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {}
          <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {language === 'en' ? 'Why Play Brain Games?' : language === 'hi' ? 'ब्रेन गेम्स क्यों खेलें?' : 'ਬ੍ਰੇਨ ਗੇਮਜ਼ ਕਿਉਂ ਖੇਡੋ?'}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Improve Memory' : language === 'hi' ? 'स्मृति सुधारें' : 'ਯਾਦਦਾਸ਼ਤ ਸੁਧਾਰੋ'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'en' 
                    ? 'Regular brain exercise helps maintain cognitive health'
                    : language === 'hi'
                    ? 'नियमित मानसिक व्यायाम संज्ञानात्मक स्वास्थ्य बनाए रखने में मदद करता है'
                    : 'ਨਿਯਮਤ ਮਾਨਸਿਕ ਕਸਰਤ ਬੋਧਾਤਮਕ ਸਿਹਤ ਬਣਾਈ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Mental Agility' : language === 'hi' ? 'मानसिक चपलता' : 'ਮਾਨਸਿਕ ਚੁਸਤੀ'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'en' 
                    ? 'Enhance problem-solving and critical thinking skills'
                    : language === 'hi'
                    ? 'समस्या समाधान और आलोचनात्मक सोच कौशल बढ़ाएं'
                    : 'ਸਮੱਸਿਆ-ਹੱਲ ਅਤੇ ਆਲੋਚਨਾਤਮਕ ਸੋਚ ਦੇ ਹੁਨਰ ਵਧਾਓ'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Earn Rewards' : language === 'hi' ? 'पुरस्कार जीतें' : 'ਇਨਾਮ ਜਿੱਤੋ'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'en' 
                    ? 'Get Med Coins for playing games and achieving high scores'
                    : language === 'hi'
                    ? 'खेल खेलने और उच्च स्कोर प्राप्त करने के लिए मेड कॉइन प्राप्त करें'
                    : 'ਖੇਡਾਂ ܸਲਣ ਅਤੇ ਉੱਚ ਸਕੋਰ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਮੇਡ ਕਾਇਨ ਪ੍ਰਾਪਤ ਕਰੋ'
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  return null;
}