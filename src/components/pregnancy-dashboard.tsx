import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from './language-context';
import { useDemo } from './demo-context';
import { toast } from 'sonner@2.0.3';
import { HealthCard } from './health-card';
import { Teleconsultation } from './teleconsultation';
import { VoiceInterface } from './voice-interface';
import { Appointments } from './appointments';
import { HospitalFinder } from './hospital-finder';
import { PharmacyFinder } from './pharmacy-finder';
import { OfflineMedicalRecords } from './offline-medical-records';
import { NotificationCenter } from './notification-center';
import { OurDoctors } from './our-doctors';
import { 
  ArrowLeft, 
  CreditCard, 
  Video, 
  Brain, 
  AlertTriangle, 
  Pill, 
  Calendar,
  Mic,
  Settings,
  LogOut,
  MapPin,
  Bell,
  FileText,
  Building2,
  UserCheck,
  Baby,
  Heart,
  Utensils,
  Dumbbell,
  Clock,
  Activity,
  CheckCircle
} from 'lucide-react';

type ActivePanel = 'dashboard' | 'healthcard' | 'consultation' | 'emergency' | 'appointments' | 'hospitals' | 'pharmacies' | 'medical-records' | 'notifications' | 'doctors' | 'diet-plan' | 'exercise' | 'checkups';

interface PregnancyDashboardProps {
  onBack: () => void;
}


const getBabySize = (weeks: number) => {
  if (weeks < 8) return "Size of a raspberry";
  if (weeks < 12) return "Size of a plum";
  if (weeks < 16) return "Size of a lemon";
  if (weeks < 20) return "Size of a banana";
  if (weeks < 24) return "Size of a papaya";
  if (weeks < 28) return "Size of a cauliflower";
  if (weeks < 32) return "Size of a coconut";
  if (weeks < 36) return "Size of a pineapple";
  return "Size of a watermelon";
};

const getBabyWeight = (weeks: number) => {
  if (weeks < 12) return "~15-20 grams";
  if (weeks < 16) return "~100 grams";
  if (weeks < 20) return "~300 grams";
  if (weeks < 24) return "~500 grams";
  if (weeks < 28) return "~900 grams";
  if (weeks < 32) return "~1.5 kg";
  if (weeks < 36) return "~2.5 kg";
  return "~3-3.5 kg";
};

const getBabyDevelopment = (weeks: number) => {
  if (weeks < 12) return "Major organs forming";
  if (weeks < 16) return "Face features developing";
  if (weeks < 20) return "Heartbeat can be heard";
  if (weeks < 24) return "Hearing is developing";
  if (weeks < 28) return "Eyes can open and close";
  if (weeks < 32) return "Brain rapidly developing";
  if (weeks < 36) return "Lungs maturing";
  return "Fully developed, ready for birth";
};

const getBabyMovement = (weeks: number) => {
  if (weeks < 16) return "Too small to feel movement";
  if (weeks < 20) return "First gentle flutters";
  if (weeks < 24) return "Active kicks and turns";
  if (weeks < 28) return "Strong movements daily";
  if (weeks < 32) return "Regular movement patterns";
  if (weeks < 36) return "Less space, slower movements";
  return "Preparing for birth position";
};

export function PregnancyDashboard({ onBack }: PregnancyDashboardProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');
  const [isListening, setIsListening] = useState(false);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | null>(null);
  const [tempWeekInput, setTempWeekInput] = useState<string>(''); // Add temporary input state
  const [showWeekSetup, setShowWeekSetup] = useState(true);
  const { t, language } = useLanguage();
  const { demoProfile } = useDemo();

  // Define variables early to avoid initialization errors
  const currentWeeks = pregnancyWeeks || 24;
  const dueDate = demoProfile?.pregnancy_status?.due_date || '2025-03-20';
  const trimester = currentWeeks <= 12 ? 1 : currentWeeks <= 28 ? 2 : 3;

  
  const handleWeekSubmit = () => {
    const week = parseInt(tempWeekInput);
    if (week >= 1 && week <= 42) {
      setPregnancyWeeks(week);
      setShowWeekSetup(false);
      toast.success(`Week ${week} pregnancy care activated! 🎉`);
    } else {
      toast.error('Please enter a valid pregnancy week (1-42)');
    }
  };

  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleWeekSubmit();
    }
  };

  if (activePanel === 'consultation') {
    return <Teleconsultation onBack={() => setActivePanel('dashboard')} filterBySpecialty="gynecologist" />;
  }

  if (activePanel === 'appointments') {
    return <Appointments onBack={() => setActivePanel('dashboard')} />;
  }

  if (activePanel === 'hospitals') {
    return <HospitalFinder onBack={() => setActivePanel('dashboard')} prioritizeMaternity={true} />;
  }

  
  if (activePanel === 'diet-plan') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setActivePanel('dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Pregnancy Diet Plan</h1>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto">
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentWeeks} Weeks Pregnancy Diet</h2>
              <p className="text-gray-600">Healthy nutrition for you and your baby</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-green-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Today's Meals
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Breakfast (8:00 AM)</span>
                      <span className="text-sm text-green-600">✓ Completed</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 1 bowl oatmeal with fruits</li>
                      <li>• 1 glass milk</li>
                      <li>• 1 banana</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-orange-800">Lunch (1:00 PM)</span>
                      <span className="text-sm text-orange-600">⏰ Upcoming</span>
                    </div>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• 2 rotis with dal</li>
                      <li>• Mixed vegetable curry</li>
                      <li>• 1 bowl rice</li>
                      <li>• Yogurt</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Dinner (7:00 PM)</span>
                      <span className="text-sm text-blue-600">📋 Planned</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Paneer paratha</li>
                      <li>• Green leafy vegetables</li>
                      <li>• 1 glass milk</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-blue-600 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Nutrition Goals
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Calcium</span>
                      <span className="text-sm text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Iron</span>
                      <span className="text-sm text-orange-600">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Protein</span>
                      <span className="text-sm text-blue-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Folic Acid</span>
                      <span className="text-sm text-purple-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-bold text-pink-800 mb-2">💡 Today's Tip</h4>
                  <p className="text-sm text-pink-700">
                    Include green leafy vegetables like spinach and fenugreek in your diet for iron and folic acid.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'exercise') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setActivePanel('dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Pregnancy Exercise</h1>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto">
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Safe Exercises - {trimester === 1 ? '1st' : trimester === 2 ? '2nd' : '3rd'} Trimester</h2>
              <p className="text-gray-600">Gentle activities for you and baby's health</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-purple-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Today's Exercises
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Morning Walk</span>
                      <span className="text-sm text-green-600">✓ Done - 30 min</span>
                    </div>
                    <p className="text-sm text-green-700">Great for cardiovascular health</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Prenatal Yoga</span>
                      <span className="text-sm text-blue-600">📍 Next - 4:00 PM</span>
                    </div>
                    <p className="text-sm text-blue-700">Breathing and gentle stretches</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-orange-800">Pelvic Floor Exercises</span>
                      <span className="text-sm text-orange-600">⏰ Evening</span>
                    </div>
                    <p className="text-sm text-orange-700">Strengthen pelvic muscles</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">🎯 Week Goal</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Exercise Days</span>
                    <span className="text-sm text-purple-600">4/5 days</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-red-600 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Safety Guidelines
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">✅ Safe Activities</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Walking and light jogging</li>
                      <li>• Swimming (if comfortable)</li>
                      <li>• Prenatal yoga</li>
                      <li>• Breathing exercises</li>
                      <li>• Pelvic floor exercises</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2">❌ Avoid These</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• High-impact activities</li>
                      <li>• Contact sports</li>
                      <li>• Lying on back after 1st trimester</li>
                      <li>• Hot yoga or saunas</li>
                      <li>• Heavy weightlifting</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">⚠️ Stop if you feel:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Dizziness or faintness</li>
                      <li>• Chest pain</li>
                      <li>• Bleeding</li>
                      <li>• Contractions</li>
                      <li>• Call doctor immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (activePanel === 'checkups') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setActivePanel('dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Prenatal Checkups</h1>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-4xl mx-auto">
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pregnancy Monitoring</h2>
              <p className="text-gray-600">Track your baby's development and your health</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-teal-600 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Appointments
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-red-800">Next Checkup</span>
                      <span className="text-sm text-red-600">Feb 14, 2025</span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">Dr. Anjali Mehta - Gynecologist</p>
                    <ul className="text-xs text-red-600 space-y-1">
                      <li>• Ultrasound scan</li>
                      <li>• Blood pressure check</li>
                      <li>• Weight monitoring</li>
                      <li>• Baby's heartbeat</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Glucose Test</span>
                      <span className="text-sm text-blue-600">Feb 20, 2025</span>
                    </div>
                    <p className="text-sm text-blue-700">Check for gestational diabetes</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-purple-800">Detailed Scan</span>
                      <span className="text-sm text-purple-600">Feb 28, 2025</span>
                    </div>
                    <p className="text-sm text-purple-700">Anatomy scan and baby's growth</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-green-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Recent Results
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Last Checkup</span>
                      <span className="text-sm text-green-600">Jan 10, 2025</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">+2 kg (Normal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BP:</span>
                        <span className="font-medium">120/80 (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Baby's HR:</span>
                        <span className="font-medium">150 bpm (Healthy)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Blood Test Results</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Hemoglobin:</span>
                        <span className="font-medium">11.5 g/dl (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sugar:</span>
                        <span className="font-medium">95 mg/dl (Normal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Iron:</span>
                        <span className="font-medium text-orange-600">Low (Take supplements)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">👶 Baby Development</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <p><strong>Week {currentWeeks}:</strong> {getBabySize(currentWeeks)}</p>
                      <p><strong>Weight:</strong> {getBabyWeight(currentWeeks)}</p>
                      <p><strong>Development:</strong> {getBabyDevelopment(currentWeeks)}</p>
                      <p><strong>Movement:</strong> {getBabyMovement(currentWeeks)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {}
          <Card className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" />
              Daily Reminders
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <Pill className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-800">Prenatal Vitamins</p>
                <p className="text-xs text-orange-600">Every morning with breakfast</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Utensils className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-800">Iron Supplement</p>
                <p className="text-xs text-blue-600">After lunch</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-800">Calcium Tablet</p>
                <p className="text-xs text-green-600">Before bed</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (showWeekSetup && pregnancyWeeks === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
            <Baby className="w-10 h-10 text-pink-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            Welcome to Pregnancy Care! 🤱
          </h2>
          
          <p className="text-gray-700 mb-6">
            To provide you with personalized care and guidance, please tell us how many weeks pregnant you are.
          </p>
          
          <div className="space-y-4">
            <div>
              <Label className="text-left block mb-2">Current Pregnancy Week</Label>
              <Input
                type="number"
                min="1"
                max="42"
                placeholder="Enter week number (1-42)"
                value={tempWeekInput}
                onChange={(e) => setTempWeekInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-lg"
              />
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <p className="mb-1">💡 <strong>Not sure about your week?</strong></p>
              <p>Count from your last menstrual period or check your previous ultrasound reports.</p>
            </div>
            
            <Button
              onClick={handleWeekSubmit}
              className="w-full bg-pink-600 hover:bg-pink-700 py-3"
              disabled={!tempWeekInput || parseInt(tempWeekInput) < 1 || parseInt(tempWeekInput) > 42}
            >
              Continue to Pregnancy Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      id: 'diet-plan',
      icon: Utensils,
      label: language === 'en' ? 'Diet Plan' : language === 'hi' ? 'आहार योजना' : 'ਖੁਰਾਕ ਯੋਜਨਾ',
      bgColor: 'bg-green-500',
      emoji: '🥗',
      customImage: null
    },
    {
      id: 'exercise',
      icon: Dumbbell,
      label: language === 'en' ? 'Safe Exercise' : language === 'hi' ? 'सुरक्षित व्यायाम' : 'ਸੁਰੱਖਿਤ ਕਸਰਤ',
      bgColor: 'bg-purple-500',
      emoji: '🤸‍♀️',
      customImage: null
    },
    {
      id: 'checkups',
      icon: Heart,
      label: language === 'en' ? 'Prenatal Care' : language === 'hi' ? 'प्रसवपूर्व देखभाल' : 'ਜਨਮ ਤੋਂ ਪਹਿਲਾਂ ਦੇਖਭਾਲ',
      bgColor: 'bg-red-500',
      emoji: '🩺',
      customImage: null
    },
    {
      id: 'consultation',
      icon: Video,
      label: 'Talk to Gynecologist',
      bgColor: 'bg-teal-500',
      emoji: '👩‍⚕️',
      customImage: null
    },
    {
      id: 'appointments',
      icon: Calendar,
      label: 'My Appointments',
      bgColor: 'bg-indigo-500',
      emoji: '📅',
      customImage: null
    },
    {
      id: 'hospitals',
      icon: MapPin,
      label: 'Maternity Hospitals',
      bgColor: 'bg-cyan-500',
      emoji: '🏥',
      customImage: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">
                {demoProfile?.full_name || 'Priya Sharma'}
              </h1>
              <p className="text-sm text-gray-600">
                {currentWeeks} weeks pregnant • Trimester {trimester}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActivePanel('dashboard')}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {}
        <VoiceInterface 
          isListening={isListening}
          setIsListening={setIsListening}
          onNavigate={setActivePanel}
        />

        {}
        <Card className="p-6 mb-6 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Baby className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Week {currentWeeks}</h2>
            <p className="text-gray-600 mb-4">Due Date: {new Date(dueDate).toLocaleDateString('en-IN')}</p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Pregnancy Progress</span>
                <span className="text-sm text-pink-600">{Math.round((currentWeeks/40)*100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                  style={{width: `${(currentWeeks/40)*100}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {40 - currentWeeks} weeks remaining
              </p>
            </div>
          </div>
        </Card>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
              onClick={() => setActivePanel(item.id as ActivePanel)}
            >
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center text-2xl`}>
                  {item.emoji}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.label}</h3>
              <div className="flex justify-center">
                <item.icon className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        {}
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Today's Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Morning Vitamins</p>
                  <p className="text-sm text-gray-600">Prenatal vitamins taken</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">8:00 AM ✓</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Prenatal Yoga</p>
                  <p className="text-sm text-gray-600">Breathing exercises</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">4:00 PM</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Iron Supplement</p>
                  <p className="text-sm text-gray-600">After evening meal</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">8:00 PM</span>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Today's Health Tip
          </h3>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Week {pregnancyWeeks} Tip:</strong> Your baby can now hear sounds from outside the womb! 
              Try talking or playing soft music to your baby.
            </p>
            <p className="text-sm text-gray-600">
              💡 Remember to stay hydrated and eat iron-rich foods like spinach and lentils.
            </p>
          </div>
        </Card>

        {}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
            Pregnancy tracking - Works offline ready
          </p>
        </div>
      </div>
    </div>
  );
}