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

interface ReminderTime {
  pill: string;
  exercise: string; 
  water: string;
  period: string;
  ovulation: string;
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
  const [reminderTimes, setReminderTimes] = useState<ReminderTime>({
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
  const { t, language } = useLanguage();

  // Load data from localStorage on component mount
  useEffect(() => {
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
      trends: "Trends"
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
      trends: "रुझान"
    },
    pa: {
      
      periodCare: "ਪੀਰੀਅਡ ਦੇਖਭਾਲ",
      
    }
  };

  const getTranslation = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  
  const calculateCycleDates = () => {
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

  
  const handleReminderTimeUpdate = (type: keyof ReminderTime, value: string) => {
    const updatedTimes = { ...reminderTimes, [type]: value };
    setReminderTimes(updatedTimes);
    localStorage.setItem('reminderTimes', JSON.stringify(updatedTimes));
  };

  const handleReminderSave = () => {
    localStorage.setItem('reminderTimes', JSON.stringify(reminderTimes));
    toast.success(getTranslation('remindersSaved'));
  };

  
  const renderWellnessCircle = () => {
    const cycleDates = cycleDataEntered ? calculateCycleDates() : null;
    
    return (
      <div className="space-y-6">
        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            {getTranslation('fertilityTracking')}
          </h3>
          
          {cycleDates ? (
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h4 className="font-medium text-gray-800">{getTranslation('fertilityWindow')}</h4>
                </div>
                <p className="font-bold text-green-600">
                  {cycleDates.fertileStart} - {cycleDates.fertileEnd}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {cycleDates.daysSinceLastPeriod >= (cycleDates.cycleLength - 19) && 
                   cycleDates.daysSinceLastPeriod <= (cycleDates.cycleLength - 13) 
                    ? getTranslation('highFertility') 
                    : getTranslation('lowFertility')}
                </p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h4 className="font-medium text-gray-800">{getTranslation('ovulation')}</h4>
                </div>
                <p className="font-bold text-purple-600">{cycleDates.ovulationDate}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Expected ovulation
                </p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-medium text-gray-800">{getTranslation('nextPeriod')}</h4>
                </div>
                <p className="font-bold text-blue-600">{cycleDates.nextPeriodDate}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {cycleDates.daysUntilNext > 0 ? `${cycleDates.daysUntilNext} ${getTranslation('daysLeft')}` : 'Due now'}
                </p>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Please complete your cycle information in Track Your Cycle to see fertility data.
              </p>
              <Button 
                onClick={() => setActivePanel('track-cycle')}
                className="mt-4 bg-pink-500 hover:bg-pink-600"
              >
                Go to Track Your Cycle
              </Button>
            </div>
          )}
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            {getTranslation('setReminders')}
          </h3>
          
          <div className="space-y-4">
            {}
            <Card className="p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💊</span>
                  <h4 className="font-medium text-gray-800">{getTranslation('pillReminder')}</h4>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="time"
                  value={reminderTimes.pill}
                  onChange={(e) => handleReminderTimeUpdate('pill', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={getTranslation('enterTime')}
                />
                <span className="text-sm text-gray-600">
                  {reminderTimes.pill || 'Not set'}
                </span>
              </div>
            </Card>

            {}
            <Card className="p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏃‍♀️</span>
                  <h4 className="font-medium text-gray-800">{getTranslation('gymReminder')}</h4>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="time"
                  value={reminderTimes.exercise}
                  onChange={(e) => handleReminderTimeUpdate('exercise', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={getTranslation('enterTime')}
                />
                <span className="text-sm text-gray-600">
                  {reminderTimes.exercise || 'Not set'}
                </span>
              </div>
            </Card>

            {}
            <Card className="p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💧</span>
                  <h4 className="font-medium text-gray-800">{getTranslation('waterReminder')}</h4>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={reminderTimes.water}
                  onChange={(e) => handleReminderTimeUpdate('water', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={getTranslation('enterFrequency')}
                />
                <span className="text-sm text-gray-600">
                  {reminderTimes.water || 'Not set'}
                </span>
              </div>
            </Card>

            {}
            <Card className="p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-medium text-gray-800">Period Prediction</h4>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={reminderTimes.period}
                  onChange={(e) => handleReminderTimeUpdate('period', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                  placeholder="3"
                />
                <span className="text-sm text-gray-600">{getTranslation('enterDaysBefore')}</span>
                <span className="text-sm text-gray-600">
                  ({reminderTimes.period || '3'} days before)
                </span>
              </div>
            </Card>

            {}
            <Card className="p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌸</span>
                  <h4 className="font-medium text-gray-800">Ovulation Alert</h4>
                </div>
              </div>
              {cycleDates ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={reminderTimes.ovulation}
                    onChange={(e) => handleReminderTimeUpdate('ovulation', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                    placeholder="1"
                  />
                  <span className="text-sm text-gray-600">{getTranslation('enterDaysBefore')}</span>
                  <span className="text-sm text-gray-600">
                    (Alert on {cycleDates.ovulationDate})
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Complete cycle info to set ovulation alerts
                </p>
              )}
            </Card>
          </div>

          <Button
            onClick={handleReminderSave}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
          >
            {getTranslation('saveReminders')}
          </Button>
        </Card>

        {}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center hover:shadow-md transition-all cursor-pointer"
                onClick={() => setActivePanel('temp-tracker')}>
            <Thermometer className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <h4 className="font-medium text-gray-800 mb-2">{getTranslation('basalBodyTemp')}</h4>
            <p className="text-sm text-gray-600">{getTranslation('recordTemperature')}</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-all cursor-pointer"
                onClick={() => setActivePanel('mucus-tracker')}>
            <Droplets className="w-8 h-8 mx-auto mb-3 text-blue-500" />
            <h4 className="font-medium text-gray-800 mb-2">{getTranslation('cervicalMucus')}</h4>
            <p className="text-sm text-gray-600">{getTranslation('recordMucus')}</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-all cursor-pointer"
                onClick={() => setActivePanel('ovulation-calendar')}>
            <CalendarCheck className="w-8 h-8 mx-auto mb-3 text-purple-500" />
            <h4 className="font-medium text-gray-800 mb-2">{getTranslation('ovulationCalendar')}</h4>
            <p className="text-sm text-gray-600">View calendar</p>
          </Card>
        </div>
      </div>
    );
  };

  
  const renderDashboard = () => (
    <div className="space-y-6">
      <Card className="p-8 text-center bg-gradient-to-br from-pink-50 to-purple-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{getTranslation('welcomeToPeriodCare')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {getTranslation('comprehensiveHealthManagement')}
        </p>
      </Card>
      
      {}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('track-cycle')}>
          <Calendar className="w-12 h-12 mx-auto mb-4 text-pink-500" />
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('trackYourCycle')}</h3>
          <p className="text-sm text-gray-600">Monitor your menstrual cycle</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('check-symptoms')}>
          <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('checkSymptoms')}</h3>
          <p className="text-sm text-gray-600">Log symptoms and moods</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('learn-care')}>
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('learnCare')}</h3>
          <p className="text-sm text-gray-600">Educational resources</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setActivePanel('wellness-circle')}>
          <Target className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="font-bold text-gray-800 mb-2">{getTranslation('wellnessCircle')}</h3>
          <p className="text-sm text-gray-600">Fertility tracking & reminders</p>
        </Card>
      </div>
    </div>
  );

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      {}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">{getTranslation('periodCare')}</h1>
        </div>
      </div>

      {}
      {activePanel === 'dashboard' && renderDashboard()}
      {activePanel === 'wellness-circle' && renderWellnessCircle()}
      
      {}
    </div>
  );
}