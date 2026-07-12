import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useLanguage } from './language-context';
import { LanguageSwitcher } from './language-switcher';
import { useAuth } from './auth-context';
import { useDemo } from './demo-context';
import { ArrowLeft, Camera, Upload, MapPin, CheckCircle, AlertTriangle, XCircle, Mic, MicOff, Heart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './ImageWithFallback';
import { environmentalService } from '../utils/supabase/client';

interface SurveyData {
  wasteDisposal: 'yes' | 'no' | '';
  stagnantWater: 'yes' | 'no' | '';
  sanitationFrequency: 'daily' | 'weekly' | 'rarely' | 'never' | '';
  pestInfestation: 'yes' | 'no' | '';
  diseaseReports: 'yes' | 'no' | '';
  diseaseDetails: string;
  additionalComments: string;
  photos: File[];
  location: string;
}

interface EnvironmentalSurveyProps {
  onBack: () => void;
}

export function EnvironmentalSurvey({ onBack }: EnvironmentalSurveyProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isDemoMode, demoProfile } = useDemo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [surveyResult, setSurveyResult] = useState<any>(null);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    wasteDisposal: '',
    stagnantWater: '',
    sanitationFrequency: '',
    pestInfestation: '',
    diseaseReports: '',
    diseaseDetails: '',
    additionalComments: '',
    photos: [],
    location: ''
  });

  // Get user's location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSurveyData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
        },
        (error) => {
          
          if (error.code === error.PERMISSION_DENIED) {
            console.log('Location permission denied by user - using fallback');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            console.log('Location information unavailable - using fallback');
          } else if (error.code === error.TIMEOUT) {
            console.log('Location request timed out - using fallback');
          }
          
          setSurveyData(prev => ({
            ...prev,
            location: 'Location not available'
          }));
        },
        {
          timeout: 5000, 
          enableHighAccuracy: false 
        }
      );
    } else {
      
      setSurveyData(prev => ({
        ...prev,
        location: 'Location not supported'
      }));
    }
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSurveyData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newFiles].slice(0, 3) 
      }));
      toast.success(`${newFiles.length} photo(s) added`);
    }
  };

  const removePhoto = (index: number) => {
    setSurveyData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const startVoiceInput = (fieldName: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported on this device');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; 

    setIsListening(true);
    setActiveVoiceField(fieldName);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSurveyData(prev => ({
        ...prev,
        [fieldName]: transcript
      }));
      toast.success('Voice input recorded');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Voice input failed');
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveVoiceField(null);
    };

    recognition.start();
  };

  const submitSurvey = async () => {
    
    if (!surveyData.wasteDisposal || !surveyData.stagnantWater || 
        !surveyData.sanitationFrequency || !surveyData.pestInfestation || 
        !surveyData.diseaseReports) {
      toast.error('Please answer all required questions');
      return;
    }

    if (surveyData.diseaseReports === 'yes' && !surveyData.diseaseDetails.trim()) {
      toast.error('Please provide details about disease reports');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      
      if (isDemoMode || demoProfile) {
        
        console.log('Demo user survey submission:', surveyData);
        
        
        let riskScore = 0;
        if (surveyData.wasteDisposal === 'no') riskScore += 25;
        if (surveyData.stagnantWater === 'yes') riskScore += 25;
        if (surveyData.sanitationFrequency === 'rarely' || surveyData.sanitationFrequency === 'never') riskScore += 30;
        if (surveyData.pestInfestation === 'yes') riskScore += 15;
        if (surveyData.diseaseReports === 'yes') riskScore += 30;
        
        
        let priority: 'low' | 'medium' | 'high' = 'low';
        if (riskScore >= 70) priority = 'high';
        else if (riskScore >= 40) priority = 'medium';
        
        
        const surveyResponse = {
          id: Date.now().toString(),
          patientName: demoProfile?.full_name || 'Demo Patient',
          patientId: demoProfile?.id || 'demo-patient',
          location: surveyData.location,
          submissionDate: new Date().toISOString(),
          wasteDisposal: surveyData.wasteDisposal,
          stagnantWater: surveyData.stagnantWater,
          sanitationFrequency: surveyData.sanitationFrequency,
          pestInfestation: surveyData.pestInfestation,
          diseaseReports: surveyData.diseaseReports,
          diseaseDetails: surveyData.diseaseDetails || '',
          additionalComments: surveyData.additionalComments || '',
          photos: [], // For demo, photos aren't stored
          riskScore: Math.min(riskScore, 100),
          priority: priority
        };
        
        
        const existingSurveys = JSON.parse(localStorage.getItem('demoSurveys') || '[]');
        const updatedSurveys = [surveyResponse, ...existingSurveys];
        localStorage.setItem('demoSurveys', JSON.stringify(updatedSurveys));
        
        result = {
          success: true,
          risk_score: Math.min(riskScore, 100),
          submitted_at: new Date().toISOString(),
          user_id: demoProfile?.id || 'demo-user',
          location: surveyData.location
        };
        
        
        toast.success('Survey shared with Dr. Demo Singh! 📋');
        
        
        setSurveyResult(result);
        setShowThankYou(true);
        
      } else {
        
        result = await environmentalService.submitSurvey({
          wasteDisposal: surveyData.wasteDisposal,
          stagnantWater: surveyData.stagnantWater,
          sanitationFrequency: surveyData.sanitationFrequency,
          pestInfestation: surveyData.pestInfestation,
          diseaseReports: surveyData.diseaseReports,
          diseaseDetails: surveyData.diseaseDetails,
          additionalComments: surveyData.additionalComments,
          location: surveyData.location,
          photos: surveyData.photos.length > 0 ? surveyData.photos : undefined
        });

        console.log('Survey submitted successfully:', result);
        
        
        setSurveyResult(result);
        setShowThankYou(true);
      }
      
    } catch (error: any) {
      console.error('Survey submission error:', error);
      
      
      if (error.message.includes('not authenticated')) {
        toast.error('Please sign in to submit surveys');
      } else if (error.message.includes('Database not set up')) {
        toast.error('Database not configured. Please complete the setup first.', {
          action: {
            label: 'Setup',
            onClick: () => {
              
              console.log('Database setup needed');
            }
          }
        });
      } else if (error.message.includes('connection') || error.message.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('upload') || error.message.includes('photo')) {
        toast.warning('Survey submitted successfully, but photos could not be uploaded.', {
          description: 'Your survey data was saved. Photo storage may need to be configured.'
        });
        
        setSurveyResult({ success: true });
        setShowThankYou(true);
      } else {
        toast.error(error.message || 'Failed to submit survey. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'yes': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'no': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  
  if (showThankYou) {
    const riskScore = surveyResult?.risk_score;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        {}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>
        
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            🙏 {t('surveyThankYou')}
          </h2>
          
          <p className="text-gray-700 mb-6">
            {t('surveyThankYouDesc')}
          </p>
          
          {riskScore !== undefined && (
            <div className={`p-4 rounded-lg mb-6 ${
              riskScore >= 70 ? 'bg-red-50 border-red-200' :
              riskScore >= 40 ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <h3 className="font-medium mb-2">
                {riskScore >= 70 ? `⚠️ ${t('highRiskArea')}` :
                 riskScore >= 40 ? `⚡ ${t('mediumRiskArea')}` :
                 `✅ ${t('lowRiskArea')}`}
              </h3>
              <p className={`text-sm ${
                riskScore >= 70 ? 'text-red-700' :
                riskScore >= 40 ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {t('riskScore')}: {riskScore}%
              </p>
              <p className={`text-xs mt-2 ${
                riskScore >= 70 ? 'text-red-600' :
                riskScore >= 40 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {riskScore >= 70 ? t('highRiskMessage') :
                 riskScore >= 40 ? t('mediumRiskMessage') :
                 t('lowRiskMessage')}
              </p>
            </div>
          )}
          
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <span>🏥</span>
              <span>{t('surveySharedWithProviders')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>{t('dataHelpsCommunity')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🌱</span>
              <span>{t('buildHealthierCommunity')}</span>
            </div>
          </div>
          
          <Button 
            onClick={onBack}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t('continueToDashboard')}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            💡 {t('submitMoreSurveys')}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-green-600">Environmental Health Survey</h1>
          <p className="text-gray-600">Help us monitor community health risks</p>
        </div>
      </div>

      {}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Survey Location</p>
            <p className="text-sm text-blue-600">
              {surveyData.location || 'Getting location...'}
            </p>
          </div>
        </div>
      </Card>

      <div className="max-w-2xl mx-auto space-y-6">
        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">1. Is there proper waste disposal nearby?</h3>
            {getResponseIcon(surveyData.wasteDisposal)}
          </div>
          <RadioGroup 
            value={surveyData.wasteDisposal} 
            onValueChange={(value: 'yes' | 'no') => setSurveyData(prev => ({ ...prev, wasteDisposal: value }))}
            className="grid grid-cols-2 gap-4"
          >
            <Label 
              htmlFor="waste-yes" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="yes" id="waste-yes" />
              <span className="text-2xl">✅</span>
              <span className="font-medium">Yes</span>
            </Label>
            <Label 
              htmlFor="waste-no" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="no" id="waste-no" />
              <span className="text-2xl">❌</span>
              <span className="font-medium">No</span>
            </Label>
          </RadioGroup>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">2. Are there stagnant water sources around?</h3>
            {getResponseIcon(surveyData.stagnantWater)}
          </div>
          <RadioGroup 
            value={surveyData.stagnantWater} 
            onValueChange={(value: 'yes' | 'no') => setSurveyData(prev => ({ ...prev, stagnantWater: value }))}
            className="grid grid-cols-2 gap-4"
          >
            <Label 
              htmlFor="water-yes" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="yes" id="water-yes" />
              <span className="text-2xl">💧</span>
              <span className="font-medium">Yes</span>
            </Label>
            <Label 
              htmlFor="water-no" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="no" id="water-no" />
              <span className="text-2xl">🚫</span>
              <span className="font-medium">No</span>
            </Label>
          </RadioGroup>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">3. How often does local sanitation happen?</h3>
            {surveyData.sanitationFrequency && (
              <span className="text-2xl">
                {surveyData.sanitationFrequency === 'daily' ? '🟢' : 
                 surveyData.sanitationFrequency === 'weekly' ? '🟡' : 
                 surveyData.sanitationFrequency === 'rarely' ? '🟠' : '🔴'}
              </span>
            )}
          </div>
          <RadioGroup 
            value={surveyData.sanitationFrequency} 
            onValueChange={(value: 'daily' | 'weekly' | 'rarely' | 'never') => 
              setSurveyData(prev => ({ ...prev, sanitationFrequency: value }))}
            className="grid grid-cols-2 gap-3"
          >
            <Label 
              htmlFor="daily" 
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="daily" id="daily" />
              <span className="text-xl">🟢</span>
              <span className="font-medium">Daily</span>
            </Label>
            <Label 
              htmlFor="weekly" 
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="weekly" id="weekly" />
              <span className="text-xl">🟡</span>
              <span className="font-medium">Weekly</span>
            </Label>
            <Label 
              htmlFor="rarely" 
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="rarely" id="rarely" />
              <span className="text-xl">🟠</span>
              <span className="font-medium">Rarely</span>
            </Label>
            <Label 
              htmlFor="never" 
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="never" id="never" />
              <span className="text-xl">🔴</span>
              <span className="font-medium">Never</span>
            </Label>
          </RadioGroup>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">4. Pest or rodent infestations nearby?</h3>
            {getResponseIcon(surveyData.pestInfestation)}
          </div>
          <RadioGroup 
            value={surveyData.pestInfestation} 
            onValueChange={(value: 'yes' | 'no') => setSurveyData(prev => ({ ...prev, pestInfestation: value }))}
            className="grid grid-cols-2 gap-4"
          >
            <Label 
              htmlFor="pest-yes" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="yes" id="pest-yes" />
              <span className="text-2xl">🐀</span>
              <span className="font-medium">Yes</span>
            </Label>
            <Label 
              htmlFor="pest-no" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="no" id="pest-no" />
              <span className="text-2xl">🚫</span>
              <span className="font-medium">No</span>
            </Label>
          </RadioGroup>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">5. Any recent disease cases in locality?</h3>
            {getResponseIcon(surveyData.diseaseReports)}
          </div>
          <RadioGroup 
            value={surveyData.diseaseReports} 
            onValueChange={(value: 'yes' | 'no') => setSurveyData(prev => ({ ...prev, diseaseReports: value }))}
            className="grid grid-cols-2 gap-4 mb-4"
          >
            <Label 
              htmlFor="disease-yes" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="yes" id="disease-yes" />
              <span className="text-2xl">🦠</span>
              <span className="font-medium">Yes</span>
            </Label>
            <Label 
              htmlFor="disease-no" 
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="no" id="disease-no" />
              <span className="text-2xl">✅</span>
              <span className="font-medium">No</span>
            </Label>
          </RadioGroup>

          {surveyData.diseaseReports === 'yes' && (
            <div className="space-y-3">
              <Label>Please provide details about the disease cases:</Label>
              <div className="relative">
                <Textarea
                  value={surveyData.diseaseDetails}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, diseaseDetails: e.target.value }))}
                  placeholder="e.g., Dengue fever, 2 cases reported last week..."
                  rows={3}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => startVoiceInput('diseaseDetails')}
                  disabled={isListening && activeVoiceField !== 'diseaseDetails'}
                >
                  {isListening && activeVoiceField === 'diseaseDetails' ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-blue-500" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">📷 Upload Photos (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Take photos of sanitation issues, stagnant water, or waste problems
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer bg-blue-50 p-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600">Take Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {surveyData.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {surveyData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
                      onClick={() => removePhoto(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">💬 Additional Comments (Optional)</h3>
          <div className="relative">
            <Textarea
              value={surveyData.additionalComments}
              onChange={(e) => setSurveyData(prev => ({ ...prev, additionalComments: e.target.value }))}
              placeholder="Any other health or cleanliness concerns in your area..."
              rows={3}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => startVoiceInput('additionalComments')}
              disabled={isListening && activeVoiceField !== 'additionalComments'}
            >
              {isListening && activeVoiceField === 'additionalComments' ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4 text-blue-500" />
              )}
            </Button>
          </div>
        </Card>

        {}
        <Card className="p-6 bg-green-50 border-green-200">
          <Button
            onClick={submitSurvey}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting Survey...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Submit Survey</span>
              </div>
            )}
          </Button>
          <p className="text-sm text-green-700 mt-3 text-center">
            Thank you for helping keep our community healthy! 🌱
          </p>
        </Card>
      </div>
    </div>
  );
}