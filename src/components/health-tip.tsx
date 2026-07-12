import React from 'react';
import { useLanguage } from './language-context';
import { Card } from './ui/card';

interface HealthTipProps {
  featureId: string;
  className?: string;
}

export function HealthTip({ featureId, className = '' }: HealthTipProps) {
  const { language } = useLanguage();

  const getHealthTip = (itemId: string) => {
    const tips = {
      'emergency': {
        en: "💪 Stay prepared, stay safe! Your health is your greatest wealth - protect it always. Remember: knowing how to respond in emergencies can save lives.",
        hi: "💪 तैयार रहें, सुरक्षित रहें! आपका स्वास्थ्य आपकी सबसे बड़ी संपत्ति है - इसे हमेशा बचाएं। याद रखें: आपातकाल में कैसे प्रतिक्रिया करना जानना जीवन बचा सकता है।",
        pa: "💪 ਤਿਆਰ ਰਹੋ, ਸੁਰੱਖਿਤ ਰਹੋ! ਤੁਹਾਡੀ ਸਿਹਤ ਤੁਹਾਡੀ ਸਭ ਤੋਂ ਵੱਡੀ ਦੌਲਤ ਹੈ - ਇਸਨੂੰ ਹਮੇਸ਼ਾ ਬਚਾਓ। ਯਾਦ ਰੱਖੋ: ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਜਵਾਬ ਦੇਣਾ ਜਾਣਨਾ ਜ਼ਿੰਦਗੀਆਂ ਬਚਾ ਸਕਦਾ ਹੈ।"
      },
      'consultation': {
        en: "🌟 Every consultation is a step towards better health. You deserve the best care & brightest future! Open communication with your doctor builds trust and better outcomes.",
        hi: "🌟 हर परामर्श बेहतर स्वास्थ्य की दिशा में एक कदम है। आप सर्वोत्तम देखभाल और उज्ज्वल भविष्य के हकदार हैं! डॉक्टर के साथ खुला संवाद विश्वास और बेहतर परिणाम बनाता है।",
        pa: "🌟 ਹਰ ਸਲਾਹ ਬਿਹਤਰ ਸਿਹਤ ਵੱਲ ਇੱਕ ਕਦਮ ਹੈ। ਤੁਸੀਂ ਵਧੀਆ ਦੇਖਭਾਲ ਅਤੇ ਚਮਕਦਾਰ ਭਵਿੱਖ ਦੇ ਹੱਕਦਾਰ ਹੋ! ਡਾਕਟਰ ਨਾਲ ਖੁੱਲ੍ਹਾ ਸੰਚਾਰ ਭਰੋਸਾ ਅਤੇ ਬਿਹਤਰ ਨਤੀਜੇ ਬਣਾਉਂਦਾ ਹੈ।"
      },
      'symptoms': {
        en: "🧠 Knowledge is power! Understanding your body helps you live your healthiest, happiest life. Early detection and awareness are your best allies in wellness.",
        hi: "🧠 ज्ञान ही शक्ति है! अपने शरीर को समझना आपको स्वस्थ और खुशहाल जीवन जीने में मदद करता है। प्रारंभिक पहचान और जागरूकता कल्याण में आपके सबसे अच्छे सहयोगी हैं।",
        pa: "🧠 ਗਿਆਨ ਹੀ ਸ਼ਕਤੀ ਹੈ! ਆਪਣੇ ਸਰੀਰ ਨੂੰ ਸਮਝਣਾ ਤੁਹਾਨੂੰ ਸਿਹਤਮੰਦ ਅਤੇ ਖੁਸ਼ਹਾਲ ਜੀਵਨ ਜੀਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਖੋਜ ਅਤੇ ਜਾਗਰੂਕਤਾ ਤੰਦਰੁਸਤੀ ਵਿੱਚ ਤੁਹਾਡੇ ਸਭ ਤੋਂ ਚੰਗੇ ਸਹਿਯੋਗੀ ਹਨ।"
      },
      'voice-symptoms': {
        en: "🎤 Your voice matters deeply! Speak up for your health - every word builds your wellness journey. Technology is here to understand and support you better.",
        hi: "🎤 आपकी आवाज़ बहुत महत्वपूर्ण है! अपनी स्वास्थ्य के लिए बोलें - हर शब्द आपकी कल्याण यात्रा बनाता है। तकनीक यहाँ आपको बेहतर समझने और सहायता करने के लिए है।",
        pa: "🎤 ਤੁਹਾਡੀ ਆਵਾਜ਼ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਹੈ! ਆਪਣੀ ਸਿਹਤ ਲਈ ਬੋਲੋ - ਹਰ ਸ਼ਬਦ ਤੁਹਾਡੀ ਤੰਦਰੁਸਤੀ ਯਾਤਰਾ ਬਣਾਉਂਦਾ ਹੈ। ਤਕਨੀਕ ਤੁਹਾਨੂੰ ਬਿਹਤਰ ਸਮਝਣ ਅਤੇ ਸਹਾਇਤਾ ਕਰਨ ਲਈ ਇੱਥੇ ਹੈ।"
      },
      'healthcard': {
        en: "📋 Your health story is precious! Every record is a chapter of resilience, strength & hope. Keeping track of your health journey empowers you to make informed decisions.",
        hi: "📋 आपकी स्वास्थ्य कहानी अनमोल है! हर रिकॉर्ड दृढ़ता, शक्ति और आशा का अध्याय है। अपनी स्वास्थ्य यात्रा का ट्रैक रखना आपको सूचित निर्णय लेने में सशक्त बनाता है।",
        pa: "📋 ਤੁਹਾਡੀ ਸਿਹਤ ਦੀ ਕਹਾਣੀ ਅਨਮੋਲ ਹੈ! ਹਰ ਰਿਕਾਰਡ ਦ੍ਰਿੜ੍ਹਤਾ, ਤਾਕਤ ਅਤੇ ਉਮੀਦ ਦਾ ਅਧਿਆਇ ਹੈ। ਆਪਣੀ ਸਿਹਤ ਯਾਤਰਾ ਦਾ ਟਰੈਕ ਰੱਖਣਾ ਤੁਹਾਨੂੰ ਜਾਣਕਾਰ ਫੈਸਲੇ ਲੈਣ ਲਈ ਸ਼ਕਤੀ ਦਿੰਦਾ ਹੈ।"
      },
      'appointments': {
        en: "📅 Consistency breeds greatness! Every appointment is an investment in your vibrant future. Regular checkups are the cornerstone of preventive healthcare.",
        hi: "📅 निरंतरता महानता लाती है! हर अपॉइंटमेंट आपके जीवंत भविष्य में निवेश है। नियमित जांच निवारक स्वास्थ्य देखभाल की आधारशिला है।",
        pa: "📅 ਨਿਰੰਤਰਤਾ ਮਹਾਨਤਾ ਲਿਆਉਂਦੀ ਹੈ! ਹਰ ਮੁਲਾਕਾਤ ਤੁਹਾਡੇ ਜੀਵੰਤ ਭਵਿੱਖ ਵਿੱਚ ਨਿਵੇਸ਼ ਹੈ। ਨਿਯਮਿਤ ਜਾਂਚ ਰੋਕਥਾਮ ਸਿਹਤ ਦੇਖਭਾਲ ਦੀ ਨੀਂਹ ਹੈ।"
      },
      'medical-records': {
        en: "📚 Your health journey is a masterpiece! Every record tells your incredible story of courage. Organized health records help doctors provide you with the best possible care.",
        hi: "📚 आपकी स्वास्थ्य यात्रा एक कृति है! हर रिकॉर्ड आपकी साहस की अविश्वसनीय कहानी कहता है। व्यवस्थित स्वास्थ्य रिकॉर्ड डॉक्टरों को आपको सर्वोत्तम संभावित देखभाल प्रदान करने में मदद करते हैं।",
        pa: "📚 ਤੁਹਾਡੀ ਸਿਹਤ ਯਾਤਰਾ ਇੱਕ ਮਾਸਟਰਪੀਸ ਹੈ! ਹਰ ਰਿਕਾਰਡ ਤੁਹਾਡੀ ਹਿੰਮਤ ਦੀ ਅਦਭੁਤ ਕਹਾਣੀ ਦੱਸਦਾ ਹੈ। ਸੰਗਠਿਤ ਸਿਹਤ ਰਿਕਾਰਡ ਡਾਕਟਰਾਂ ਨੂੰ ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਸੰਭਵ ਦੇਖਭਾਲ ਪ੍ਰਦਾਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।"
      },
      'hospitals': {
        en: "🏥 Healing hands are always near! Your community stands strong with you on every step. Quality healthcare is a right, not a privilege - you deserve access to the best.",
        hi: "🏥 चिकित्सक हाथ हमेशा पास हैं! आपका समुदाय हर कदम पर आपके साथ मजबूती से खड़ा है। गुणवत्तापूर्ण स्वास्थ्य देखभाल एक अधिकार है, विशेषाधिकार नहीं - आप सबसे अच्छी तक पहुंच के हकदार हैं।",
        pa: "🏥 ਇਲਾਜ ਕਰਨ ਵਾਲੇ ਹੱਥ ਹਮੇਸ਼ਾ ਨੇੜੇ ਹਨ! ਤੁਹਾਡਾ ਕਮਿਊਨਿਟੀ ਹਰ ਕਦਮ 'ਤੇ ਤੁਹਾਡੇ ਨਾਲ ਮਜ਼ਬੂਤੀ ਨਾਲ ਖੜ੍ਹਾ ਹੈ। ਗੁਣਵੱਤਾ ਸਿਹਤ ਦੇਖਭਾਲ ਇੱਕ ਹੱਕ ਹੈ, ਵਿਸ਼ੇਸ਼ਾਧਿਕਾਰ ਨਹੀਂ - ਤੁਸੀਂ ਸਭ ਤੋਂ ਵਧੀਆ ਤੱਕ ਪਹੁੰਚ ਦੇ ਹੱਕਦਾਰ ਹੋ।"
      },
      'pharmacies': {
        en: "💊 Healing is your birthright! Every medicine brings you closer to your strongest self. Proper medication adherence is key to successful treatment and recovery.",
        hi: "💊 स्वास्थ्य लाभ आपका जन्मसिद्ध अधिकार है! हर दवा आपको अपने सबसे मजबूत रूप के करीब लाती है। उचित दवा पालन सफल उपचार और रिकवरी की कुंजी है।",
        pa: "💊 ਸਿਹਤਯਾਬੀ ਤੁਹਾਡਾ ਜਨਮਸਿੱਧ ਅਧਿਕਾਰ ਹੈ! ਹਰ ਦਵਾਈ ਤੁਹਾਨੂੰ ਆਪਣੇ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਰੂਪ ਦੇ ਨੇੜੇ ਲਿਆਉਂਦੀ ਹੈ। ਸਹੀ ਦਵਾਈ ਪਾਲਣਾ ਸਫਲ ਇਲਾਜ ਅਤੇ ਰਿਕਵਰੀ ਦੀ ਕੁੰਜੀ ਹੈ।"
      },
      'notifications': {
        en: "🔔 Stay informed, stay empowered! Knowledge lights up your path to extraordinary health. Timely health reminders help you maintain consistent wellness habits.",
        hi: "🔔 जानकारी रखें, सशक्त रहें! ज्ञान असाधारण स्वास्थ्य के लिए आपका रास्ता रोशन करता है। समय पर स्वास्थ्य अनुस्मारक आपको निरंतर कल्याण की आदतें बनाए रखने में मदद करते हैं।",
        pa: "🔔 ਜਾਣਕਾਰੀ ਰੱਖੋ, ਸ਼ਕਤੀਸ਼ਾਲੀ ਰਹੋ! ਗਿਆਨ ਅਸਾਧਾਰਨ ਸਿਹਤ ਲਈ ਤੁਹਾਡਾ ਰਾਹ ਰੋਸ਼ਨ ਕਰਦਾ ਹੈ। ਸਮੇਂ ਸਿਰ ਸਿਹਤ ਯਾਦਦਿਹਾਨੀਆਂ ਤੁਹਾਨੂੰ ਲਗਾਤਾਰ ਤੰਦਰੁਸਤੀ ਆਦਤਾਂ ਬਣਾਈ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀਆਂ ਹਨ।"
      },
      'survey': {
        en: "🌱 Your voice creates healthier tomorrows! Together we bloom into a thriving community. Community health surveys help identify and solve public health challenges.",
        hi: "🌱 आपकी आवाज़ स्वस्थ कल बनाती है! मिलकर हम एक समृद्ध समुदाय में खिलते हैं। सामुदायिक स्वास्थ्य सर्वेक्षण सार्वजनिक स्वास्थ्य चुनौतियों की पहचान और समाधान में मदद करते हैं।",
        pa: "🌱 ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸਿਹਤਮੰਦ ਕੱਲ੍ਹ ਬਣਾਉਂਦੀ ਹੈ! ਮਿਲ ਕੇ ਅਸੀਂ ਇੱਕ ਸਫਲ ਕਮਿਊਨਿਟੀ ਵਿੱਚ ਖਿੜਦੇ ਹਾਂ। ਕਮਿਊਨਿਟੀ ਸਿਹਤ ਸਰਵੇ ਜਨਤਕ ਸਿਹਤ ਚੁਣੌਤੀਆਂ ਦੀ ਪਛਾਣ ਅਤੇ ਹੱਲ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।"
      },
      'pregnancy': {
        en: "👶 You're nurturing life's greatest miracle! Every heartbeat is pure magic & infinite love. Prenatal care and self-care are gifts you give to both you and your baby.",
        hi: "👶 आप जीवन के सबसे बड़े चमत्कार का पोषण कर रहे हैं! हर धड़कन शुद्ध जादू और अनंत प्रेम है। प्रसवपूर्व देखभाल और स्व-देखभाल आप और आपके बच्चे दोनों को दिए गए उपहार हैं।",
        pa: "👶 ਤੁਸੀਂ ਜ਼ਿੰਦਗੀ ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਚਮਤਕਾਰ ਦਾ ਪਾਲਣ ਪੋਸ਼ਣ ਕਰ ਰਹੇ ਹੋ! ਹਰ ਧੜਕਨ ਸ਼ੁੱਧ ਜਾਦੂ ਅਤੇ ਬੇਅੰਤ ਪਿਆਰ ਹੈ। ਜਨਮ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਦੇਖਭਾਲ ਅਤੇ ਸਵੈ-ਦੇਖਭਾਲ ਤੁਸੀਂ ਅਤੇ ਤੁਹਾਡੇ ਬੱਚੇ ਦੋਵਾਂ ਨੂੰ ਦਿੱਤੇ ਗਏ ਤੋਹਫੇ ਹਨ।"
      },
      'medcoins': {
        en: "✨ Your wellness journey deserves rewards! Every healthy choice adds value to your life. Med Coins celebrate your commitment to better health.",
        hi: "✨ आपकी कल्याण यात्रा पुरस्कार की हकदार है! हर स्वस्थ विकल्प आपके जीवन में मूल्य जोड़ता है। मेड कॉइन्स बेहतर स्वास्थ्य के प्रति आपकी प्रतिबद्धता का जश्न मनाते हैं।",
        pa: "✨ ਤੁਹਾਡੀ ਤੰਦਰੁਸਤੀ ਯਾਤਰਾ ਇਨਾਮ ਦੀ ਹੱਕਦਾਰ ਹੈ! ਹਰ ਸਿਹਤਮੰਦ ਚੋਣ ਤੁਹਾਡੇ ਜੀਵਨ ਵਿੱਚ ਮੁੱਲ ਜੋੜਦੀ ਹੈ। ਮੇਡ ਕੋਇਨਸ ਬਿਹਤਰ ਸਿਹਤ ਲਈ ਤੁਹਾਡੀ ਵਚਨਬੱਧਤਾ ਦਾ ਜਸ਼ਨ ਮਨਾਉਂਦੇ ਹਨ।"
      }
    };
    
    const tip = tips[itemId as keyof typeof tips];
    if (!tip) return "";
    
    if (language === 'hi') return tip.hi;
    if (language === 'pa') return tip.pa;
    return tip.en;
  };

  const tipText = getHealthTip(featureId);
  
  if (!tipText) return null;

  return (
    <div className={`mt-8 ${className}`}>
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-100 p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">💡</span>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-3">
            {language === 'en' ? '🌟 Health Motivation' : 
             language === 'hi' ? '🌟 स्वास्थ्य प्रेरणा' : 
             '🌟 ਸਿਹਤ ਪ੍ਰੇਰਣਾ'}
          </h3>
          <p className="text-gray-700 leading-relaxed font-medium italic">
            {tipText}
          </p>
        </div>
      </Card>
    </div>
  );
}