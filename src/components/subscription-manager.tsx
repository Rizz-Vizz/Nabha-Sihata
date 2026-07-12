import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Crown, 
  Check, 
  X, 
  Star, 
  Shield, 
  Zap, 
  Clock, 
  Users, 
  Video, 
  Phone,
  Calendar,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SubscriptionManagerProps {
  onBack: () => void;
}

type PlanType = 'basic' | 'premium' | 'family' | 'emergency';

interface SubscriptionPlan {
  id: PlanType;
  name: string;
  nameHi: string;
  namePa: string;
  price: number;
  originalPrice?: number;
  period: string;
  periodHi: string;
  periodPa: string;
  description: string;
  descriptionHi: string;
  descriptionPa: string;
  features: string[];
  featuresHi: string[];
  featuresPa: string[];
  popular?: boolean;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  medCoinsReward: number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Care',
    nameHi: 'बेसिक केयर',
    namePa: 'ਬੇਸਿਕ ਦੇਖਭਾਲ',
    price: 99,
    period: '/month',
    periodHi: '/महीना',
    periodPa: '/ਮਹੀਨਾ',
    description: 'Essential healthcare for individuals',
    descriptionHi: 'व्यक्तियों के लिए आवश्यक स्वास्थ्य सेवा',
    descriptionPa: 'ਵਿਅਕਤੀਆਂ ਲਈ ਜ਼ਰੂਰੀ ਸਿਹਤ ਸੇਵਾ',
    features: [
      '2 Doctor consultations per month',
      'Basic health monitoring',
      'Emergency helpline access',
      'Digital health records',
      'Medicine reminders'
    ],
    featuresHi: [
      'महीने में 2 डॉक्टर परामर्श',
      'बुनियादी स्वास्थ्य निगरानी',
      'आपातकालीन हेल्पलाइन पहुंच',
      'डिजिटल स्वास्थ्य रिकॉर्ड',
      'दवा अनुस्मारक'
    ],
    featuresPa: [
      'ਮਹੀਨੇ ਵਿੱਚ 2 ਡਾਕਟਰ ਸਲਾਹ',
      'ਬੁਨਿਆਦੀ ਸਿਹਤ ਨਿਗਰਾਨੀ',
      'ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ ਪਹੁੰਚ',
      'ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ',
      'ਦਵਾਈ ਯਾਦ ਦਿਲਾਉਣੇ'
    ],
    color: 'from-blue-400 to-blue-600',
    icon: Shield,
    medCoinsReward: 20
  },
  {
    id: 'premium',
    name: 'Premium Care',
    nameHi: 'प्रीमियम केयर',
    namePa: 'ਪ੍ਰੀਮੀਅਮ ਦੇਖਭਾਲ',
    price: 199,
    originalPrice: 299,
    period: '/month',
    periodHi: '/महीना',
    periodPa: '/ਮਹੀਨਾ',
    description: 'Comprehensive healthcare with priority support',
    descriptionHi: 'प्राथमिकता सहायता के साथ व्यापक स्वास्थ्य सेवा',
    descriptionPa: 'ਤਰਜੀਹੀ ਸਹਾਇਤਾ ਨਾਲ ਵਿਆਪਕ ਸਿਹਤ ਸੇਵਾ',
    features: [
      'Unlimited doctor consultations',
      'Priority appointment booking',
      '24/7 emergency support',
      'Specialist consultations',
      'Health insurance support',
      'Family health tracking',
      'Prescription delivery'
    ],
    featuresHi: [
      'असीमित डॉक्टर परामर्श',
      'प्राथमिकता अपॉइंटमेंट बुकिंग',
      '24/7 आपातकालीन सहायता',
      'विशेषज्ञ परामर्श',
      'स्वास्थ्य बीमा सहायता',
      'पारिवारिक स्वास्थ्य ट्रैकिंग',
      'प्रिस्क्रिप्शन डिलीवरी'
    ],
    featuresPa: [
      'ਅਸੀਮਤ ਡਾਕਟਰ ਸਲਾਹ',
      'ਤਰਜੀਹੀ ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ',
      '24/7 ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ',
      'ਮਾਹਿਰ ਸਲਾਹ',
      'ਸਿਹਤ ਬੀਮਾ ਸਹਾਇਤਾ',
      'ਪਰਿਵਾਰਿਕ ਸਿਹਤ ਟਰੈਕਿੰਗ',
      'ਨੁਸਖਾ ਡਿਲੀਵਰੀ'
    ],
    popular: true,
    color: 'from-purple-400 to-purple-600',
    icon: Crown,
    medCoinsReward: 50
  },
  {
    id: 'family',
    name: 'Family Care',
    nameHi: 'फैमिली केयर',
    namePa: 'ਪਰਿਵਾਰਿਕ ਦੇਖਭਾਲ',
    price: 299,
    period: '/month',
    periodHi: '/महीना',
    periodPa: '/ਮਹੀਨਾ',
    description: 'Complete healthcare for your entire family',
    descriptionHi: 'आपके पूरे परिवार के लिए पूर्ण स्वास्थ्य सेवा',
    descriptionPa: 'ਤੁਹਾਡੇ ਪੂਰੇ ਪਰਿਵਾਰ ਲਈ ਪੂਰੀ ਸਿਹਤ ਸੇਵਾ',
    features: [
      'Up to 6 family members',
      'Unlimited consultations for all',
      'Child and elderly care',
      'Pregnancy care included',
      'Vaccination tracking',
      'Growth monitoring',
      'Family health dashboard'
    ],
    featuresHi: [
      '6 परिवारिक सदस्यों तक',
      'सभी के लिए असीमित परामर्श',
      'बच्चे और बुजुर्गों की देखभाल',
      'गर्भावस्था देखभाल शामिल',
      'टीकाकरण ट्रैकिंग',
      'विकास निगरानी',
      'पारिवारिक स्वास्थ्य डैशबोर्ड'
    ],
    featuresPa: [
      '6 ਪਰਿਵਾਰਿਕ ਮੈਂਬਰਾਂ ਤੱਕ',
      'ਸਭ ਲਈ ਅਸੀਮਤ ਸਲਾਹ',
      'ਬੱਚਿਆਂ ਅਤੇ ਬਜੁਰਗਾਂ ਦੀ ਦੇਖਭਾਲ',
      'ਗਰਭ ਦੇਖਭਾਲ ਸ਼ਾਮਲ',
      'ਟੀਕਾਕਰਨ ਟਰੈਕਿੰਗ',
      'ਵਿਕਾਸ ਨਿਗਰਾਨੀ',
      'ਪਰਿਵਾਰਿਕ ਸਿਹਤ ਡੈਸ਼ਬੋਰਡ'
    ],
    color: 'from-green-400 to-green-600',
    icon: Users,
    medCoinsReward: 80
  },
  {
    id: 'emergency',
    name: 'Emergency Plus',
    nameHi: 'इमरजेंसी प्लस',
    namePa: 'ਐਮਰਜੈਂਸੀ ਪਲੱਸ',
    price: 149,
    period: '/month',
    periodHi: '/महीना',
    periodPa: '/ਮਹੀਨਾ',
    description: 'Priority emergency response and care',
    descriptionHi: 'प्राथमिकता आपातकालीन प्रतिक्रिया और देखभाल',
    descriptionPa: 'ਤਰਜੀਹੀ ਐਮਰਜੈਂਸੀ ਜਵਾਬ ਅਤੇ ਦੇਖਭਾਲ',
    features: [
      'Instant emergency response',
      'Ambulance priority dispatch',
      'ICU bed reservation',
      'Emergency contacts alert',
      'GPS medical tracking',
      'Critical care coordination'
    ],
    featuresHi: [
      'तत्काल आपातकालीन प्रतिक्रिया',
      'एम्बुलेंस प्राथमिकता डिस्पैच',
      'आईसीयू बेड आरक्षण',
      'आपातकालीन संपर्क अलर्ट',
      'जीपीएस चिकित्सा ट्रैकिंग',
      'गंभीर देखभाल समन्वय'
    ],
    featuresPa: [
      'ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਜਵਾਬ',
      'ਐਂਬੁਲੈਂਸ ਤਰਜੀਹੀ ਭੇਜਣਾ',
      'ਆਈਸੀਯੂ ਬੈੱਡ ਰਿਜ਼ਰਵੇਸ਼ਨ',
      'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਅਲਰਟ',
      'ਜੀਪੀਐਸ ਮੈਡੀਕਲ ਟਰੈਕਿੰਗ',
      'ਗੰਭੀਰ ਦੇਖਭਾਲ ਤਾਲਮੇਲ'
    ],
    color: 'from-red-400 to-red-600',
    icon: Zap,
    medCoinsReward: 40
  }
];

export function SubscriptionManager({ onBack }: SubscriptionManagerProps) {
  const { t, language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<PlanType | null>('basic'); 
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getName = (plan: SubscriptionPlan) => {
    return language === 'hi' ? plan.nameHi : language === 'pa' ? plan.namePa : plan.name;
  };

  const getPeriod = (plan: SubscriptionPlan) => {
    return language === 'hi' ? plan.periodHi : language === 'pa' ? plan.periodPa : plan.period;
  };

  const getDescription = (plan: SubscriptionPlan) => {
    return language === 'hi' ? plan.descriptionHi : language === 'pa' ? plan.descriptionPa : plan.description;
  };

  const getFeatures = (plan: SubscriptionPlan) => {
    return language === 'hi' ? plan.featuresHi : language === 'pa' ? plan.featuresPa : plan.features;
  };

  const handleSubscribeClick = (planId: PlanType) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    
    setTimeout(() => {
      setCurrentSubscription(selectedPlan);
      setShowPaymentModal(false);
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (plan) {
        toast.success(`🎉 ${language === 'en' ? 'Successfully subscribed to' : language === 'hi' ? 'सफलतापूर्वक सब्सक्राइब किया गया' : 'ਸਫਲਤਾਪੂਰਵਕ ਸਬਸਕਰਾਈਬ ਕੀਤਾ ਗਿਆ'} ${getName(plan)}!`);
      }
    }, 2000);
  };

  if (showPaymentModal && selectedPlan) {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan)!;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                <plan.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Complete Subscription' : language === 'hi' ? 'सब्सक्रिप्शन पूरा करें' : 'ਸਬਸਕਰਿਪਸ਼ਨ ਪੂਰਾ ਕਰੋ'}
              </h2>
              <p className="text-gray-600">{getName(plan)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  {language === 'en' ? 'Plan' : language === 'hi' ? 'योजना' : 'ਯੋਜਨਾ'}:
                </span>
                <span className="font-bold">{getName(plan)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  {language === 'en' ? 'Price' : language === 'hi' ? 'मूल्य' : 'ਕੀਮਤ'}:
                </span>
                <span className="font-bold text-green-600">₹{plan.price}{getPeriod(plan)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Med Coins:</span>
                <span className="font-bold text-orange-600">+{plan.medCoinsReward}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Payment Method' : language === 'hi' ? 'भुगतान विधि' : 'ਭੁਗਤਾਨ ਵਿਧੀ'}
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                    <input type="radio" name="payment" value="upi" defaultChecked className="text-blue-600" />
                    <span>💳 UPI / Digital Wallet</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input type="radio" name="payment" value="card" className="text-blue-600" />
                    <span>💳 Credit/Debit Card</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input type="radio" name="payment" value="netbanking" className="text-blue-600" />
                    <span>🏦 Net Banking</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  {language === 'en' ? 'Cancel' : language === 'hi' ? 'रद्द करें' : 'ਰੱਦ ਕਰੋ'}
                </Button>
                <Button
                  onClick={handlePayment}
                  className={`flex-1 bg-gradient-to-r ${plan.color} text-white`}
                >
                  ₹{plan.price} {language === 'en' ? 'Pay Now' : language === 'hi' ? 'अभी भुगतान करें' : 'ਹੁਣੇ ਭੁਗਤਾਨ ਕਰੋ'}
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 {language === 'en' ? 'Secure payment powered by Razorpay' : language === 'hi' ? 'रेज़रपे द्वारा संचालित सुरक्षित भुगतान' : 'ਰੇਜ਼ਰਪੇ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਸੁਰੱਖਿਤ ਭੁਗਤਾਨ'}
              </p>
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
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {language === 'en' ? 'Subscription Plans' : language === 'hi' ? 'सब्सक्रिप्शन योजनाएं' : 'ਸਬਸਕਰਿਪਸ਼ਨ ਯੋਜਨਾਵਾਂ'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Choose the perfect healthcare plan for you' : language === 'hi' ? 'अपने लिए सही स्वास्थ्य योजना चुनें' : 'ਆਪਣੇ ਲਈ ਸਹੀ ਸਿਹਤ ਯੋਜਨਾ ਚੁਣੋ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {}
        {currentSubscription && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  {language === 'en' ? 'Current Plan' : language === 'hi' ? 'वर्तमान योजना' : 'ਮੌਜੂਦਾ ਯੋਜਨਾ'}
                </h3>
                <p className="text-gray-600">
                  {getName(subscriptionPlans.find(p => p.id === currentSubscription)!)} 
                  <Badge className="ml-2 bg-green-100 text-green-700">
                    {language === 'en' ? 'Active' : language === 'hi' ? 'सक्रिय' : 'ਸਰਗਰਮ'}
                  </Badge>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Next billing' : language === 'hi' ? 'अगला बिल' : 'ਅਗਲਾ ਬਿੱਲ'}
                </p>
                <p className="font-bold text-gray-800">Oct 24, 2025</p>
              </div>
            </div>
          </Card>
        )}

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = currentSubscription === plan.id;
            const canUpgrade = currentSubscription && plan.price > subscriptionPlans.find(p => p.id === currentSubscription)!.price;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative p-6 hover:shadow-xl transition-all transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-purple-300 border-purple-200' : ''
                } ${isCurrentPlan ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    {language === 'en' ? 'Most Popular' : language === 'hi' ? 'सबसे लोकप्रिय' : 'ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ'}
                  </Badge>
                )}

                {isCurrentPlan && (
                  <Badge className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    {language === 'en' ? 'Current' : language === 'hi' ? 'वर्तमान' : 'ਮੌਜੂਦਾ'}
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{getName(plan)}</h3>
                  <p className="text-gray-600 text-sm mb-4">{getDescription(plan)}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice}</span>
                    )}
                    <span className="text-3xl font-bold text-gray-800">₹{plan.price}</span>
                    <span className="text-gray-600">{getPeriod(plan)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-orange-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">+{plan.medCoinsReward} Med Coins</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {getFeatures(plan).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleSubscribeClick(plan.id)}
                  className={`w-full ${
                    isCurrentPlan 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan 
                    ? (language === 'en' ? 'Current Plan' : language === 'hi' ? 'वर्तमान योजना' : 'ਮੌਜੂਦਾ ਯੋਜਨਾ')
                    : canUpgrade
                    ? (language === 'en' ? 'Upgrade' : language === 'hi' ? 'अपग्रेड करें' : 'ਅਪਗ੍ਰੇਡ ਕਰੋ')
                    : (language === 'en' ? 'Subscribe' : language === 'hi' ? 'सब्सक्राइब करें' : 'ਸਬਸਕਰਾਈਬ ਕਰੋ')
                  }
                </Button>
              </Card>
            );
          })}
        </div>

        {}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {language === 'en' ? 'Why Choose Nabha Sihata Subscription?' : language === 'hi' ? 'नभा सिहाता सब्सक्रिप्शन क्यों चुनें?' : 'ਨਭਾ ਸਿਹਾਤਾ ਸਬਸਕਰਿਪਸ਼ਨ ਕਿਉਂ ਚੁਣੋ?'}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {language === 'en' ? '24/7 Support' : language === 'hi' ? '24/7 सहायता' : '24/7 ਸਹਾਇਤਾ'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Round-the-clock medical assistance whenever you need it' 
                  : language === 'hi'
                  ? 'जब भी आपको जरूरत हो चिकित्सा सहायता'
                  : 'ਜਦੋਂ ਵੀ ਤੁਹਾਨੂੰ ਲੋੜ ਹੋਵੇ ਮੈਡੀਕਲ ਸਹਾਇਤਾ'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Expert Doctors' : language === 'hi' ? 'विशेषज्ञ डॉक्टर' : 'ਮਾਹਿਰ ਡਾਕਟਰ'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Qualified doctors with rural healthcare experience' 
                  : language === 'hi'
                  ? 'ग्रामीण स्वास्थ्य सेवा अनुभव वाले योग्य डॉक्टर'
                  : 'ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਤਜਰਬਾ ਵਾਲੇ ਯੋਗ ਡਾਕਟਰ'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {language === 'en' ? 'Privacy First' : language === 'hi' ? 'गोपनीयता पहले' : 'ਗੋਪਨੀਯਤਾ ਪਹਿਲਾਂ'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Your health data is encrypted and secure' 
                  : language === 'hi'
                  ? 'आपका स्वास्थ्य डेटा एन्क्रिप्टेड और सुरक्षित है'
                  : 'ਤੁਹਾਡਾ ਸਿਹਤ ਡੇਟਾ ਐਨਕ੍ਰਿਪਟਿਡ ਅਤੇ ਸੁਰੱਖਿਤ ਹੈ'
                }
              </p>
            </div>
          </div>
        </Card>

        {}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'en' ? 'Frequently Asked Questions' : language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ'}
          </h3>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                {language === 'en' ? 'Can I cancel anytime?' : language === 'hi' ? 'क्या मैं कभी भी रद्द कर सकता हूं?' : 'ਕੀ ਮੈਂ ਕਦੇ ਵੀ ਰੱਦ ਕਰ ਸਕਦਾ ਹਾਂ?'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Yes, you can cancel your subscription at any time from your account settings.' 
                  : language === 'hi'
                  ? 'हां, आप अपनी खाता सेटिंग्स से कभी भी अपनी सब्सक्रिप्शन रद्द कर सकते हैं।'
                  : 'ਹਾਂ, ਤੁਸੀਂ ਆਪਣੀ ਖਾਤਾ ਸੈਟਿੰਗਾਂ ਤੋਂ ਕਦੇ ਵੀ ਆਪਣੀ ਸਬਸਕਰਿਪਸ਼ਨ ਰੱਦ ਕਰ ਸਕਦੇ ਹੋ।'
                }
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                {language === 'en' ? 'What about data privacy?' : language === 'hi' ? 'डेटा गोपनीयता के बारे में क्या?' : 'ਡੇਟਾ ਗੋਪਨੀਯਤਾ ਬਾਰੇ ਕੀ?'}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'All your health data is encrypted and stored securely. We never share your personal information.' 
                  : language === 'hi'
                  ? 'आपका सभी स्वास्थ्य डेटा एन्क्रिप्टेड है और सुरक्षित रूप से संग्रहीत है। हम कभी भी आपकी व्यक्तिगत जानकारी साझा नहीं करते।'
                  : 'ਤੁਹਾਡਾ ਸਾਰਾ ਸਿਹਤ ਡੇਟਾ ਐਨਕ੍ਰਿਪਟਿਡ ਹੈ ਅਤੇ ਸੁਰੱਖਿਤ ਰੂਪ ਵਿੱਚ ਸਟੋਰ ਕੀਤਾ ਗਿਆ ਹੈ। ਅਸੀਂ ਕਦੇ ਵੀ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਨਹੀਂ ਕਰਦੇ।'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}