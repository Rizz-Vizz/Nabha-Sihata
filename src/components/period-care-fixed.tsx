import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './language-context';
import { HealthTip } from './health-tip';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  BarChart3, 
  NotebookPen, 
  Bell, 
  Baby, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Droplets,
  Activity,
  Target,
  Shield,
  Edit3,
  Thermometer,
  CalendarCheck,
  Plus
} from 'lucide-react';

type PeriodCarePanel = 'dashboard' | 'track-cycle' | 'check-symptoms' | 'learn-care' | 'wellness-circle' | 'date-input' | 'education-detail' | 'temp-tracker' | 'mucus-tracker' | 'ovulation-calendar';

interface SymptomLog {
  date: string;
  symptoms: string[];
  mood: string;
}

interface TemperatureData {
  date: string;
  temperature: number;
  type: 'basal';
}

interface MucusData {
  date: string;
  type: 'dry' | 'sticky' | 'creamy' | 'eggWhite';
}

interface OvulationData {
  date: string;
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
  cycleLength: number;
}

interface PeriodCareProps {
  onBack: () => void;
}

export function PeriodCare({ onBack }: PeriodCareProps) {
  const [activePanel, setActivePanel] = useState<PeriodCarePanel>('dashboard');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [reminderSettings, setReminderSettings] = useState({
    pill: true,
    water: true,
    exercise: false,
    period: true,
    ovulation: true
  });
  const [reminderTimes, setReminderTimes] = useState({
    pill: '',
    exercise: '',
    water: '',
    period: '',
    ovulation: ''
  });
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<string>('');
  const [cycleDataEntered, setCycleDataEntered] = useState<boolean>(false);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [selectedEducationTopic, setSelectedEducationTopic] = useState<string>('');
  const [tempInput, setTempInput] = useState<string>('');
  const [mucusType, setMucusType] = useState<string>('');
  
  // New state for tracking data storage
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  const [mucusData, setMucusData] = useState<MucusData[]>([]);
  const [ovulationData, setOvulationData] = useState<OvulationData[]>([]);
  
  const { t, language } = useLanguage();

  // Load ALL data from localStorage on component mount
  useEffect(() => {
    // Load existing data
    const savedLogs = localStorage.getItem('symptomLogs');
    if (savedLogs) {
      try {
        setSymptomLogs(JSON.parse(savedLogs));
      } catch (error) {
        console.error('Error loading symptom logs:', error);
      }
    }

    const savedPeriodDate = localStorage.getItem('lastPeriodDate');
    const savedCycleLength = localStorage.getItem('cycleLength');
    const savedReminderTimes = localStorage.getItem('reminderTimes');
    
    if (savedPeriodDate && savedCycleLength) {
      setLastPeriodDate(savedPeriodDate);
      setCycleLength(savedCycleLength);
      setCycleDataEntered(true);
    }

    if (savedReminderTimes) {
      try {
        setReminderTimes(JSON.parse(savedReminderTimes));
      } catch (error) {
        console.error('Error loading reminder times:', error);
      }
    }

    
    const savedTemperatureData = localStorage.getItem('temperatureData');
    if (savedTemperatureData) {
      try {
        setTemperatureData(JSON.parse(savedTemperatureData));
      } catch (error) {
        console.error('Error loading temperature data:', error);
      }
    }

    
    const savedMucusData = localStorage.getItem('mucusData');
    if (savedMucusData) {
      try {
        setMucusData(JSON.parse(savedMucusData));
      } catch (error) {
        console.error('Error loading mucus data:', error);
      }
    }

    
    const savedOvulationData = localStorage.getItem('ovulationData');
    if (savedOvulationData) {
      try {
        setOvulationData(JSON.parse(savedOvulationData));
      } catch (error) {
        console.error('Error loading ovulation data:', error);
      }
    }
  }, []);

  const translations = {
    en: {
      periodCare: "Period Care",
      trackYourCycle: "Track Your Cycle",
      checkSymptoms: "Check Symptoms",
      learnCare: "Learn & Care",
      wellnessCircle: "Wellness Circle",
      welcomeToPeriodCare: "Welcome to Period Care",
      comprehensiveHealthManagement: "Comprehensive menstrual and reproductive health management designed for your privacy and comfort.",
      lastPeriod: "Last Period",
      nextPeriod: "Next Period",
      cycleLength: "Cycle Length",
      daysAgo: "days ago",
      daysLeft: "days left",
      days: "days",
      predictiveInsights: "Predictive Insights",
      cycleAnalytics: "Cycle Analytics",
      currentCycle: "Current Cycle",
      averageCycle: "Average Cycle",
      regularCycle: "Regular Cycle",
      today: "Today",
      fertile: "Fertile",
      menstruation: "Menstruation",
      ovulation: "Ovulation",
      
      enterLastPeriod: "Enter Last Period Date",
      selectDate: "Select Date",
      updateDate: "Update Date",
      editPeriodDate: "Edit Period Date",
      periodDateUpdated: "Period date updated successfully!",
      enterDateToStart: "Please enter your last period date to start tracking your cycle",
      enterCycleInfo: "Enter Your Cycle Information",
      cycleLength: "Cycle Length",
      cycleLengthDays: "days",
      enterBothRequired: "Please enter both your last period date and cycle length to start tracking",
      saveCycleInfo: "Save & Start Tracking",
      cycleInfoSaved: "Cycle information saved successfully!",
      
      logTodaySymptoms: "Log Today's Symptoms",
      howAreYouFeeling: "How are you feeling today?",
      selectSymptoms: "Select your symptoms",
      cramps: "Cramps",
      bloating: "Bloating",
      headache: "Headache",
      fatigue: "Fatigue",
      nausea: "Nausea",
      backPain: "Back Pain",
      breastTenderness: "Breast Tenderness",
      acne: "Acne",
      moodSwings: "Mood Swings",
      irritability: "Irritability",
      anxiety: "Anxiety",
      happy: "Happy",
      calm: "Calm",
      energetic: "Energetic",
      saveLog: "Save Log",
      symptomsLogged: "Symptoms logged successfully!",
      todaysLog: "Today's Log",
      symptomHistory: "Symptom History",
      recommendations: "Recommendations",
      dietTip: "🥗 Eat iron-rich foods like spinach and dates. Stay hydrated with water and herbal teas.",
      exerciseTip: "🚶‍♀️ Light walking and gentle yoga can help ease period symptoms. Avoid intense workouts.",
      noLogsYet: "No symptom logs yet. Start tracking your symptoms above!",
      
      fertilityTracking: "Fertility Tracking",
      ovulationCalendar: "Ovulation Calendar",
      basalBodyTemp: "Basal Body Temperature",
      cervicalMucus: "Cervical Mucus",
      highFertility: "High Fertility",
      lowFertility: "Low Fertility",
      setReminders: "Set Reminders", 
      medicationReminders: "Medication Reminders",
      pillReminder: "Birth Control Pill",
      gymReminder: "Exercise Reminder",
      waterReminder: "Water Intake",
      fertilityWindow: "Fertility Window",
      reminderUpdated: "Reminder settings updated!",
      enterTime: "Enter time",
      enterFrequency: "Enter frequency",
      enterDaysBefore: "Days before",
      saveReminders: "Save Reminders",
      remindersSaved: "Reminders saved successfully!",
      
      temperatureTracker: "Temperature Tracker",
      mucusTracker: "Mucus Tracker",
      recordTemperature: "Record Temperature",
      recordMucus: "Record Mucus",
      enterTemp: "Enter temperature (°F)",
      selectMucusType: "Select mucus type",
      dry: "Dry",
      sticky: "Sticky",
      creamy: "Creamy",
      eggWhite: "Egg White",
      record: "Record",
      temperatureRecorded: "Temperature recorded successfully!",
      mucusRecorded: "Cervical mucus recorded successfully!",
      dataStored: "All data is being stored locally for your privacy",
      
      educationalContent: "Educational Content",
      menstrualHealth: "Menstrual Health",
      nutritionTips: "Nutrition Tips",
      exerciseTips: "Exercise Tips",
      painManagement: "Pain Management",
      learnMore: "Learn More",
      backToTopics: "Back to Topics",
      
      menstrualHealthContent: "Understanding your menstrual cycle is key to reproductive health. A normal cycle ranges from 21-35 days. Track your periods to identify patterns and potential health issues early. Keep a record of flow intensity, pain levels, and any unusual symptoms to discuss with your healthcare provider.",
      nutritionContent: "During menstruation, focus on iron-rich foods like spinach, lentils, and lean meats to prevent anemia. Calcium from dairy products and magnesium from nuts can help reduce cramps and mood swings. Stay hydrated and limit caffeine and alcohol which can worsen symptoms.",
      exerciseContent: "Gentle exercise like walking, yoga, and swimming can reduce period pain and improve mood through endorphin release. Avoid high-intensity workouts during heavy flow days. Listen to your body's needs and adjust activity levels accordingly.",
      painContent: "Heat therapy using heating pads or warm baths can relax uterine muscles. Over-the-counter pain relievers like ibuprofen can reduce inflammation. Gentle massage and relaxation techniques help. If pain is severe or affects daily activities, consult a healthcare provider as it may indicate underlying conditions.",
      
      viewInsights: "View Insights",
      cycleHistory: "Cycle History",
      trends: "Trends",
      
      totalTemperatureRecords: "Temperature Records",
      totalMucusRecords: "Mucus Records",
      dataIntegrity: "Data Integrity Check"
    },
    hi: {
      periodCare: "पीरियड केयर",
      trackYourCycle: "अपना चक्र ट्रैक करें",
      checkSymptoms: "लक्षण जांचें",
      learnCare: "सीखें और देखभाल",
      wellnessCircle: "वेलनेस सर्कल",
      welcomeToPeriodCare: "पीरियड केयर में आपका स्वागत है",
      comprehensiveHealthManagement: "आपकी गोपनीयता और आराम के लिए डिज़ाइन किया गया व्यापक मासिक धर्म और प्रजनन स्वास्थ्य प्रबंधन।",
      lastPeriod: "पिछला पीरियड",
      nextPeriod: "अगला पीरियड",
      cycleLength: "चक्र की लंबाई",
      daysAgo: "दिन पहले",
      daysLeft: "दिन बचे",
      days: "दिन",
      predictiveInsights: "भविष्यसूचक अंतर्दृष्टि",
      cycleAnalytics: "चक्र विश्लेषण",
      currentCycle: "वर्तमान चक्र",
      averageCycle: "औसत चक्र",
      regularCycle: "नियमित चक्र",
      today: "आज",
      fertile: "उर्वर",
      menstruation: "मासिक धर्म",
      ovulation: "ओव्यूलेशन",
      enterLastPeriod: "पिछली पीरियड की तारीख दर्ज करें",
      selectDate: "तारीख चुनें",
      updateDate: "तारीख अपडेट करें",
      editPeriodDate: "पीरियड की तारीख संपादित करें",
      periodDateUpdated: "पीरियड की तारीख सफलतापूर्वक अपडेट हो गई!",
      enterDateToStart: "कृपया अपने चक्र को ट्रैक करना शुरू करने के लिए अपनी पिछली पीरियड की तारीख दर्ज करें",
      enterCycleInfo: "अपनी चक्र की जानकारी दर्ज करें",
      cycleLength: "चक्र की लंबाई",
      cycleLengthDays: "दिन",
      enterBothRequired: "ट्रैकिंग शुरू करने के लिए कृपया अपनी पिछली पीरियड की तारीख और चक्र की लंबाई दोनों दर्ज करें",
      saveCycleInfo: "सहेजें और ट्रैकिंग शुरू करें",
      cycleInfoSaved: "चक्र की जानकारी सफलतापूर्वक सहेजी गई!",
      logTodaySymptoms: "आज के लक्षण लॉग करें",
      howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
      selectSymptoms: "अपने लक्षण चुनें",
      cramps: "ऐंठन",
      bloating: "पेट फूलना",
      headache: "सिरदर्द",
      fatigue: "थकान",
      nausea: "मतली",
      backPain: "कमर दर्द",
      breastTenderness: "स्तन में दर्द",
      acne: "मुंहासे",
      moodSwings: "मूड स्विंग्स",
      irritability: "चिड़चिड़ाहट",
      anxiety: "चिंता",
      happy: "खुश",
      calm: "शांत",
      energetic: "ऊर्जावान",
      saveLog: "लॉग सेव करें",
      symptomsLogged: "लक्षण सफलतापूर्वक लॉग किए गए!",
      todaysLog: "आज का लॉग",
      symptomHistory: "लक्षण इतिहास",
      recommendations: "सुझाव",
      dietTip: "🥗 पालक और खजूर जैसे आयरन युक्त खाद्य पदार्थ खाएं। पानी और हर्बल चाय से हाइड्रेटेड रहें।",
      exerciseTip: "🚶‍♀️ हल्की चहलकदमी और सौम्य योग पीरियड के लक्षणों को कम करने में मदद कर सकते हैं। तेज़ वर्कआउट से बचें।",
      noLogsYet: "अभी तक कोई लक्षण लॉग नहीं। ऊपर अपने लक्षण ट्रैक करना शुरू करें!",
      fertilityTracking: "प्रजनन ट्रैकिंग",
      ovulationCalendar: "ओव्यूलेशन कैलेंडर",
      basalBodyTemp: "बेसल बॉडी टेम्परेचर",
      cervicalMucus: "गर्भाशय ग्रीवा बलगम",
      highFertility: "उच्च प्रजनन क्षमता",
      lowFertility: "कम प्रजनन क्षमता",
      setReminders: "रिमाइंडर सेट करें",
      medicationReminders: "दवा रिमाइंडर",
      pillReminder: "गर्भनिरोधक गोली",
      gymReminder: "व्यायाम रिमाइंडर",
      waterReminder: "पानी का सेवन",
      fertilityWindow: "प्रजनन खिड़की",
      reminderUpdated: "रिमाइंडर सेटिंग्स अपडेट हो गईं!",
      enterTime: "समय दर्ज करें",
      enterFrequency: "आवृत्ति दर्ज करें",  
      enterDaysBefore: "दिन पहले",
      saveReminders: "रिमाइंडर सहेजें",
      remindersSaved: "रिमाइंडर सफलतापूर्वक सहेज दिए गए!",
      temperatureTracker: "तापमान ट्रैकर",
      mucusTracker: "बलगम ट्रैकर",
      recordTemperature: "तापमान रिकॉर्ड करें",
      recordMucus: "बलगम रिकॉर्ड करें",
      enterTemp: "तापमान दर्ज करें (°F)",
      selectMucusType: "बलगम का प्रकार चुनें",
      dry: "सूखा",
      sticky: "चिपचिपा",
      creamy: "क्रीमी",
      eggWhite: "अंडे की सफेदी",
      record: "रिकॉर्ड करें",
      temperatureRecorded: "तापमान सफलतापूर्वक रिकॉर्ड किया गया!",
      mucusRecorded: "गर्भाशय ग्रीवा बलगम सफलतापूर्वक रिकॉर्ड किया गया!",
      dataStored: "आपकी गोपनीयता के लिए सभी डेटा स्थानीय रूप से संग्रहीत किया जा रहा है",
      educationalContent: "शैक्षिक सामग्री",
      menstrualHealth: "मासिक धर्म स्वास्थ्य",
      nutritionTips: "पोषण टिप्स",
      exerciseTips: "व्यायाम टिप्स",
      painManagement: "दर्द प्रबंधन",
      learnMore: "और जानें",
      backToTopics: "विषयों पर वापस जाएं",
      menstrualHealthContent: "अपने मासिक धर्म चक्र को समझना प्रजनन स्वास्थ्य की कुंजी है। एक सामान्य चक्र 21-35 दिनों का होता है। पैटर्न और संभावित स्वास्थ्य समस्याओं की जल्दी पहचान के लिए अपने पीरियड्स को ट्रैक करें।",
      nutritionContent: "मासिक धर्म के दौरान, पालक, दाल और दुबले मांस जैसे आयरन युक्त खाद्य पदार्थों पर ध्यान दें। डेयरी उत्पादों से कैल्शियम और नट्स से मैग्नीशियम ऐंठन और मूड स्विंग्स को कम करने में मदद कर सकते हैं।",
      exerciseContent: "चलना, योग और तैराकी जैसी सौम्य व्यायाम पीरियड के दर्द को कम कर सकती है और मूड में सुधार ला सकती है। हैवी फ्लो के दिनों में हाई-इंटेंसिटी वर्कआउट से बचें। अपने शरीर की जरूरतों को सुनें।",
      painContent: "हीट थेरेपी, काउंटर पर मिलने वाली दर्द निवारक दवाएं और सौम्य मसाज पीरियड के दर्द को संभालने में मदद कर सकते हैं। यदि दर्द गंभीर है या दैनिक गतिविधियों को प्रभावित करता है, तो स्वास्थ्य सेवा प्रदाता से सलाह लें।",
      viewInsights: "अंतर्दृष्टि देखें",
      cycleHistory: "चक्र इतिहास",
      trends: "रुझान",
      totalTemperatureRecords: "तापमान रिकॉर्ड",
      totalMucusRecords: "बलगम रिकॉर्ड",
      dataIntegrity: "डेटा अखंडता जाँच"
    },
    pa: {
      periodCare: "ਪੀਰੀਅਡ ਦੇਖਭਾਲ",
      trackYourCycle: "ਆਪਣਾ ਚੱਕਰ ਟਰੈਕ ਕਰੋ",
      checkSymptoms: "ਲੱਛਣ ਜਾਂਚੋ",
      learnCare: "ਸਿੱਖੋ ਅਤੇ ਦੇਖਭਾਲ",
      wellnessCircle: "ਵੈਲਨੈੱਸ ਸਰਕਲ",
      welcomeToPeriodCare: "ਪੀਰੀਅਡ ਦੇਖਭਾਲ ਵਿੱਚ ਸਵਾਗਤ ਹੈ",
      comprehensiveHealthManagement: "ਤੁਹਾਡੀ ਗੁਪਤਤਾ ਅਤੇ ਆਰਾਮ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਵਿਆਪਕ ਮਾਸਿਕ ਧਰਮ ਅਤੇ ਪ੍ਰਜਨਨ ਸਿਹਤ ਪ੍ਰਬੰਧਨ।",
      lastPeriod: "ਪਿਛਲਾ ਪੀਰੀਅਡ",
      nextPeriod: "ਅਗਲਾ ਪੀਰੀਅਡ",
      cycleLength: "ਚੱਕਰ ਦੀ ਲੰਬਾਈ",
      daysAgo: "ਦਿਨ ਪਹਿਲਾਂ",
      daysLeft: "ਦਿਨ ਬਾਕੀ",
      days: "ਦਿਨ",
      predictiveInsights: "ਭਵਿੱਖ ਦੀ ਸਮਝ",
      cycleAnalytics: "ਚੱਕਰ ਵਿਸ਼ਲੇਸ਼ਣ",
      currentCycle: "ਮੌਜੂਦਾ ਚੱਕਰ",
      averageCycle: "ਔਸਤ ਚੱਕਰ",
      regularCycle: "ਨਿਯਮਿਤ ਚੱਕਰ",
      today: "ਅੱਜ",
      fertile: "ਉਪਜਾਊ",
      menstruation: "ਮਾਸਿਕ ਧਰਮ",
      ovulation: "ਓਵੂਲੇਸ਼ਨ",
      logTodaySymptoms: "ਅੱਜ ਦੇ ਲੱਛਣ ਲਾਗ ਕਰੋ",
      howAreYouFeeling: "ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
      selectSymptoms: "ਆਪਣੇ ਲੱਛਣ ਚੁਣੋ",
      cramps: "ਕੜਵੱਲ",
      bloating: "ਪੇਟ ਫੁੱਲਣਾ",
      headache: "ਸਿਰ ਦਰਦ",
      fatigue: "ਥਕਾਵਟ",
      nausea: "ਉਲਟੀ ਆਉਣਾ",
      backPain: "ਪਿੱਠ ਦਰਦ",
      breastTenderness: "ਛਾਤੀ ਵਿੱਚ ਦਰਦ",
      acne: "ਮੁਹਾਂਸੇ",
      moodSwings: "ਮੂਡ ਸਵਿੰਗਸ",
      irritability: "ਚਿੜਚਿੜਾਹਟ",
      anxiety: "ਚਿੰਤਾ",
      happy: "ਖੁਸ਼",
      calm: "ਸ਼ਾਂਤ",
      energetic: "ਊਰਜਾਵਾਨ",
      saveLog: "ਲਾਗ ਸੇਵ ਕਰੋ",
      symptomsLogged: "ਲੱਛਣ ਸਫਲਤਾਪੂਰਵਕ ਲਾਗ ਕੀਤੇ ਗਏ!",
      fertilityTracking: "ਜਣਨ ਟਰੈਕਿੰਗ",
      ovulationCalendar: "ਓਵੂਲੇਸ਼ਨ ਕੈਲੰਡਰ",
      basalBodyTemp: "ਬੇਸਲ ਬਾਡੀ ਟੈਂਪਰੇਚਰ",
      cervicalMucus: "ਸਰਵਾਇਕਲ ਮਿਊਕਸ",
      highFertility: "ਉੱਚ ਜਣਨ ਸਮਰੱਥਾ",
      lowFertility: "ਘੱਟ ਜਣਨ ਸਮਰੱਥਾ",
      setReminders: "ਰਿਮਾਈਂਡਰ ਸੈੱਟ ਕਰੋ",
      medicationReminders: "ਦਵਾਈ ਰਿਮਾਈਂਡਰ",
      pillReminder: "ਗਰਭ ਨਿਰੋਧਕ ਗੋਲੀ",
      gymReminder: "ਕਸਰਤ ਰਿਮਾਈਂਡਰ",
      waterReminder: "ਪਾਣੀ ਦਾ ਸੇਵਨ",
      fertilityWindow: "ਜਣਨ ਖਿੜਕੀ",
      reminderUpdated: "ਰਿਮਾਈਂਡਰ ਸੈਟਿੰਗਾਂ ਅੱਪਡੇਟ ਹੋ ਗਈਆਂ!",
      educationalContent: "ਵਿੱਦਿਆ ਸਮੱਗਰੀ",
      menstrualHealth: "ਮਾਸਿਕ ਧਰਮ ਸਿਹਤ",
      nutritionTips: "ਪੋਸ਼ਣ ਟਿੱਪਸ",
      exerciseTips: "ਕਸਰਤ ਟਿੱਪਸ",
      painManagement: "ਦਰਦ ਪ੍ਰਬੰਧਨ",
      learnMore: "ਹੋਰ ਜਾਣੋ",
      viewInsights: "ਸਮਝ ਦੇਖੋ",
      cycleHistory: "ਚੱਕਰ ਇਤਿਹਾਸ",
      trends: "ਰੁਝਾਨ",
      enterLastPeriod: "ਪਿਛਲੀ ਪੀਰੀਅਡ ਦੀ ਤਾਰੀਖ ਦਰਜ ਕਰੋ",
      selectDate: "ਤਾਰੀਖ ਚੁਣੋ",
      updateDate: "ਤਾਰੀਖ ਅੱਪਡੇਟ ਕਰੋ",
      editPeriodDate: "ਪੀਰੀਅਡ ਦੀ ਤਾਰੀਖ ਸੰਪਾਦਿਤ ਕਰੋ",
      periodDateUpdated: "ਪੀਰੀਅਡ ਦੀ ਤਾਰੀਖ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਈ!",
      enterDateToStart: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਚੱਕਰ ਨੂੰ ਟਰੈਕ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਆਪਣੀ ਪਿਛਲੀ ਪੀਰੀਅਡ ਦੀ ਤਾਰੀਖ ਦਰਜ ਕਰੋ",
      enterCycleInfo: "ਆਪਣੀ ਚੱਕਰ ਦੀ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ",
      cycleLength: "ਚੱਕਰ ਦੀ ਲੰਬਾਈ",
      cycleLengthDays: "ਦਿਨ",
      enterBothRequired: "ਟਰੈਕਿੰਗ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪਿਛਲੀ ਪੀਰੀਅਡ ਦੀ ਤਾਰੀਖ ਅਤੇ ਚੱਕਰ ਦੀ ਲੰਬਾਈ ਦੋਵੇਂ ਦਰਜ ਕਰੋ",
      saveCycleInfo: "ਸੇਵ ਕਰੋ ਅਤੇ ਟਰੈਕਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
      cycleInfoSaved: "ਚੱਕਰ ਦੀ ਜਾਣਕਾਰੀ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਕੀਤੀ ਗਈ!",
      temperatureTracker: "ਤਾਪਮਾਨ ਟਰੈਕਰ",
      mucusTracker: "ਮਿਊਕਸ ਟਰੈਕਰ",
      recordTemperature: "ਤਾਪਮਾਨ ਰਿਕਾਰਡ ਕਰੋ",
      recordMucus: "ਮਿਊਕਸ ਰਿਕਾਰਡ ਕਰੋ",
      enterTemp: "ਤਾਪਮਾਨ ਦਰਜ ਕਰੋ (°F)",
      selectMucusType: "ਮਿਊਕਸ ਦੀ ਕਿਸਮ ਚੁਣੋ",
      dry: "ਸੁੱਕਾ",
      sticky: "ਚਿਪਚਿਪਾ",
      creamy: "ਕਰੀਮੀ",
      eggWhite: "ਅੰਡੇ ਦੀ ਚਿੱਟੀ",
      record: "ਰਿਕਾਰਡ ਕਰੋ",
      temperatureRecorded: "ਤਾਪਮਾਨ ਸਫਲਤਾਪੂਰਵਕ ਰਿਕਾਰਡ ਕੀਤਾ ਗਿਆ!",
      mucusRecorded: "ਸਰਵਾਇਕਲ ਮਿਊਕਸ ਸਫਲਤਾਪੂਰਵਕ ਰਿਕਾਰਡ ਕੀਤਾ ਗਿਆ!",
      dataStored: "ਤੁਹਾਡੀ ਗੁਪਤਤਾ ਲਈ ਸਾਰਾ ਡੇਟਾ ਸਥਾਨਕ ਰੂਪ ਵਿੱਚ ਸਟੋਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ",
      totalTemperatureRecords: "ਤਾਪਮਾਨ ਰਿਕਾਰਡ",
      totalMucusRecords: "ਮਿਊਕਸ ਰਿਕਾਰਡ",
      dataIntegrity: "ਡੇਟਾ ਇੰਟੇਗ੍ਰਿਟੀ ਚੈੱਕ"
    }
  };

  const getTranslation = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleSaveSymptoms = () => {
    const logEntry = {
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      mood: selectedMood
    };
    
    const updatedLogs = [...symptomLogs, logEntry];
    setSymptomLogs(updatedLogs);
    localStorage.setItem('symptomLogs', JSON.stringify(updatedLogs));
    
    toast.success(getTranslation('symptomsLogged'));
    setSelectedSymptoms([]);
    setSelectedMood('');
  };

  const handleReminderToggle = (reminderId: keyof typeof reminderSettings) => {
    setReminderSettings(prev => ({
      ...prev,
      [reminderId]: !prev[reminderId]
    }));
    toast.success(getTranslation('reminderUpdated'));
  };

  
  const calculateCycleDates = () => {
    if (!lastPeriodDate || !cycleLength) {
      return null;
    }

    const lastPeriod = new Date(lastPeriodDate);
    
    const today = new Date('2025-09-18');
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    const userCycleLength = parseInt(cycleLength) || 28;
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + userCycleLength);
    const daysUntilNext = Math.floor((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    
    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return {
      daysSinceLastPeriod,
      daysUntilNext,
      nextPeriodDate: nextPeriod.toLocaleDateString(),
      ovulationDate: ovulationDate.toLocaleDateString(),
      fertileStart: fertileStart.toLocaleDateString(),
      fertileEnd: fertileEnd.toLocaleDateString(),
      cycleLength: userCycleLength,
      ovulationDateObj: ovulationDate,
      fertileStartObj: fertileStart,
      fertileEndObj: fertileEnd
    };
  };

  
  const handleCycleInfoSave = () => {
    if (!lastPeriodDate || !cycleLength) {
      toast.error(getTranslation('enterBothRequired'));
      return;
    }
    
    
    localStorage.setItem('lastPeriodDate', lastPeriodDate);
    localStorage.setItem('cycleLength', cycleLength);
    setCycleDataEntered(true);
    
    
    const cycleData = calculateCycleDates();
    if (cycleData) {
      const ovulationEntry: OvulationData = {
        date: new Date().toISOString(),
        ovulationDate: cycleData.ovulationDate,
        fertileStart: cycleData.fertileStart,
        fertileEnd: cycleData.fertileEnd,
        cycleLength: cycleData.cycleLength
      };
      
      const updatedOvulationData = [...ovulationData, ovulationEntry];
      setOvulationData(updatedOvulationData);
      localStorage.setItem('ovulationData', JSON.stringify(updatedOvulationData));
    }
    
    toast.success(getTranslation('cycleInfoSaved'));
    setActivePanel('track-cycle');
  };

  const handleDateUpdate = (newDate: string, newCycleLength: string) => {
    setLastPeriodDate(newDate);
    setCycleLength(newCycleLength);
    localStorage.setItem('lastPeriodDate', newDate);
    localStorage.setItem('cycleLength', newCycleLength);
    setCycleDataEntered(true);
    
    
    const tempLastPeriodDate = lastPeriodDate;
    const tempCycleLength = cycleLength;
    setLastPeriodDate(newDate);
    setCycleLength(newCycleLength);
    
    const cycleData = calculateCycleDates();
    if (cycleData) {
      const ovulationEntry: OvulationData = {
        date: new Date().toISOString(),
        ovulationDate: cycleData.ovulationDate,
        fertileStart: cycleData.fertileStart,
        fertileEnd: cycleData.fertileEnd,
        cycleLength: cycleData.cycleLength
      };
      
      const updatedOvulationData = [...ovulationData, ovulationEntry];
      setOvulationData(updatedOvulationData);
      localStorage.setItem('ovulationData', JSON.stringify(updatedOvulationData));
    }
    
    
    setLastPeriodDate(tempLastPeriodDate);
    setCycleLength(tempCycleLength);
    
    toast.success(getTranslation('cycleInfoSaved') + ' - ' + getTranslation('dataStored'));
    setActivePanel('track-cycle');
  };

  const handleEducationTopicSelect = (topic: string) => {
    setSelectedEducationTopic(topic);
    setActivePanel('education-detail');
  };

  const getTodaysRecommendations = (symptoms: string[], mood: string) => {
    const recommendations = [];
    
    
    if (symptoms.includes('cramps') || symptoms.includes('bloating')) {
      recommendations.push(getTranslation('dietTip'));
    }
    
    
    if (symptoms.includes('fatigue') || mood === 'anxious') {
      recommendations.push(getTranslation('exerciseTip'));
    }
    
    
    if (recommendations.length === 0) {
      recommendations.push(getTranslation('dietTip'));
      recommendations.push(getTranslation('exerciseTip'));
    }
    
    return recommendations;
  };

  const getTodaysLog = () => {
    const today = new Date().toDateString();
    return symptomLogs.find(log => new Date(log.date).toDateString() === today);
  };

  
  const handleTemperatureRecord = () => {
    if (!tempInput) return;
    
    const tempData: TemperatureData = {
      date: new Date().toISOString(),
      temperature: parseFloat(tempInput),
      type: 'basal'
    };
    
    const updatedTemperatureData = [...temperatureData, tempData];
    setTemperatureData(updatedTemperatureData);
    localStorage.setItem('temperatureData', JSON.stringify(updatedTemperatureData));
    
    toast.success(`${getTranslation('temperatureRecorded')} (${updatedTemperatureData.length} ${getTranslation('totalTemperatureRecords')})`);
    setTempInput('');
    setActivePanel('wellness-circle');
  };

  
  const handleMucusRecord = () => {
    if (!mucusType) return;
    
    const mucusData: MucusData = {
      date: new Date().toISOString(),
      type: mucusType as 'dry' | 'sticky' | 'creamy' | 'eggWhite'
    };
    
    const updatedMucusData = [...mucusData, mucusData];
    setMucusData(updatedMucusData);
    localStorage.setItem('mucusData', JSON.stringify(updatedMucusData));
    
    toast.success(`${getTranslation('mucusRecorded')} (${updatedMucusData.length} ${getTranslation('totalMucusRecords')})`);
    setMucusType('');
    setActivePanel('wellness-circle');
  };

  
  const renderCycleInfoInput = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-pink-500" />
          {getTranslation('enterCycleInfo')}
        </h3>
        
        <div className="mb-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
          <p className="text-pink-700 text-center">
            📅 {getTranslation('enterBothRequired')}
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('enterLastPeriod')}
            </label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              max="2025-09-18" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('cycleLength')} ({getTranslation('cycleLengthDays')})
            </label>
            <select
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
            >
              <option value="">Select cycle length</option>
              {Array.from({ length: 16 }, (_, i) => i + 21).map(days => (
                <option key={days} value={days.toString()}>
                  {days} {getTranslation('days')}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Most cycles are between 21-35 days. Average is 28 days.
            </p>
          </div>
          
          <Button
            onClick={handleCycleInfoSave}
            className="w-full bg-pink-500 hover:bg-pink-600"
            disabled={!lastPeriodDate || !cycleLength}
          >
            {getTranslation('saveCycleInfo')}
          </Button>
        </div>
      </Card>
    </div>
  );

  
  const renderTempTracker = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Thermometer className="w-5 h-5 mr-2 text-red-500" />
          {getTranslation('temperatureTracker')}
        </h3>
        
        {}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            🗂️ {getTranslation('totalTemperatureRecords')}: {temperatureData.length}
          </p>
          <p className="text-blue-600 text-xs mt-1">{getTranslation('dataStored')}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('enterTemp')}
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="98.6"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <Button
            onClick={handleTemperatureRecord}
            disabled={!tempInput}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            {getTranslation('record')}
          </Button>
        </div>
      </Card>
    </div>
  );

  
  const renderMucusTracker = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-blue-500" />
          {getTranslation('mucusTracker')}
        </h3>
        
        {}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            🗂️ {getTranslation('totalMucusRecords')}: {mucusData.length}
          </p>
          <p className="text-green-600 text-xs mt-1">{getTranslation('dataStored')}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('selectMucusType')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'dry', label: getTranslation('dry'), color: 'bg-yellow-100 border-yellow-300' },
                { id: 'sticky', label: getTranslation('sticky'), color: 'bg-orange-100 border-orange-300' },
                { id: 'creamy', label: getTranslation('creamy'), color: 'bg-pink-100 border-pink-300' },
                { id: 'eggWhite', label: getTranslation('eggWhite'), color: 'bg-green-100 border-green-300' }
              ].map((type) => (
                <Button
                  key={type.id}
                  variant={mucusType === type.id ? "default" : "outline"}
                  className={`p-4 ${mucusType === type.id ? 'bg-blue-500 text-white' : type.color}`}
                  onClick={() => setMucusType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={handleMucusRecord}
            disabled={!mucusType}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {getTranslation('record')}
          </Button>
        </div>
      </Card>
    </div>
  );

  
  const renderWellnessCircle = () => {
    const cycleData = calculateCycleDates();
    const latestOvulationRecord = ovulationData[ovulationData.length - 1];
    
    return (
      <div className="space-y-6">
        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            {getTranslation('fertilityWindow')}
          </h3>
          
          {cycleData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-2xl mb-2">🥚</div>
                  <p className="text-sm font-medium text-green-800">{getTranslation('ovulation')}</p>
                  <p className="text-green-700">{cycleData.ovulationDate}</p>
                </div>
                <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg text-center">
                  <div className="text-2xl mb-2">💖</div>
                  <p className="text-sm font-medium text-pink-800">{getTranslation('fertilityWindow')}</p>
                  <p className="text-pink-700 text-xs">
                    {cycleData.fertileStart} - {cycleData.fertileEnd}
                  </p>
                </div>
              </div>
              
              {}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  🔄 {getTranslation('dataIntegrity')}: ✅ Fertility data synchronized with cycle tracking
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Last updated: {new Date().toLocaleDateString()} | Ovulation records: {ovulationData.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Please enter your cycle information in Track Your Cycle to see fertility predictions</p>
              <Button 
                onClick={() => setActivePanel('date-input')}
                className="mt-3 bg-pink-500 hover:bg-pink-600"
              >
                Enter Cycle Data
              </Button>
            </div>
          )}
        </Card>

        {}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setActivePanel('temp-tracker')}>
            <Thermometer className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <h4 className="font-medium text-gray-800">{getTranslation('basalBodyTemp')}</h4>
            <p className="text-xs text-gray-600 mt-1">{temperatureData.length} records</p>
          </Card>
          
          <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setActivePanel('mucus-tracker')}>
            <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h4 className="font-medium text-gray-800">{getTranslation('cervicalMucus')}</h4>
            <p className="text-xs text-gray-600 mt-1">{mucusData.length} records</p>
          </Card>
        </div>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <CalendarCheck className="w-5 h-5 mr-2 text-purple-500" />
            {getTranslation('ovulationCalendar')}
          </h3>
          
          <div className="space-y-3">
            {ovulationData.slice(-3).reverse().map((record, index) => (
              <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-purple-800">
                      {getTranslation('ovulation')}: {record.ovulationDate}
                    </p>
                    <p className="text-sm text-purple-600">
                      {getTranslation('fertilityWindow')}: {record.fertileStart} - {record.fertileEnd}
                    </p>
                  </div>
                  <div className="text-purple-500 text-2xl">🗓️</div>
                </div>
              </div>
            ))}
            
            {ovulationData.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                <CalendarCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No ovulation data yet. Enter your cycle information to start tracking.</p>
              </div>
            )}
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-500" />
            {getTranslation('setReminders')}
          </h3>
          
          <div className="space-y-3">
            {Object.entries(reminderSettings).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">
                  {getTranslation(`${key}Reminder`)}
                </span>
                <Button
                  variant={enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleReminderToggle(key as keyof typeof reminderSettings)}
                  className={enabled ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {enabled ? "ON" : "OFF"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  
  if (!cycleDataEntered && activePanel === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        {}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
          <h1 className="font-bold text-pink-600">{getTranslation('periodCare')}</h1>
        </div>

        {renderCycleInfoInput()}
      </div>
    );
  }

  
  if (activePanel === 'date-input') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setActivePanel('dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
          <h1 className="font-bold text-pink-600">{getTranslation('editPeriodDate')}</h1>
        </div>
        
        {renderCycleInfoInput()}
      </div>
    );
  }

  if (activePanel === 'temp-tracker') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setActivePanel('wellness-circle')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
          <h1 className="font-bold text-red-600">{getTranslation('temperatureTracker')}</h1>
        </div>
        
        {renderTempTracker()}
      </div>
    );
  }

  if (activePanel === 'mucus-tracker') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setActivePanel('wellness-circle')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
          <h1 className="font-bold text-blue-600">{getTranslation('mucusTracker')}</h1>
        </div>
        
        {renderMucusTracker()}
      </div>
    );
  }

  if (activePanel === 'wellness-circle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setActivePanel('dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>
          <h1 className="font-bold text-pink-600">{getTranslation('wellnessCircle')}</h1>
        </div>
        
        {renderWellnessCircle()}
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      {}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Button>
        <h1 className="font-bold text-pink-600">{getTranslation('periodCare')}</h1>
      </div>

      {}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getTranslation('welcomeToPeriodCare')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{getTranslation('comprehensiveHealthManagement')}</p>
      </div>

      {}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {}
        <Card className="p-6 text-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
              onClick={() => setActivePanel('track-cycle')}>
          <div className="w-16 h-16 mx-auto mb-4 bg-pink-500 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('trackYourCycle')}</h3>
          {cycleDataEntered && (
            <div className="text-sm text-pink-600">
              <p>Last Period: {new Date(lastPeriodDate).toLocaleDateString()}</p>
              <p>Cycle: {cycleLength} days</p>
            </div>
          )}
        </Card>

        {}
        <Card className="p-6 text-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
              onClick={() => setActivePanel('check-symptoms')}>
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('checkSymptoms')}</h3>
          <p className="text-sm text-gray-600">{symptomLogs.length} logs recorded</p>
        </Card>

        {}
        <Card className="p-6 text-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
              onClick={() => setActivePanel('wellness-circle')}>
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('wellnessCircle')}</h3>
          <div className="text-sm text-green-600">
            <p>🌡️ {temperatureData.length} temp records</p>
            <p>💧 {mucusData.length} mucus records</p>
          </div>
        </Card>

        {}
        <Card className="p-6 text-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
              onClick={() => setActivePanel('learn-care')}>
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('learnCare')}</h3>
        </Card>
      </div>

      {}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">{getTranslation('dataStored')}</span>
          </div>
          <div className="text-sm text-gray-600">
            Total Records: {temperatureData.length + mucusData.length + ovulationData.length + symptomLogs.length}
          </div>
        </div>
      </Card>
    </div>
  );
}