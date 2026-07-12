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
      
      educationalContent: "Educational Content",
      menstrualHealth: "Menstrual Health",
      nutritionTips: "Nutrition Tips",
      exerciseTips: "Exercise Tips",
      painManagement: "Pain Management",
      learnMore: "Learn More",
      backToTopics: "Back to Topics",
      
      menstrualHealthContent: "Understanding your menstrual cycle is key to reproductive health. A normal cycle ranges from 21-35 days, with bleeding lasting 3-7 days. Track your periods to identify patterns and potential health issues early. Key facts: 🩸 Your cycle is counted from the first day of bleeding to the day before your next period starts. 🌡️ Normal flow volume is 30-40ml total per cycle. 💊 Iron deficiency is common during periods - eat iron-rich foods. 📋 Track flow intensity, pain levels, clot size, and any unusual symptoms to discuss with your healthcare provider. 🚨 Seek medical help if periods last longer than 7 days, occur more frequently than every 21 days, or cause severe pain.",
      nutritionContent: "Proper nutrition during menstruation can significantly reduce symptoms and boost energy. Essential nutrients: 🥬 Iron from spinach, lentils, lean meats, and dark chocolate prevents anemia. 🥛 Calcium from dairy, almonds, and leafy greens reduces cramps by 50%. 🌰 Magnesium from nuts, seeds, and whole grains relieves mood swings and bloating. 🐟 Omega-3 fatty acids from fish, walnuts reduce inflammation and pain. 💧 Drink 8-10 glasses of water daily to reduce bloating. ☕ Limit caffeine and alcohol which can worsen mood swings and increase cramps. 🍌 Potassium-rich foods like bananas help reduce water retention. 🍫 Dark chocolate (70%+ cocoa) can boost mood and provide iron.",
      exerciseContent: "Regular exercise can reduce period pain by 25-50% through natural endorphin release. Best exercises during periods: 🚶‍♀️ Walking for 20-30 minutes daily improves circulation and reduces cramps. 🧘‍♀️ Yoga poses like child's pose, cat-cow, and supine twists relieve tension. 🏊‍♀️ Swimming provides gentle full-body movement (tampons or menstrual cups recommended). 🚴‍♀️ Light cycling can reduce bloating and improve mood. ❌ Avoid: High-intensity workouts during heavy flow days, inverted yoga poses during menstruation, contact sports if using pads. 📊 Studies show women who exercise regularly have 40% less menstrual pain. Listen to your body and reduce intensity on heavy flow days.",
      painContent: "Period pain affects 80% of women, but effective management techniques exist. Natural remedies: 🔥 Heat therapy using heating pads, warm baths, or hot water bottles relaxes uterine muscles. 🫖 Herbal teas like ginger, chamomile, and raspberry leaf reduce inflammation. 💆‍♀️ Gentle abdominal massage with circular motions improves blood flow. 🧘‍♀️ Deep breathing and meditation help manage pain perception. 💊 Over-the-counter options: Ibuprofen reduces inflammation and is most effective for menstrual pain. Naproxen provides longer-lasting relief. Take pain relievers before pain peaks for maximum effectiveness. 🚨 Seek medical help if: Pain interferes with daily activities, pain suddenly worsens, pain occurs outside of periods, or pain doesn't respond to treatment - these may indicate conditions like endometriosis or PCOS.",
      
      
      hygieneContent: "Proper menstrual hygiene prevents infections and promotes comfort. Product options: 🩲 Pads: Change every 3-4 hours, use cotton-based for sensitive skin. 🧻 Tampons: Change every 4-6 hours max, use lowest absorbency needed. 🥃 Menstrual cups: Can be worn up to 12 hours, eco-friendly and cost-effective. 🩲 Period underwear: Absorbs equivalent to 1-2 tampons, great for backup protection. 🛁 Hygiene tips: Wash hands before and after changing products. Clean from front to back to prevent UTIs. Use mild, unscented soap for washing. Change products more frequently on heavy days. Track your flow to choose appropriate products.",
      mythsContent: "Many period myths persist globally. Let's separate fact from fiction: ❌ MYTH: You can't swim during periods. ✅ FACT: Water pressure prevents leakage; use tampons or cups. ❌ MYTH: Period blood is 'dirty' or toxic. ✅ FACT: Period blood is normal blood mixed with tissue from uterine lining. ❌ MYTH: You shouldn't exercise during periods. ✅ FACT: Exercise often reduces symptoms and improves mood. ❌ MYTH: Periods sync up between women living together. ✅ FACT: No scientific evidence supports menstrual synchrony. ❌ MYTH: You can't get pregnant during your period. ✅ FACT: Though unlikely, pregnancy is possible especially with shorter cycles. ❌ MYTH: PMS is all in your head. ✅ FACT: Hormonal changes cause real physical and emotional symptoms.",
      environmentContent: "Sustainable period care benefits both you and the planet. Environmental impact: 🌍 Average woman uses 11,000+ disposable period products in lifetime. 🗑️ Conventional pads contain plastic and take 500-800 years to decompose. 🌱 Sustainable alternatives: Menstrual cups last 5-10 years, preventing 2,400+ tampons from landfills. Reusable cloth pads reduce waste by 95%. Period underwear eliminates need for disposables on light days. Organic cotton products are biodegradable and chemical-free. 💰 Cost savings: Menstrual cup costs ₹500-2000 but saves ₹50,000+ over lifetime. Choose what works for your body, lifestyle, and values."
      
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
      educationalContent: "शैक्षिक सामग्री",
      menstrualHealth: "मासिक धर्म स्वास्थ्य",
      nutritionTips: "पोषण टिप्स",
      exerciseTips: "व्यायाम टिप्स",
      painManagement: "दर्द प्रबंधन",
      learnMore: "और जानें",
      backToTopics: "विषयों पर वापस जाएं",
      menstrualHealthContent: "अपने मासिक धर्म चक्र को समझना प्रजनन स्वास्थ्य की कुंजी है। एक सामान्य चक्र 21-35 दिनों का होता है, खून बहना 3-7 दिन तक रहता है। मुख्य तथ्य: 🩸 आपका चक्र खून बहने के पहले दिन से अगले पीरियड से एक दिन पहले तक गिना जाता है। 🌡️ सामान्य फ्लो वॉल्यूम प्रति चक्र कुल 30-40ml है। 💊 पीरियड्स के दौरान आयरन की कमी आम है - आयरन युक्त खाद्य पदार्थ खाएं। 📋 फ्लो की तीव्रता, दर्द के स्तर, थक्के का आकार और किसी भी असामान्य लक्षण को ट्रैक करें। 🚨 यदि पीरियड्स 7 दिनों से अधिक रहते हैं, हर 21 दिन से अधिक बार होते हैं, या गंभीर दर्द होता है तो चिकित्सा सहायता लें।",
      nutritionContent: "मासिक धर्म के दौरान उचित पोषण लक्षणों को काफी कम कर सकता है और ऊर्जा बढ़ा सकता है। आवश्यक पोषक तत्व: 🥬 पालक, दाल, दुबले मांस और डार्क चॉकलेट से आयरन एनीमिया को रोकता है। 🥛 डेयरी, बादाम और हरी पत्तेदार सब्जियों से कैल्शियम ऐंठन को 50% कम करता है। 🌰 नट्स, सीड्स और साबुत अनाज से मैग्नीशियम मूड स्विंग्स और पेट फूलने से राहत देता है। 🐟 मछली, अखरोट से ओमेगा-3 सूजन और दर्द कम करता है। 💧 पेट फूलना कम करने के लिए दिन में 8-10 गिलास पानी पिएं। ☕ कैफीन और अल्कोहल सीमित करें जो मूड स्विंग्स बढ़ाते हैं। 🍌 केले जैसे पोटेशियम युक्त खाद्य पदार्थ पानी की रिटेंशन कम करते हैं।",
      exerciseContent: "नियमित व्यायाम प्राकृतिक एंडोर्फिन रिलीज के माध्यम से पीरियड दर्द को 25-50% तक कम कर सकता है। पीरियड्स के दौरान सबसे अच्छी एक्सरसाइज: 🚶‍♀️ रोजाना 20-30 मिनट चलना रक्त संचार सुधारता है और ऐंठन कम करता है। 🧘‍♀️ योग पोज़ जैसे चाइल्ड पोज़, कैट-काउ तनाव से राहत देते हैं। 🏊‍♀️ तैराकी कोमल पूर्ण शरीर गति प्रदान करती है। 🚴‍♀️ हल्की साइकिलिंग पेट फूलना कम करती है। ❌ बचें: भारी फ्लो के दिनों में हाई-इंटेंसिटी वर्कआउट्स से। 📊 अध्ययन दिखाते हैं कि नियमित व्यायाम करने वाली महिलाओं में 40% कम मासिक धर्म दर्द होता है।",
      painContent: "पीरियड दर्द 80% महिलाओं को प्रभावित करता है, लेकिन प्रभावी प्रबंधन तकनीकें मौजूद हैं। प्राकृतिक उपचार: 🔥 हीटिंग पैड, गर्म स्नान या गर्म पानी की बोतल से हीट थेरेपी गर्भाशय की मांसपेशियों को आराम देती है। 🫖 अदरक, कैमोमाइल चाय सूजन कम करती है। 💆‍♀️ पेट की हल्की मालिश रक्त प्रवाह सुधारती है। 💊 दवा विकल्प: इबुप्रोफेन सूजन कम करता है और मासिक धर्म दर्द के लिए सबसे प्रभावी है। दर्द चरम पर पहुंचने से पहले दर्द निवारक लें। 🚨 चिकित्सा सहायता लें यदि: दर्द दैनिक गतिविधियों में बाधा डाले, दर्द अचानक बिगड़े, या एंडोमेट्रियोसिस जैसी स्थितियों का संकेत हो।",
      
      hygieneContent: "उचित मासिक धर्म स्वच्छता संक्रमण रोकती है और आराम बढ़ाती है। उत्पाद विकल्प: 🩲 पैड्स: हर 3-4 घंटे में बदलें, संवेदनशील त्वचा के लिए कॉटन आधारित उपयोग करें। 🧻 टैम्पन: अधिकतम 4-6 घंटे में बदलें। 🥃 मेंस्ट्रुअल कप: 12 घंटे तक पहन सकते हैं, पर्यावरण-अनुकूल। 🛁 स्वच्छता टिप्स: उत्पाद बदलने से पहले और बाद में हाथ धोएं। संक्रमण रोकने के लिए आगे से पीछे की ओर साफ करें।",
      mythsContent: "कई पीरियड मिथक दुनियाभर में प्रचलित हैं। आइए तथ्य और कल्पना को अलग करें: ❌ मिथक: पीरियड्स के दौरान तैराकी नहीं कर सकते। ✅ तथ्य: पानी का दबाव रिसाव रोकता है। ❌ मिथक: पीरियड का खून 'गंदा' होता है। ✅ तथ्य: यह सामान्य रक्त और गर्भाशय की परत का मिश्रण है। ❌ मिथक: पीरियड्स के दौरान व्यायाम नहीं करना चाहिए। ✅ तथ्य: व्यायाम अक्सर लक्षण कम करता है।",
      environmentContent: "टिकाऊ पीरियड केयर आपके और ग्रह दोनों के लिए फायदेमंद है। पर्यावरणीय प्रभाव: 🌍 औसत महिला जीवनभर में 11,000+ डिस्पोजेबल पीरियड उत्पादों का उपयोग करती है। 🌱 टिकाऊ विकल्प: मेंस्ट्रुअल कप 5-10 साल चलता है। 💰 लागत बचत: मेंस्ट्रुअल कप की कीमत ₹500-2000 है लेकिन जीवनभर में ₹50,000+ बचाता है।"
      viewInsights: "अंतर्दृष्टि देखें",
      cycleHistory: "चक्र इतिहास",
      trends: "रुझान"
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
      trends: "ਰੁਝਾਨ"
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
    
    const existingLogs = JSON.parse(localStorage.getItem('symptomLogs') || '[]');
    existingLogs.push(logEntry);
    localStorage.setItem('symptomLogs', JSON.stringify(existingLogs));
    
    
    setSymptomLogs(existingLogs);
    
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
    toast.success(getTranslation('cycleInfoSaved'));
    setActivePanel('track-cycle');
  };

  const handleDateUpdate = (newDate: string, newCycleLength: string) => {
    setLastPeriodDate(newDate);
    setCycleLength(newCycleLength);
    localStorage.setItem('lastPeriodDate', newDate);
    localStorage.setItem('cycleLength', newCycleLength);
    setCycleDataEntered(true);
    toast.success(getTranslation('cycleInfoSaved'));
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
    
    const tempData = {
      date: new Date().toISOString(),
      temperature: parseFloat(tempInput),
      type: 'basal'
    };
    
    const existingTemps = JSON.parse(localStorage.getItem('temperatureData') || '[]');
    existingTemps.push(tempData);
    localStorage.setItem('temperatureData', JSON.stringify(existingTemps));
    
    toast.success(getTranslation('temperatureRecorded'));
    setTempInput('');
    setActivePanel('wellness-circle');
  };

  const handleMucusRecord = () => {
    if (!mucusType) return;
    
    const mucusData = {
      date: new Date().toISOString(),
      type: mucusType
    };
    
    const existingMucus = JSON.parse(localStorage.getItem('mucusData') || '[]');
    existingMucus.push(mucusData);
    localStorage.setItem('mucusData', JSON.stringify(existingMucus));
    
    toast.success(getTranslation('mucusRecorded'));
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

  
  const renderEducationDetail = () => {
    const getContentForTopic = () => {
      switch (selectedEducationTopic) {
        case 'menstrual':
          return getTranslation('menstrualHealthContent');
        case 'nutrition':
          return getTranslation('nutritionContent');
        case 'exercise':
          return getTranslation('exerciseContent');
        case 'pain':
          return getTranslation('painContent');
        case 'hygiene':
          return getTranslation('hygieneContent');
        case 'myths':
          return getTranslation('mythsContent');
        case 'environment':
          return getTranslation('environmentContent');
        default:
          return 'Educational content coming soon!';
      }
    };

    const getTitleForTopic = () => {
      switch (selectedEducationTopic) {
        case 'menstrual':
          return getTranslation('menstrualHealth');
        case 'nutrition':
          return getTranslation('nutritionTips');
        case 'exercise':
          return getTranslation('exerciseTips');
        case 'pain':
          return getTranslation('painManagement');
        case 'hygiene':
          return 'Menstrual Hygiene';
        case 'myths':
          return 'Period Myths vs Facts';
        case 'environment':
          return 'Eco-Friendly Periods';
        default:
          return 'Education';
      }
    };

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
            {getTitleForTopic()}
          </h3>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {getContentForTopic()}
            </p>
          </div>
          
          <Button
            onClick={() => setActivePanel('learn-care')}
            variant="outline"
            className="mt-6"
          >
            {getTranslation('backToTopics')}
          </Button>
        </Card>
      </div>
    );
  };

  const renderTrackCycle = () => {
    
    if (!cycleDataEntered || !lastPeriodDate || !cycleLength) {
      return renderCycleInfoInput();
    }

    const cycleDates = calculateCycleDates();
    
    return (
      <div className="space-y-6">
        {}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-red-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Droplets className="w-6 h-6 text-red-500" />
                <h3 className="font-bold text-gray-800">{getTranslation('lastPeriod')}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCycleDataEntered(false);
                  setActivePanel('track-cycle');
                }}
                className="text-red-500 hover:text-red-600"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {cycleDates.daysSinceLastPeriod} {getTranslation('daysAgo')}
            </p>
            <p className="text-sm text-gray-600">{new Date(lastPeriodDate).toLocaleDateString()}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-gray-800">{getTranslation('nextPeriod')}</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {cycleDates.daysUntilNext > 0 ? `${cycleDates.daysUntilNext} ${getTranslation('daysLeft')}` : 'Due Soon'}
            </p>
            <p className="text-sm text-gray-600">{cycleDates.nextPeriodDate}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-gray-800">{getTranslation('cycleLength')}</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{cycleDates.cycleLength} {getTranslation('days')}</p>
            <p className="text-sm text-gray-600">{getTranslation('regularCycle')}</p>
          </Card>
        </div>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-500" />
            {getTranslation('currentCycle')} - September 2025
          </h3>
          
          {}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={`day-header-${index}`} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
            
            {}
            <div className="w-10 h-10"></div>
            
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const today = 18; 
              
              
              const lastPeriodDay = new Date(lastPeriodDate).getDate();
              const lastPeriodMonth = new Date(lastPeriodDate).getMonth();
              const currentMonth = 8; 
              
              let className = "w-10 h-10 rounded-full flex items-center justify-center text-sm cursor-pointer ";
              
              
              const isPeriodDay = lastPeriodMonth === currentMonth && 
                                 day >= lastPeriodDay && day <= lastPeriodDay + 4;
              
              
              const cycleDay = cycleDates.daysSinceLastPeriod - (30 - day); 
              const isOvulationDay = Math.abs(cycleDay - (cycleDates.cycleLength - 14)) <= 1;
              const isFertileDay = cycleDay >= (cycleDates.cycleLength - 19) && 
                                 cycleDay <= (cycleDates.cycleLength - 13);
              
              if (day === today) {
                className += "bg-blue-500 text-white ring-2 ring-blue-300"; 
              } else if (isPeriodDay) {
                className += "bg-red-200 text-red-800"; 
              } else if (isOvulationDay) {
                className += "bg-purple-200 text-purple-800"; 
              } else if (isFertileDay) {
                className += "bg-green-200 text-green-800"; 
              } else {
                className += "text-gray-600 hover:bg-gray-100";
              }
              
              return (
                <div key={day} className={className} onClick={() => {
                  toast.info(`Selected date: September ${day}, 2025`);
                }}>
                  {day}
                </div>
              );
            })}
          </div>

          {}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>{getTranslation('today')} (18)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 rounded-full"></div>
              <span>{getTranslation('menstruation')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded-full"></div>
              <span>{getTranslation('fertile')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-200 rounded-full"></div>
              <span>{getTranslation('ovulation')}</span>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            {getTranslation('cycleAnalytics')}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">{getTranslation('averageCycle')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cycle Length</span>
                  <span className="font-medium">{cycleDates.cycleLength} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Period Length</span>
                  <span className="font-medium">5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Regularity</span>
                  <span className="font-medium text-green-600">
                    {cycleDates.cycleLength >= 21 && cycleDates.cycleLength <= 35 ? 'Regular' : 'Variable'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">{getTranslation('cycleHistory')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Cycle Day</span>
                  <span className="font-medium">Day {cycleDates.daysSinceLastPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Period</span>
                  <span className="font-medium">
                    {cycleDates.daysUntilNext > 0 ? `${cycleDates.daysUntilNext} days` : 'Due now'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phase</span>
                  <span className="font-medium text-blue-600">
                    {cycleDates.daysSinceLastPeriod <= 5 ? 'Menstrual' :
                     cycleDates.daysSinceLastPeriod <= cycleDates.cycleLength - 16 ? 'Follicular' :
                     cycleDates.daysSinceLastPeriod <= cycleDates.cycleLength - 12 ? 'Fertile' :
                     'Luteal'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <HealthTip />
      </div>
    );
  };

  const renderCheckSymptoms = () => {
    const todaysLog = getTodaysLog();
    
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <NotebookPen className="w-5 h-5 mr-2 text-purple-500" />
            {getTranslation('logTodaySymptoms')}
          </h3>
          
          <div className="space-y-6">
            {}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">{getTranslation('howAreYouFeeling')}</h4>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { id: 'happy', emoji: '😊', label: getTranslation('happy'), color: 'bg-yellow-100 border-yellow-300' },
                  { id: 'calm', emoji: '😌', label: getTranslation('calm'), color: 'bg-blue-100 border-blue-300' },
                  { id: 'energetic', emoji: '⚡', label: getTranslation('energetic'), color: 'bg-orange-100 border-orange-300' },
                  { id: 'irritable', emoji: '😤', label: getTranslation('irritability'), color: 'bg-red-100 border-red-300' },
                  { id: 'anxious', emoji: '😰', label: getTranslation('anxiety'), color: 'bg-purple-100 border-purple-300' }
                ].map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    className={`h-16 flex-col space-y-2 ${selectedMood === mood.id ? 'bg-pink-500 text-white' : mood.color}`}
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">{getTranslation('selectSymptoms')}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'cramps', icon: '🤕', label: getTranslation('cramps') },
                  { id: 'bloating', icon: '🎈', label: getTranslation('bloating') },
                  { id: 'headache', icon: '🤯', label: getTranslation('headache') },
                  { id: 'fatigue', icon: '😴', label: getTranslation('fatigue') },
                  { id: 'nausea', icon: '🤢', label: getTranslation('nausea') },
                  { id: 'backPain', icon: '🦴', label: getTranslation('backPain') },
                  { id: 'breastTenderness', icon: '💙', label: getTranslation('breastTenderness') },
                  { id: 'moodSwings', icon: '🎭', label: getTranslation('moodSwings') }
                ].map((symptom) => (
                  <Button
                    key={symptom.id}
                    variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
                    className={`h-12 justify-start space-x-2 text-left ${
                      selectedSymptoms.includes(symptom.id) ? 'bg-pink-500 text-white' : ''
                    }`}
                    onClick={() => handleSymptomToggle(symptom.id)}
                  >
                    <span>{symptom.icon}</span>
                    <span className="text-sm">{symptom.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-pink-500 hover:bg-pink-600"
              onClick={handleSaveSymptoms}
              disabled={selectedSymptoms.length === 0 && !selectedMood}
            >
              {getTranslation('saveLog')}
            </Button>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            {getTranslation('todaysLog')}
          </h3>
          
          {todaysLog ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">
                    {todaysLog.mood === 'happy' ? '😊' : 
                     todaysLog.mood === 'calm' ? '😌' : 
                     todaysLog.mood === 'energetic' ? '⚡' : 
                     todaysLog.mood === 'irritable' ? '😤' : 
                     todaysLog.mood === 'anxious' ? '😰' : '😐'}
                  </span>
                  <span className="font-medium">Mood: {todaysLog.mood}</span>
                </div>
                {todaysLog.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {todaysLog.symptoms.map((symptom, index) => (
                      <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                        {getTranslation(symptom)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">{getTranslation('recommendations')}</h4>
                {getTodaysRecommendations(todaysLog.symptoms, todaysLog.mood).map((rec, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-800">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              {getTranslation('noLogsYet')}
            </p>
          )}
        </Card>

        {}
        {symptomLogs.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              {getTranslation('symptomHistory')}
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {symptomLogs.slice(-5).reverse().map((log, index) => {
                
                const baseDate = new Date(log.date);
                const displayDate = new Date(baseDate.getTime() - (index * 24 * 60 * 60 * 1000)); 
                
                return (
                  <div key={`${log.date}-${index}`} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {displayDate.toLocaleDateString()}
                      </span>
                      <span className="text-lg">
                        {log.mood === 'happy' ? '😊' : 
                         log.mood === 'calm' ? '😌' : 
                         log.mood === 'energetic' ? '⚡' : 
                         log.mood === 'irritable' ? '😤' : 
                         log.mood === 'anxious' ? '😰' : '😐'}
                      </span>
                    </div>
                    {log.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {log.symptoms.map((symptom, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {getTranslation(symptom)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <HealthTip />
      </div>
    );
  };

  const renderLearnCare = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          {getTranslation('educationalContent')}
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { 
              id: 'menstrual',
              title: getTranslation('menstrualHealth'), 
              desc: 'Understanding your cycle and maintaining good menstrual hygiene',
              icon: '🩸',
              color: 'bg-red-50 border-red-200'
            },
            { 
              id: 'nutrition',
              title: getTranslation('nutritionTips'), 
              desc: 'Foods that help manage period symptoms and boost energy',
              icon: '🥗',
              color: 'bg-green-50 border-green-200'
            },
            { 
              id: 'exercise',
              title: getTranslation('exerciseTips'), 
              desc: 'Safe exercises during menstruation and hormone phases',
              icon: '🏃‍♀️',
              color: 'bg-blue-50 border-blue-200'
            },
            { 
              id: 'pain',
              title: getTranslation('painManagement'), 
              desc: 'Natural and medical approaches to managing period pain',
              icon: '💆‍♀️',
              color: 'bg-purple-50 border-purple-200'
            },
            { 
              id: 'hygiene',
              title: 'Menstrual Hygiene', 
              desc: 'Best practices for cleanliness and product choices',
              icon: '🧼',
              color: 'bg-pink-50 border-pink-200'
            },
            { 
              id: 'myths',
              title: 'Period Myths vs Facts', 
              desc: 'Debunking common misconceptions about menstruation',
              icon: '❌',
              color: 'bg-yellow-50 border-yellow-200'
            },
            { 
              id: 'environment',
              title: 'Eco-Friendly Periods', 
              desc: 'Sustainable menstrual products and environmental impact',
              icon: '🌱',
              color: 'bg-emerald-50 border-emerald-200'
            }
          ].map((topic) => (
            <Card 
              key={topic.id} 
              className={`p-4 cursor-pointer hover:shadow-md transition-all ${topic.color}`}
              onClick={() => handleEducationTopicSelect(topic.id)}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">{topic.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{topic.desc}</p>
                  <Button variant="outline" size="sm">
                    {getTranslation('learnMore')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <HealthTip />
    </div>
  );

  const renderWellnessCircle = () => (
    <div className="space-y-6">
      {}
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Baby className="w-5 h-5 mr-2 text-green-500" />
          {getTranslation('fertilityTracking')}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">{getTranslation('fertilityWindow')}</h4>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">{getTranslation('highFertility')}</span>
                  <span className="text-sm text-green-600">Jan 26-30</span>
                </div>
                <p className="text-xs text-green-600 mt-1">5 days remaining</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">{getTranslation('ovulation')}</span>
                  <span className="text-sm text-blue-600">Jan 28</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Peak fertility day</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Tracking Options</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start space-x-2"
                onClick={() => setActivePanel('temp-tracker')}
              >
                <Thermometer className="w-4 h-4" />
                <span>{getTranslation('basalBodyTemp')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start space-x-2"
                onClick={() => setActivePanel('mucus-tracker')}
              >
                <Droplets className="w-4 h-4" />
                <span>{getTranslation('cervicalMucus')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start space-x-2"
                onClick={() => setActivePanel('ovulation-calendar')}
              >
                <Calendar className="w-4 h-4" />
                <span>{getTranslation('ovulationCalendar')}</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-orange-500" />
          {getTranslation('setReminders')}
        </h3>
        
        <div className="space-y-4">
          {[
            { id: 'pill', icon: '💊', label: getTranslation('pillReminder'), time: '9:00 AM', key: 'pill' },
            { id: 'exercise', icon: '🏃‍♀️', label: getTranslation('gymReminder'), time: '6:00 PM', key: 'exercise' },
            { id: 'water', icon: '💧', label: getTranslation('waterReminder'), time: 'Every 2 hours', key: 'water' },
            { id: 'period', icon: '📅', label: 'Period Prediction', time: '3 days before', key: 'period' },
            { id: 'ovulation', icon: '🌸', label: 'Ovulation Alert', time: '1 day before', key: 'ovulation' }
          ].map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{reminder.icon}</span>
                <div>
                  <p className="font-medium text-gray-800">{reminder.label}</p>
                  <p className="text-sm text-gray-600">{reminder.time}</p>
                </div>
              </div>
              <button
                className={`w-12 h-6 rounded-full ${reminderSettings[reminder.key] ? 'bg-pink-500' : 'bg-gray-300'} relative transition-colors`}
                onClick={() => handleReminderToggle(reminder.key)}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${reminderSettings[reminder.key] ? 'right-0.5' : 'left-0.5'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </Card>

      <HealthTip />
    </div>
  );

  
  const renderOvulationCalendar = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
          <CalendarCheck className="w-5 h-5 mr-2 text-green-500" />
          {getTranslation('ovulationCalendar')}
        </h3>
        
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Ovulation Calendar</h4>
          <p className="text-gray-600 mb-4">Track your fertile days and ovulation predictions</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">
              🌸 Your next ovulation is predicted for <strong>January 28, 2025</strong>
            </p>
            <p className="text-green-600 text-sm mt-2">
              Fertile window: January 26-30
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const handleBackNavigation = () => {
    if (activePanel === 'dashboard') {
      onBack(); 
    } else {
      setActivePanel('dashboard'); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      {}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-pink-600">
              {activePanel === 'dashboard' ? getTranslation('periodCare') : 
               activePanel === 'track-cycle' ? getTranslation('trackYourCycle') :
               activePanel === 'check-symptoms' ? getTranslation('checkSymptoms') :
               activePanel === 'learn-care' ? getTranslation('learnCare') :
               activePanel === 'wellness-circle' ? getTranslation('wellnessCircle') :
               activePanel === 'date-input' ? getTranslation('editPeriodDate') :
               activePanel === 'education-detail' ? getTranslation('learnCare') :
               activePanel === 'temp-tracker' ? getTranslation('temperatureTracker') :
               activePanel === 'mucus-tracker' ? getTranslation('mucusTracker') :
               activePanel === 'ovulation-calendar' ? getTranslation('ovulationCalendar') :
               getTranslation('periodCare')}
            </h1>
            {activePanel === 'dashboard' && (
              <p className="text-gray-600">{getTranslation('comprehensiveHealthManagement')}</p>
            )}
          </div>
        </div>
      </div>

      {}
      {activePanel === 'dashboard' && (
        <div className="space-y-8">
          {}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{getTranslation('welcomeToPeriodCare')}</h2>
            <div className="inline-block bg-pink-50 border border-pink-200 rounded-lg px-6 py-3">
              <p className="text-pink-700">
                💗 Private, secure, and designed with care for your health journey
              </p>
            </div>
          </div>

          {}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {}
            <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-200 transform hover:scale-105"
                  onClick={() => setActivePanel('track-cycle')}>
              <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{getTranslation('trackYourCycle')}</h3>
              <p className="text-gray-600 mb-4">Monitor your cycle with insights and analytics</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">📊 {getTranslation('cycleAnalytics')}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">📈 {getTranslation('trends')}</span>
              </div>
            </Card>

            {}
            <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-200 transform hover:scale-105"
                  onClick={() => setActivePanel('check-symptoms')}>
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <NotebookPen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{getTranslation('checkSymptoms')}</h3>
              <p className="text-gray-600 mb-4">Log symptoms and track your mood patterns</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">😊 Mood</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">🤕 Symptoms</span>
              </div>
            </Card>

            {}
            <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-200 transform hover:scale-105"
                  onClick={() => setActivePanel('learn-care')}>
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{getTranslation('learnCare')}</h3>
              <p className="text-gray-600 mb-4">Educational content and health tips</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">📚 Education</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">💡 Tips</span>
              </div>
            </Card>

            {}
            <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-200 transform hover:scale-105"
                  onClick={() => setActivePanel('wellness-circle')}>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{getTranslation('wellnessCircle')}</h3>
              <p className="text-gray-600 mb-4">Fertility tracking and wellness reminders</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">🌸 Fertility</span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">⏰ Reminders</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {}
      {activePanel === 'track-cycle' && renderTrackCycle()}
      {activePanel === 'check-symptoms' && renderCheckSymptoms()}
      {activePanel === 'learn-care' && renderLearnCare()}
      {activePanel === 'wellness-circle' && renderWellnessCircle()}
      {activePanel === 'education-detail' && renderEducationDetail()}
      {activePanel === 'temp-tracker' && renderTempTracker()}
      {activePanel === 'mucus-tracker' && renderMucusTracker()}
      {activePanel === 'ovulation-calendar' && renderOvulationCalendar()}
    </div>
  );
}